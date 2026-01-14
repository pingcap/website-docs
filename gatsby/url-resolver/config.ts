/**
 * Default URL resolver configuration
 */

import path from "path";
import type { UrlResolverConfig } from "./types";
import CONFIG from "../../docs/docs.json";

export const defaultUrlResolverConfig: UrlResolverConfig = {
  sourceBasePath: path.resolve(__dirname, "../../docs/markdown-pages"),
  // Default language (used when omitDefaultLanguage is true)
  defaultLanguage: "en",
  // Trailing slash behavior: "never" to match generateUrl behavior
  trailingSlash: "never",

  pathMappings: [
    // tidbcloud dedicated _index
    // /en/tidbcloud/master/tidb-cloud/dedicated/_index.md -> /en/tidbcloud/dedicated/
    {
      sourcePattern: "/{lang}/tidbcloud/master/tidb-cloud/dedicated/{filename}",
      targetPattern: "/{lang}/tidbcloud",
      conditions: { filename: ["_index"] },
    },
    // tidbcloud with prefix (dedicated, starter, etc.)
    // When filename = "_index": /en/tidbcloud/tidb-cloud/{prefix}/_index.md -> /en/tidbcloud/{prefix}/
    // When filename != "_index": /en/tidbcloud/tidb-cloud/{prefix}/{filename}.md -> /en/tidbcloud/{filename}/
    {
      sourcePattern:
        "/{lang}/tidbcloud/{branch}/tidb-cloud/{...prefixes}/{filename}",
      targetPattern: "/{lang}/tidbcloud/{filename}",
      filenameTransform: {
        ignoreIf: ["_index"],
        conditionalTarget: {
          keepIf: ["_index"],
          keepTargetPattern: "/{lang}/tidbcloud/{prefixes}",
        },
      },
    },
    // develop, best-practice, api, releases namespace in tidb folder
    // When filename = "_index": /en/tidb/master/develop/{folders}/_index.md -> /en/develop/{folders}/
    // When filename != "_index": /en/tidb/master/develop/{folders}/{filename}.md -> /en/develop/{filename}/
    {
      sourcePattern: `/{lang}/{repo}/${CONFIG.docs.tidb.stable}/{folder}/{...folders}/{filename}`,
      targetPattern: "/{lang}/{folder}/{filename}",
      conditions: {
        repo: ["tidb"],
        folder: ["develop", "best-practice", "api", "releases"],
      },
      filenameTransform: {
        ignoreIf: ["_index"],
        conditionalTarget: {
          keepIf: ["_index"],
          keepTargetPattern: "/{lang}/{folder}/{folders}",
        },
      },
    },
    // tidb with branch and optional folders
    // /en/tidb/master/{...folders}/{filename} -> /en/tidb/stable/{filename}
    // /en/tidb/release-8.5/{...folders}/{filename} -> /en/tidb/v8.5/{filename}
    {
      sourcePattern: "/{lang}/{repo}/{branch}/{...folders}/{filename}",
      targetPattern: "/{lang}/{repo}/{branch:branch-alias}/{filename}",
      conditions: {
        repo: ["tidb", "tidb-in-kubernetes"],
      },
      filenameTransform: {
        ignoreIf: ["_index", "_docHome"],
      },
    },
    // Fallback: /{lang}/{repo}/{...any}/{filename} -> /{lang}/{repo}/{filename}
    {
      sourcePattern: "/{lang}/{repo}/{...any}/{filename}",
      targetPattern: "/{lang}/{repo}/{filename}",
      filenameTransform: {
        ignoreIf: ["_index", "_docHome"],
      },
    },
  ],

  aliases: {
    // Branch alias: used in {branch:branch-alias}
    // Supports context-based alias selection
    "branch-alias": {
      // Context: only apply this alias when repo is tidb or tidb-in-kubernetes
      context: {
        repo: ["tidb", "tidb-in-kubernetes"],
      },
      mappings: {
        // Exact matches (repo-specific)
        master: "stable", // for tidb
        main: "stable", // for tidb-in-kubernetes
        // Wildcard pattern: release-* -> v*
        // Matches any branch starting with "release-" and replaces with "v" prefix
        // Examples:
        //   release-8.5 -> v8.5
        //   release-8.1 -> v8.1
        //   release-7.5 -> v7.5
        "release-*": "v*",
        // You can also use regex pattern with object syntax:
        // {
        //   pattern: "release-(.*)",
        //   replacement: "v$1",
        //   useRegex: true
        // }
      },
    },
    // Example: repo alias (if needed in the future)
    // "repo-alias": {
    //   mappings: {
    //     "tidbcloud": "tidb-cloud",
    //   },
    // },
  },
};
