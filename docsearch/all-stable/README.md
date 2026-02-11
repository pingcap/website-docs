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
- `all-stable/configs/en-all-stable-full.json`: English full crawl config
- `all-stable/configs/zh-all-stable-full.json`: Chinese full crawl config
- `all-stable/configs/runlist-incremental.json`: incremental config run order
- `all-stable/configs/latest_commit.json`: incremental base commit state
- `all-stable/scripts/crawl-full.sh`: full crawl entry
- `all-stable/scripts/crawl-incremental.sh`: incremental crawl entry
- `all-stable/scripts/sync-latest-commit.sh`: commit-state sync helper
- `all-stable/MIGRATION.md`: old-path to new-path mapping

## How Configs Drive Crawler Behavior

### `docs_info` fields

Each config has a `docs_info` object with these runtime effects:

- `owner` + `docs_repo` + `ref`: tells incremental mode which GitHub repo/branch to diff.
- `lang`: used in URL generation (`en` has no `/zh/` prefix, `zh` has `/zh/`).
- `docs_prefix`: URL path prefix and part of `latest_commit` key.
- `version`: part of URL and part of `latest_commit` key.
- `isStable`: if `true`, URL version segment becomes `stable` during crawling.

### Full mode (`crawl-full.sh`)

For each full config, scraper builds one root start URL from `docs_info` and then crawls via sitemap/link traversal.

For all-stable full configs, we also set:

- `sitemap_urls_regexs`
- `force_sitemap_urls_crawling: true`

This allows one full run to include multiple URL prefixes into one language index.

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

## Full Crawl

Default full crawl (both languages, production domain, sync latest commit):

```bash
cd docsearch
./all-stable/scripts/crawl-full.sh "$(pwd)/all-stable"
```

Optional runtime switches for manual runs:

- `CRAWL_LANG=both|en|zh`
- `CRAWL_LOCAL_URL=https://docs.tidb.io/` (preview domain)
- `UPDATE_LATEST_COMMIT=true|false`

Example (preview + English only + no latest-commit update):

```bash
cd docsearch
CRAWL_LANG=en \
CRAWL_LOCAL_URL=https://docs.tidb.io/ \
UPDATE_LATEST_COMMIT=false \
./all-stable/scripts/crawl-full.sh "$(pwd)/all-stable"
```

## Incremental Crawl

Incremental crawl runs each config in `runlist-incremental.json` sequentially.

```bash
cd docsearch
./all-stable/scripts/crawl-incremental.sh "$(pwd)/all-stable"
```

## Preview Site (`docs.tidb.io`) Notes

Current scraper supports `crawl_local_url`. If set, crawler requests pages from that domain.

In this codebase, records written to Algolia replace `crawl_local_url` with `https://docs.pingcap.com/` in record URLs. This is useful for preview pre-crawl.

### Safety guidance

- Full preview crawl is the safest prewarm method.
- Incremental preview crawl is usable but delete precision is weaker because URL mapping/deletion logic is path-derived and environment-dependent.
- Best practice: use full preview crawl for prewarm, and run one final full crawl on production domain before/at release.

## Add a New URL Prefix

1. Add language-specific incremental config JSON under `all-stable/configs/`.
2. Set `index_name` to `en-tidb-all-stable` or `zh-tidb-all-stable`.
3. Add config filename to `runlist-incremental.json`.
4. Add corresponding key in `latest_commit.json` using current repo/ref head SHA.
5. If full crawl should include it, add regex in `en-all-stable-full.json` / `zh-all-stable-full.json`.

## CI Workflows

- Incremental: `.github/workflows/docsearch-all-stable-incremental.yml`
- Full: `.github/workflows/docsearch-all-stable-full.yml`

Full workflow supports runtime inputs:

- `target`: `prod` or `preview`
- `preview_base_url`: preview domain base URL
- `language`: `both`, `en`, or `zh`
- `update_latest_commit`: whether to sync/commit latest commit state

Guardrail:

- when `target=prod`, workflow requires `update_latest_commit=true` and fails fast otherwise

### Runbook: Prewarm English on Preview Before Prod Go-live

Use this when:

- `en-tidb-all-stable` / `zh-tidb-all-stable` indexes exist but are empty
- preview English docs are ready on `docs.tidb.io`
- you want search to work immediately at prod go-live

Run `.github/workflows/docsearch-all-stable-full.yml` with:

- `target=preview`
- `preview_base_url=https://docs.tidb.io/`
- `language=en`
- `update_latest_commit=true` (recommended)

Why `update_latest_commit=true` is safe here:

- full crawl already indexed the English content
- sync now updates only English keys when `language=en`
- this avoids replaying large English diffs in the next incremental run

Conservative option:

- set `update_latest_commit=false` for preview prewarm
- after prod release, run one prod full crawl with `language=en` and `update_latest_commit=true`

## Reliability Notes

- workflows use `concurrency` to avoid same-workflow overlap
- push step rebases before commit/push to reduce branch race failures
- `sync-latest-commit.sh` uses `curl --retry` and fails fast on API errors
- full sync now respects selected language (`en`/`zh`/`both`)

## Algolia Prerequisites

Create these indexes before first run:

- `en-tidb-all-stable`
- `zh-tidb-all-stable`
