/**
 * Default URL resolver configuration
 */

import path from "path";
import type { UrlResolverConfig } from "./types";

export const defaultUrlResolverConfig: UrlResolverConfig = {
  sourceBasePath: path.resolve(__dirname, "../../docs/markdown-pages"),

  pathMappings: [
    // tidbcloud with prefix (dedicated, starter, etc.)
    // /en/tidbcloud/tidb-cloud/{prefix}/{filename} -> /en/tidbcloud/{prefix}/{filename}
    {
      sourcePattern: "/{lang}/{repo}/{namespace}/{prefix}/{filename}",
      targetPattern: "/{lang}/{repo}/{prefix}/{filename}",
      conditions: {
        repo: ["tidbcloud"],
        namespace: ["tidb-cloud"],
        prefix: ["dedicated", "starter", "essential", "premium"],
      },
      filenameTransform: {
        ignoreIf: ["_index"],
      },
    },
    // develop, best-practice, api, releases namespace in tidb folder
    // /en/tidb/master/develop/{filename} -> /en/develop/{filename}
    {
      sourcePattern: "/{lang}/{repo}/{branch}/{folder}/{...folders}/{filename}",
      targetPattern: "/{lang}/{folder}/{filename}",
      conditions: {
        repo: ["tidb"],
        folder: ["develop", "best-practice", "api", "releases"],
      },
      filenameTransform: {
        ignoreIf: ["_index"],
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
    },
    // Fallback: /{lang}/{repo}/{namespace}/{folder or not}/{filename} -> /{lang}/{repo}/{filename}
    {
      sourcePattern: "/{lang}/{repo}/{namespace}/{filename}",
      targetPattern: "/{lang}/{repo}/{filename}",
    },
  ],

  branchAliases: {
    tidb: {
      // Exact match
      master: "stable",
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
    "tidb-in-kubernetes": {
      // Exact match
      main: "stable",
      // Wildcard pattern: release-* -> v*
      "release-*": "v*",
    },
  },

  linkMappings: [
    // /releases/{filename} -> /{lang}/releases/{filename}
    {
      linkPattern: "/releases/{filename}",
      targetPattern: "/{lang}/releases/{filename}",
      conditions: {
        startsWith: ["/releases"],
      },
    },
    // /tidb-cloud/{filename} -> /{lang}/tidbcloud/{filename}
    {
      linkPattern: "/tidb-cloud/{filename}",
      targetPattern: "/{lang}/tidbcloud/{filename}",
      conditions: {
        startsWith: ["/tidb-cloud"],
      },
    },
    // /develop/{filename} -> /{lang}/develop/{filename}
    {
      linkPattern: "/develop/{filename}",
      targetPattern: "/{lang}/develop/{filename}",
      conditions: {
        startsWith: ["/develop"],
      },
    },
    // /best-practice/{filename} -> /{lang}/best-practice/{filename}
    {
      linkPattern: "/best-practice/{filename}",
      targetPattern: "/{lang}/best-practice/{filename}",
      conditions: {
        startsWith: ["/best-practice"],
      },
    },
    // /api/{filename} -> /{lang}/api/{filename}
    {
      linkPattern: "/api/{filename}",
      targetPattern: "/{lang}/api/{filename}",
      conditions: {
        startsWith: ["/api"],
      },
    },
  ],

  defaultLinkResolution: {
    useCurrentContext: true,
  },
  // Default language - if lang is "en", skip the language segment in URLs
  // e.g., /en/tidbcloud/api-overview/ becomes /tidbcloud/api-overview/
  defaultLanguage: "en",
};
