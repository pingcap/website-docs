/**
 * Default link resolver configuration
 */

import type { LinkResolverConfig } from "./types";

export const defaultLinkResolverConfig: LinkResolverConfig = {
  // Default language to omit from resolved URLs
  defaultLanguage: "en",

  linkMappings: [
    {
      linkPattern: "/releases",
      targetPattern: "/releases",
    },
    {
      linkPattern: "/releases/tidb-cloud",
      targetPattern: "/releases/tidb-cloud",
    },
    // Rule 1: Links starting with specific namespaces (direct link mapping)
    // /{namespace}/{...any}/{docname} -> /{namespace}/{docname}
    // Special: tidb-cloud -> tidbcloud
    {
      linkPattern: "/{namespace}/{...any}/{docname}",
      targetPattern: "/{namespace}/{docname}",
      conditions: {
        namespace: ["tidb-cloud", "develop", "best-practice", "api"],
      },
      namespaceTransform: {
        "tidb-cloud": "tidbcloud",
      },
    },
    // Rule 2: tidbcloud with prefix pages (path-based mapping)
    // Current page: /{lang}/tidbcloud/{...any}
    // Link: /{...any}/{docname} -> /{lang}/tidbcloud/{docname}
    {
      pathPattern: "/{lang}/tidbcloud/{...any}",
      linkPattern: "/{...any}/{docname}",
      targetPattern: "/{lang}/tidbcloud/{docname}",
    },
    // Rule 3: develop, best-practice, api, releases namespace in tidb folder
    // Current page: /{lang}/{namespace}/{...any}
    // Link: /{...any}/{docname} -> /{lang}/{namespace}/{docname}
    {
      pathPattern: `/{lang}/{namespace}/{...any}`,
      pathConditions: {
        namespace: ["develop", "best-practice", "api"],
      },
      linkPattern: "/{...any}/{docname}",
      targetPattern: "/{lang}/tidb/stable/{docname}",
    },
    // Rule 4: tidb with branch pages (path-based mapping)
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
  ],
};
