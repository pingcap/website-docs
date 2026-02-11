# All-stable Migration Notes

This note explains how to migrate from the initial all-stable layout to the consolidated `docsearch/all-stable` layout.

## Why this migration

The first all-stable delivery worked, but files were spread across:

- `docsearch/algolia-configs-all-stable/`
- `docsearch/run-algolia-crawler-fully-all-stable.sh`
- `docsearch/run-algolia-crawler-incrementally-all-stable.sh`
- `docsearch/sync-latest-commit-all-stable.sh`

The new layout keeps all all-stable assets in one place.

## New layout

- `docsearch/all-stable/configs/`
- `docsearch/all-stable/scripts/`
- `docsearch/all-stable/README.md`
- `docsearch/all-stable/MIGRATION.md`

## Path mapping

Directory/script moves:

- `docsearch/algolia-configs-all-stable/*` -> `docsearch/all-stable/configs/*`
- `docsearch/run-algolia-crawler-fully-all-stable.sh` -> `docsearch/all-stable/scripts/crawl-full.sh`
- `docsearch/run-algolia-crawler-incrementally-all-stable.sh` -> `docsearch/all-stable/scripts/crawl-incremental.sh`
- `docsearch/sync-latest-commit-all-stable.sh` -> `docsearch/all-stable/scripts/sync-latest-commit.sh`
- `docsearch/all-stable-workflow.md` -> `docsearch/all-stable/README.md`

Config filename normalization:

- `en-full.json` -> `en-all-stable-full.json`
- `zh-full.json` -> `zh-all-stable-full.json`
- `en-tidbcloud.json` -> `en-tidb-cloud.json`

## Command mapping

Old:

```bash
cd docsearch
./run-algolia-crawler-fully-all-stable.sh "$(pwd)"
./run-algolia-crawler-incrementally-all-stable.sh "$(pwd)"
```

New:

```bash
cd docsearch
./all-stable/scripts/crawl-full.sh "$(pwd)/all-stable"
./all-stable/scripts/crawl-incremental.sh "$(pwd)/all-stable"
```

## Workflow impact

Workflows keep the same names, but now call scripts under `all-stable/scripts/` and commit state from `all-stable/configs/latest_commit.json`.

- `.github/workflows/docsearch-all-stable-full.yml`
- `.github/workflows/docsearch-all-stable-incremental.yml`

`docsearch-all-stable-full.yml` now also supports dispatch-time target/language/update toggles.

## Notes for maintainers

- Legacy `docsearch/algolia_configs` and legacy scripts are unchanged.
- All new all-stable changes should stay under `docsearch/all-stable/`.
