---
name: website-docs-url-mapping
description: Modify URL mapping rules in the website-docs Gatsby site by editing gatsby/url-resolver/config.ts and gatsby/link-resolver/config.ts, updating Jest tests, updating gatsby/URL_MAPPING_ARCHITECTURE.md, and reviewing gatsby-plugin-react-i18next matchPath when URL prefixes or languages change.
---

# Website-docs URL Mapping

## Overview

Modify the mapping rules between docs source paths and site URLs, and resolve internal Markdown links, while keeping tests and docs in sync.

## Workflow

### 1) Gather Requirements (Clarify First)

Ask the user for “input → expected output” examples (at least 3 of each; more is better):
- Page URLs: `sourcePath/slug -> pageUrl` (whether to omit default language `/en/`, and trailing slash expectations)
- Link resolution: `(linkPath, currentPageUrl) -> resolvedUrl` (include edge cases: hash, no leading slash, relative paths, etc.)

### 2) Review Existing Design (Align Terms and Current Behavior)

Open and quickly locate the rules sections:
- `gatsby/URL_MAPPING_ARCHITECTURE.md` (Configuration Rules)
- `gatsby/url-resolver/README.md` (pattern/alias/filenameTransform)
- `gatsby/link-resolver/README.md` (direct vs path-based, conditions/pathConditions)

### 3) Edit URL Resolver (Page URLs)

Edit: `gatsby/url-resolver/config.ts`
- `pathMappings` are matched in order (first match wins); new rules usually go before more general ones.
- `sourcePattern` supports `{var}` and `{...var}`; `conditions` use extracted variables to decide applicability.
- Use `filenameTransform` to handle `_index` / `_docHome` (ignore filename or switch `targetPattern`).
- If branch display logic changes, update `aliases` as well (e.g. `{branch:branch-alias-tidb}`).

### 4) Edit Link Resolver (Markdown Links)

Edit: `gatsby/link-resolver/config.ts`
- Direct mapping: only `linkPattern` (does not depend on the current page)
- Path-based mapping: `pathPattern + linkPattern`, constrained by `pathConditions`
- Use `namespaceTransform` for namespace migrations (e.g. `develop -> developer`)
- Watch `defaultLanguage` omission logic and `url-resolver.trailingSlash` (tests should cover both)

### 5) Update/Add Tests (Prevent Regressions)

- `gatsby/url-resolver/__tests__/url-resolver.test.ts`
- `gatsby/link-resolver/__tests__/link-resolver.test.ts`

Coverage (at minimum, every new/changed rule has assertions):
- New rule match vs fallback (ordering)
- `en/zh/ja` + whether `/en/` is omitted
- `_index` vs non-`_index`
- Links: preserve hash, no leading slash, path depth, multi-segment prefixes, etc.

### 6) Run Tests

- Full suite: `yarn test`
- Or run a single test file first: `yarn test gatsby/url-resolver/__tests__/url-resolver.test.ts`, `yarn test gatsby/link-resolver/__tests__/link-resolver.test.ts`

### 7) Update Architecture Doc (Keep It In Sync)

Edit: `gatsby/URL_MAPPING_ARCHITECTURE.md`
- Update interpretations under “URL Resolver Configuration Rules” and “Link Resolver Configuration Rules”
- Keep rule numbering/order consistent with `config.ts`, and update input/output examples

### 8) Check i18n Routing (Often Required When URL Prefixes Change)

Review: `gatsby-config.js` → `gatsby-plugin-react-i18next`:
- Ensure `languages` matches supported site languages (currently `en/zh/ja`)
- Ensure `pages[].matchPath` includes any new/renamed top-level path prefixes (e.g. `developer`, `best-practices`, `api`, `releases`, and repo keys in `docs/docs.json`)
