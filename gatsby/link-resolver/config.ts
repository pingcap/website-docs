/**
 * Default link resolver configuration
 */

import type { LinkResolverConfig } from "./types";

export const defaultLinkResolverConfig: LinkResolverConfig = {
  // Default language to omit from resolved URLs
  defaultLanguage: "en",
  // Supported languages for parsing currentPageUrl
  languages: ["en", "zh", "ja"],

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
    // Releases pages (path-based mapping)
    // Current page: /{lang}/releases/tidb-self-managed
    // Link: /releases/{docname} -> /{lang}/tidb/stable/{docname}
    {
      pathPattern: "/{lang}/releases/tidb-self-managed",
      linkPattern: "/{...any}/{docname}",
      targetPattern: "/{lang}/tidb/stable/{docname}",
    },
    // Current page: /{lang}/releases/tidb-operator
    // Link: /releases/{docname} -> /{lang}/tidb-in-kubernetes/dev/{docname}
    {
      pathPattern: "/{lang}/releases/tidb-operator",
      linkPattern: "/{...any}/{docname}",
      targetPattern: "/{lang}/tidb-in-kubernetes/dev/{docname}",
    },
    // Rule 1: Links starting with specific namespaces (direct link mapping)
    // Special handling for namespace index links:
    // /develop/_index -> /developer
    // /best-practices/_index -> /best-practices
    // /api/_index -> /api
    // /ai/_index -> /ai
    {
      linkPattern: "/{namespace}/{...folders}/_index",
      targetPattern: "/{curLang}/{namespace}/{folders}",
      conditions: {
        namespace: ["tidb-cloud", "develop", "best-practices", "api", "ai"],
      },
      namespaceTransform: {
        "tidb-cloud": "tidbcloud",
        develop: "developer",
      },
    },
    // /{namespace}/{...any}/{docname} -> /{curLang}/{namespace}/{docname}
    // Special: tidb-cloud -> tidbcloud, develop -> developer
    {
      linkPattern: "/{namespace}/{...any}/{docname}",
      targetPattern: "/{curLang}/{namespace}/{docname}",
      conditions: {
        namespace: ["tidb-cloud", "develop", "best-practices", "api", "ai"],
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
    // Rule 3: developer, best-practices, api, ai namespace in tidb folder
    // Current page: /{lang}/{namespace}/{...any}
    // Link: /{...any}/{docname} -> /{lang}/{namespace}/{docname}
    {
      pathPattern: `/{lang}/{namespace}/{...any}`,
      pathConditions: {
        namespace: ["developer", "best-practices", "api", "ai"],
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
      linkPattern: "/{...folders}/_index",
      targetPattern: "/{lang}/{repo}/{branch}/{folders}",
    },
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
