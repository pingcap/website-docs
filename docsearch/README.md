# DocSearch configurations

## docs(zh)

Files with prefix `zh-` are config files for Chinese docs. The formate of index is `zh-<DOCS_TYPE>-<DOCS_VERSION>`, each index will store the specific version of the corresponding docs_type.

## docs(en)

Files with prefix `en-` are config files for English docs. The formate of index is `en-<DOCS_TYPE>-<DOCS_VERSION>`, each index will store the specific version of the corresponding docs_type. `<DOCS_VERSION>` is empty on tidbcloud docs.

```json
{
  "index_name": "en-tidb-data-migration-v1.0", // format: LANG-DOCS_TYPE-VERSION
  "docs_info": {
    "owner": "pingcap", // repo's owner
    "docs_repo": "docs-dm", // repo name
    "ref": "release-1.0", // branch name
    "docs_prefix": "tidb-data-migration", // url prefix of docs_type shows on website-docs
    "lang": "en", // docs language
    "version": "v1.0" // docs version shows on website-docs, may be empty
  },
  "start_urls": [], // default empty, scraper will fill this by commits
  "crawl_local_url": "", // default empty, set baseURL of preview-docs-website here when need to crawl before going to production
  "delete_urls": [], // default empty, scraper will fill this by commits
  "sitemap_urls": [
    "https://docs.pingcap.com/sitemap/sitemap-index.xml" // default value is sitemap url of offical pingcap website-docs, change it when need to crawl pages before going to production.
  ],
  "selectors": {
    "default": {
      "lvl0": ".doc-content h1",
      "lvl1": ".doc-content h2",
      "lvl2": ".doc-content h3",
      "lvl3": ".doc-content h4",
      "lvl4": ".doc-content h5",
      "text": ".doc-content p, .doc-content li, .doc-content table tr, .doc-content code span"
    }
  },
  "selectors_exclude": [
    ".error"
  ],
  "custom_settings": {
    // used to filter urls to delete.
    "attributesForFaceting": [
      "url_without_anchor"
    ],
    "attributesToHighlight": [
      "content",
      "url",
      "hierarchy"
    ],
    "attributeForDistinct": "url_without_anchor",
    "distinct": true,
    "disableTypoToleranceOnWords": [
      "mva",
      "tiup",
      "tiops",
      "tidb4.0",
      "tidb 4.0"
    ]
  },
  "conversation_id": [
    "428916846"
  ],
  "only_content_level": true,
  "nb_hits": 7609
}
```

## Timed Task

```
bash run-algolia-crawler-incrementally.sh /PATH/TO/CONFIGS
```

Set crontab to crawl everyday at 11:00PM.

## Fully update

```
bash run-algolia-crawler-fully.sh /PATH/TO/CONFIGS
```

Run at first time.
