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
    // tidbcloud releases
    // /en/tidbcloud/master/tidb-cloud/releases/_index.md -> /en/releases/tidb-cloud
    {
      sourcePattern: "/{lang}/tidbcloud/master/tidb-cloud/releases/{filename}",
      targetPattern: "/{lang}/releases/tidb-cloud",
      conditions: { filename: ["_index"] },
    },
    // tidb releases
    // /en/tidb/release-8.5/releases/_index.md -> /en/releases/tidb-self-managed
    {
      sourcePattern: `/{lang}/tidb/${CONFIG.docs.tidb.stable}/releases/{filename}`,
      targetPattern: "/{lang}/releases/tidb-self-managed",
      conditions: { filename: ["_index"] },
    },
    {
      sourcePattern: `/{lang}/tidb-in-kubernetes/main/releases/{filename}`,
      targetPattern: "/{lang}/releases/tidb-operator",
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
    // develop namespace in tidb folder
    // When filename = "_index": /en/tidb/master/develop/{folders}/_index.md -> /en/developer/{folders}/
    // When filename != "_index": /en/tidb/master/develop/{folders}/{filename}.md -> /en/developer/{filename}/
    {
      sourcePattern: `/{lang}/tidb/${CONFIG.docs.tidb.stable}/{folder}/{...folders}/{filename}`,
      targetPattern: "/{lang}/developer/{filename}",
      conditions: {
        folder: ["develop"],
      },
      filenameTransform: {
        ignoreIf: ["_index"],
        conditionalTarget: {
          keepIf: ["_index"],
          keepTargetPattern: "/{lang}/developer/{folders}",
        },
      },
    },
    // best-practices, api, ai namespace in tidb folder
    // When filename = "_index": /en/tidb/master/best-practices/{folders}/_index.md -> /en/best-practices/{folders}/
    // When filename != "_index": /en/tidb/master/api/{folders}/{filename}.md -> /en/api/{filename}/
    {
      sourcePattern: `/{lang}/tidb/${CONFIG.docs.tidb.stable}/{folder}/{...folders}/{filename}`,
      targetPattern: "/{lang}/{folder}/{filename}",
      conditions: {
        folder: ["best-practices", "api", "ai"],
      },
      filenameTransform: {
        ignoreIf: ["_index"],
        conditionalTarget: {
          keepIf: ["_index"],
          keepTargetPattern: "/{lang}/{folder}/{folders}",
        },
      },
    },
    // tidb index pages with folders (avoid URL collision)
    // /en/tidb/master/develop/_index.md -> /en/tidb/dev/develop
    // /en/tidb/master/releases/_index.md -> /en/tidb/dev/releases
    // (stable releases index is handled by the stable releases rule above)
    {
      sourcePattern: "/{lang}/tidb/{branch}/{...folders}/{filename}",
      targetPattern: "/{lang}/tidb/{branch:branch-alias-tidb}/{folders}",
      conditions: { filename: ["_index"] },
      filenameTransform: {
        ignoreIf: ["_index"],
      },
    },
    // tidb with branch and optional folders
    // /en/tidb/master/{...folders}/{filename} -> /en/tidb/stable/{filename}
    // /en/tidb/release-8.5/{...folders}/{filename} -> /en/tidb/v8.5/{filename}
    {
      sourcePattern: "/{lang}/tidb/{branch}/{...folders}/{filename}",
      targetPattern: "/{lang}/tidb/{branch:branch-alias-tidb}/{filename}",
      filenameTransform: {
        ignoreIf: ["_index", "_docHome"],
      },
    },
    // tidb-in-kubernetes with branch and optional folders
    // /en/tidb-in-kubernetes/main/{...folders}/{filename} -> /en/tidb-in-kubernetes/stable/{filename}
    // /en/tidb-in-kubernetes/release-1.6/{...folders}/{filename} -> /en/tidb-in-kubernetes/v1.6/{filename}
    {
      sourcePattern:
        "/{lang}/tidb-in-kubernetes/{branch}/{...folders}/{filename}",
      targetPattern:
        "/{lang}/tidb-in-kubernetes/{branch:branch-alias-tidb-in-kubernetes}/{filename}",
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
    // Branch alias for tidb: used in {branch:branch-alias-tidb}
    "branch-alias-tidb": {
      mappings: {
        master: "dev",
        // Exact match for tidb stable branch
        [CONFIG.docs.tidb.stable]: "stable",
        // Wildcard pattern: release-* -> v*
        // Matches any branch starting with "release-" and replaces with "v" prefix
        // Examples:
        //   release-8.5 -> v8.5
        //   release-8.1 -> v8.1
        //   release-7.5 -> v7.5
        "release-*": "v*",
      },
    },
    // Branch alias for tidb-in-kubernetes: used in {branch:branch-alias-tidb-in-kubernetes}
    "branch-alias-tidb-in-kubernetes": {
      mappings: {
        main: "dev",
        // Exact match for tidb-in-kubernetes stable branch
        [CONFIG.docs["tidb-in-kubernetes"].stable]: "stable",
        // Wildcard pattern: release-* -> v*
        // Matches any branch starting with "release-" and replaces with "v" prefix
        // Examples:
        //   release-1.6 -> v1.6
        //   release-1.5 -> v1.5
        //   release-2.0 -> v2.0
        "release-*": "v*",
      },
    },
  },
};
