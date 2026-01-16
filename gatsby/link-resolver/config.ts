/**
 * Default link resolver configuration
 */

import type { LinkResolverConfig } from "./types";

export const defaultLinkResolverConfig: LinkResolverConfig = {
  // Default language to omit from resolved URLs
  defaultLanguage: "en",

  linkMappings: [
    {
      linkPattern: "/releases/_index",
      targetPattern: "/{curLang}/releases/tidb-self-managed",
    },
    {
      linkPattern: "/tidb-cloud/releases/_index",
      targetPattern: "/{curLang}/releases/tidb-cloud",
    },
    {
      pathPattern: "/{lang}/tidb-in-kubernetes/{branch}/{...any}",
      linkPattern: "/tidb-in-kubernetes/releases/_index",
      targetPattern: "/{curLang}/releases/tidb-operator",
    },
    // Rule 1: Links starting with specific namespaces (direct link mapping)
    // /{namespace}/{...any}/{docname} -> /{curLang}/{namespace}/{docname}
    // Special: tidb-cloud -> tidbcloud, develop -> developer
    {
      linkPattern: "/{namespace}/{...any}/{docname}",
      targetPattern: "/{curLang}/{namespace}/{docname}",
      conditions: {
        namespace: ["tidb-cloud", "develop", "best-practices", "api"],
      },
      namespaceTransform: {
        "tidb-cloud": "tidbcloud",
        develop: "developer",
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
    // Rule 3: developer, best-practices, api, releases namespace in tidb folder
    // Current page: /{lang}/{namespace}/{...any}
    // Link: /{...any}/{docname} -> /{lang}/{namespace}/{docname}
    {
      pathPattern: `/{lang}/{namespace}/{...any}`,
      pathConditions: {
        namespace: ["developer", "best-practices", "api"],
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
