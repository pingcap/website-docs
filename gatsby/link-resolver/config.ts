/**
 * Default link resolver configuration
 */

import type { LinkResolverConfig } from "./types";

export const defaultLinkResolverConfig: LinkResolverConfig = {
  // Default language to omit from resolved URLs
  defaultLanguage: "en",

  linkMappings: [
    // Rule 1: Links starting with specific namespaces
    // /{namespace}/{...any}/{docname} -> /{namespace}/{docname}
    // Special: tidb-cloud -> tidbcloud
    {
      sourcePattern: "/{namespace}/{...any}/{docname}",
      targetPattern: "/{namespace}/{docname}",
      conditions: {
        namespace: [
          "tidb-cloud",
          "develop",
          "best-practice",
          "api",
          "releases",
        ],
      },
      namespaceTransform: {
        "tidb-cloud": "tidbcloud",
      },
    },
  ],
  linkMappingsByPath: [
    // tidbcloud with prefix pages
    // Current page: /{lang}/tidbcloud/{...any}
    // Link: /{...any}/{docname} -> /{lang}/tidbcloud/{docname}
    {
      pathPattern: "/{lang}/tidbcloud/{...any}",
      linkPattern: "/{...any}/{docname}",
      targetPattern: "/{lang}/tidbcloud/{docname}",
    },
    // tidb with branch pages (with lang prefix)
    // Current page: /{lang}/tidb/{branch}/{...any} (branch is already aliased, e.g., "stable", "v8.5")
    // Link: /{...any}/{docname} -> /{lang}/tidb/{branch}/{docname}
    {
      pathPattern: "/{lang}/{repo}/{branch}/{...any}",
      pathConditions: {
        repo: ["tidb", "tidb-in-kubernetes"],
      },
      linkPattern: "/{...any}/{docname}",
      targetPattern: "/{lang}/{repo}/{branch}/{docname}",
    },
    // Fallback
    // develop, best-practice, api, releases pages
    // Current page: /{namespace}/{...any} where namespace is one of these
    // Link: /{...any}/{docname} -> /{lang}/tidb/stable/{docname}
    {
      pathPattern: "/{lang}/{repo}/{...any}",
      linkPattern: "/{...any}/{docname}",
      targetPattern: "/{lang}/{repo}/stable/{docname}",
    },
  ],
};
