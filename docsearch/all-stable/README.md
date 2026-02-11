# DocSearch All-stable Workflow

This directory contains a standalone DocSearch pipeline that builds one stable index per language.

## Purpose

Legacy DocSearch uses many indexes by product/version.

This all-stable workflow keeps only:

- `en-tidb-all-stable`
- `zh-tidb-all-stable`

This makes search integration simpler when UI should query one index per language.

## Directory Layout

- `all-stable/configs/`: all crawler configs and state files
- `all-stable/configs/en-all-stable-full.json`: English full crawl config (prod)
- `all-stable/configs/zh-all-stable-full.json`: Chinese full crawl config (prod)
- `all-stable/configs/runlist-incremental.json`: incremental config run order
- `all-stable/configs/runlist-preview-full.json`: preview full config run order (separate from incremental)
- `all-stable/configs/latest_commit.json`: incremental base commit state
- `all-stable/scripts/crawl-full.sh`: production full crawl entry
- `all-stable/scripts/crawl-preview-full.sh`: preview full prewarm entry (no sitemap dependency)
- `all-stable/scripts/check-crawl-errors.sh`: shared crawl-log error gate helper
- `all-stable/scripts/crawl-incremental.sh`: incremental crawl entry
- `all-stable/scripts/sync-latest-commit.sh`: commit-state sync helper
- `all-stable/MIGRATION.md`: old-path to new-path mapping

## How Configs Drive Crawler Behavior

### Text selector strategy (`selectors.default.text`)

Legacy text selector (CSS) was:

```css
.doc-content p, .doc-content li, .doc-content table tr, .doc-content code span
```

For all-stable configs, we switched to XPath because CSS (especially with `cssselect` parser) cannot cleanly express some required constraints, such as:

- exclude `li` inside table cells
- exclude "compound" `li` nodes that contain nested `li` / `p` / `pre` / `table`
- capture non-empty **leaf** text nodes under `pre > code` across different wrappers

Current `text.selector` is one XPath union (`|`), meaning “match any of these 5 selector groups”:

```xpath
//*[contains(concat(' ', normalize-space(@class), ' '), ' doc-content ')]//p
| //*[contains(concat(' ', normalize-space(@class), ' '), ' doc-content ')]//li[not(ancestor::table)][not(descendant::li)][not(descendant::p)][not(descendant::pre)][not(descendant::table)]
| //*[contains(concat(' ', normalize-space(@class), ' '), ' doc-content ')]//table//tr
| //*[contains(concat(' ', normalize-space(@class), ' '), ' doc-content ')]//pre//code[not(contains(concat(' ', normalize-space(@class), ' '), ' language-plaintext ') or contains(concat(' ', normalize-space(@class), ' '), ' language-text '))]//*[not(*)][normalize-space()]
| //*[contains(concat(' ', normalize-space(@class), ' '), ' doc-content ')]//pre//code[not(contains(concat(' ', normalize-space(@class), ' '), ' language-plaintext ') or contains(concat(' ', normalize-space(@class), ' '), ' language-text '))][not(*)][normalize-space()]
```

How to read each selector:

1. `...//p`
   - Approx. CSS: `.doc-content p`
   - Meaning: index paragraph text.
   - Example:

     ```html
     <p>TiDB supports ...</p>
     ```

2. `...//li[not(ancestor::table)][not(descendant::li)][not(descendant::p)][not(descendant::pre)][not(descendant::table)]`
   - Approx. CSS: `.doc-content li` + extra XPath-only guards
   - Meaning: index only “simple” list items; skip list items in tables and skip parent/compound list containers.
   - Example (parent `li` skipped, child `li` can be indexed):

     ```html
     <li>
       Parent item
       <ul><li>Child item</li></ul>
     </li>
     ```

   - Example (`li` in table skipped):

     ```html
     <table><tr><td><li>list in table</li></td></tr></table>
     ```

3. `...//table//tr`
   - Approx. CSS: `.doc-content table tr`
   - Meaning: index table rows as records.
   - Example:

     ```html
     <table><tr><td>Parameter</td><td>Value</td></tr></table>
     ```

4. `...//pre//code[not(contains(concat(' ', normalize-space(@class), ' '), ' language-plaintext ') or contains(concat(' ', normalize-space(@class), ' '), ' language-text '))]//*[not(*)][normalize-space()]`
   - Approx. CSS: no strict equivalent (requires “leaf node + non-empty text”)
   - Meaning: index non-empty leaf text nodes under code blocks (for example wrappers like `span` / `div`), while excluding `code.language-plaintext` and `code.language-text` blocks.
   - Examples:

     ```html
     <pre><code><span>SELECT 1;</span></code></pre>
     <pre><code><div>SELECT 1;</div></code></pre>
     ```

5. `...//pre//code[not(contains(concat(' ', normalize-space(@class), ' '), ' language-plaintext ') or contains(concat(' ', normalize-space(@class), ' '), ' language-text '))][not(*)][normalize-space()]`
   - Approx. CSS: no strict equivalent (requires `code` itself as leaf text node)
   - Meaning: cover code blocks where `code` has direct text and no element children.
   - Example:

     ```html
     <pre><code>SELECT 1;</code></pre>
     ```

Why this is safer for indexing:

- reduces oversized records from large parent list items
- avoids obvious overlap between `li` and table content
- keeps code-block coverage across different rendered DOM shapes while skipping large plain-text output blocks

### `docs_info` fields

Each config has a `docs_info` object with these runtime effects:

- `owner` + `docs_repo` + `ref`: tells incremental mode which GitHub repo/branch to diff.
- `lang`: used in URL generation (`en` has no `/zh/` prefix, `zh` has `/zh/`).
- `docs_prefix`: URL path prefix and part of `latest_commit` key.
- `version`: part of URL and part of `latest_commit` key.
- `isStable`: if `true`, URL version segment becomes `stable` during crawling.

### Production full mode (`crawl-full.sh`)

For each full config, scraper builds one root start URL from `docs_info` and then crawls via sitemap/link traversal.

For all-stable full configs, we also set:

- `sitemap_urls_regexs`
- `force_sitemap_urls_crawling: true`

This allows one production full run to include multiple URL prefixes into one language index.

### Preview full prewarm mode (`crawl-preview-full.sh`)

When preview site has no usable sitemap, prewarm runs each prefix config from `runlist-preview-full.json` in full mode (default):

- injects `crawl_local_url` (preview domain)
- clears `sitemap_urls` and `sitemap_urls_regexs`
- sets `force_sitemap_urls_crawling` to `false`

This removes sitemap dependency and crawls each prefix from its root start URL.

You can override the preview runlist by setting `PREVIEW_RUNLIST_FILE` (for example: `runlist-incremental.json`).

### Incremental mode (`crawl-incremental.sh`)

For each config in `runlist-incremental.json`, scraper:

1. reads base commit from `latest_commit.json`
2. fetches head commit from `owner/repo/ref`
3. calls GitHub compare API `base...head`
4. maps changed markdown files to URL candidates by `docs_prefix` + file basename
5. crawls those URLs and updates index

Multiple incremental configs can write into the same index name.

## `latest_commit.json` Key Rules

Key format follows scraper implementation:

- with version: `<lang>-<docs_prefix>-<version>`
- without version: `<lang>-<docs_prefix>`

Examples:

- `en-tidb-v8.5`
- `zh-api`
- `en-releases/tidb-cloud`

Key format is derived from `docs_info`, not from Algolia `index_name`.

## Production Full Crawl

Default production full crawl (both languages, sync latest commit):

```bash
cd docsearch
./all-stable/scripts/crawl-full.sh "$(pwd)/all-stable"
```

Optional runtime switches (manual/local):

- `CRAWL_LANG=both|en|zh`
- `UPDATE_LATEST_COMMIT=true|false` (debug only; CI production full always updates latest_commit)

Example (production full, English only):

```bash
cd docsearch
CRAWL_LANG=en \
./all-stable/scripts/crawl-full.sh "$(pwd)/all-stable"
```

## Preview Full Prewarm

Preview full prewarm runs per-prefix full crawl and does not depend on preview sitemap:

```bash
cd docsearch
CRAWL_LANG=en \
CRAWL_LOCAL_URL=https://docs.tidb.io/ \
PREVIEW_RUNLIST_FILE=runlist-preview-full.json \
./all-stable/scripts/crawl-preview-full.sh "$(pwd)/all-stable"
```

Notes:

- this flow does not sync or commit `latest_commit.json`
- this flow is for index prewarm; run one final production full crawl at/after release

## Incremental Crawl

Incremental crawl runs each config in `runlist-incremental.json` sequentially.

```bash
cd docsearch
./all-stable/scripts/crawl-incremental.sh "$(pwd)/all-stable"
```

## Preview Site (`docs.tidb.io`) Notes

Current scraper supports `crawl_local_url`. If set, crawler requests pages from that domain and writes production URLs into records.

In this codebase, records written to Algolia replace `crawl_local_url` with `https://docs.pingcap.com/` in record URLs.

Preview prewarm without sitemap is a practical fallback, but it can still miss isolated pages that are not reachable by link traversal from prefix root pages.

### Safety guidance

- Preview full workflow probes preview base URL and fails fast when unavailable or resolving to a 404 page.
- Full/incremental/preview-full workflows fail if spider reports crawl errors (including oversized Algolia record errors), preventing silent partial indexing.
- Best practice: use preview full prewarm, then run one final production full crawl before/at release.

## Add a New URL Prefix

1. Add language-specific incremental config JSON under `all-stable/configs/`.
2. Set `index_name` to `en-tidb-all-stable` or `zh-tidb-all-stable`.
3. Add config filename to `runlist-incremental.json`.
4. Add corresponding key in `latest_commit.json` using current repo/ref head SHA.
5. If production full crawl should include it, add regex in `en-all-stable-full.json` / `zh-all-stable-full.json`.

## CI Workflows

- Incremental: `.github/workflows/docsearch-all-stable-incremental.yml`
- Production full: `.github/workflows/docsearch-all-stable-full.yml`
- Preview full prewarm: `.github/workflows/docsearch-all-stable-full-preview.yml`

Production full workflow inputs:

- `language`: `both`, `en`, or `zh`

Preview full workflow inputs:

- `preview_base_url`: preview domain base URL
- `language`: `both`, `en`, or `zh`

### Runbook: Prewarm English on Preview Before Prod Go-live

Use this when:

- `en-tidb-all-stable` / `zh-tidb-all-stable` indexes exist but are empty
- preview English docs are ready on `docs.tidb.io`
- you want search to work immediately at prod go-live

Run `.github/workflows/docsearch-all-stable-full-preview.yml` with:

- `preview_base_url=https://docs.tidb.io/`
- `language=en`

Then run `.github/workflows/docsearch-all-stable-full.yml` with:

- `language=en` (or `both`)

Production full workflow always syncs/commits `latest_commit.json`.

## Reliability Notes

- workflows use `concurrency` to avoid same-workflow overlap
- push step in commit-sync workflows now follows `add -> commit -> pull --rebase -> push`
- full/incremental/preview-full workflows gate on spider/oversized-record errors
- `sync-latest-commit.sh` uses `curl --retry` and fails fast on API errors
- full sync respects selected language (`en`/`zh`/`both`)

## Algolia Prerequisites

Create these indexes before first run:

- `en-tidb-all-stable`
- `zh-tidb-all-stable`
