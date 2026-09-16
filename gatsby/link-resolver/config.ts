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
    // Filesystem documentation is currently published in English only, so
    // direct links intentionally omit the current page language.
    {
      linkPattern: "/tidb-cloud-filesystem/{...folders}/_index",
      targetPattern: "/tidbcloud-filesystem/{folders}",
    },
    {
      linkPattern: "/tidb-cloud-filesystem/{...folders}/{docname}",
      targetPattern: "/tidbcloud-filesystem/{docname}",
    },
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
    // Link: /releases/{docname} -> /{lang}/tidb-in-kubernetes/stable/{docname}
    {
      pathPattern: "/{lang}/releases/tidb-operator",
      linkPattern: "/{...any}/{docname}",
      targetPattern: "/{lang}/tidb-in-kubernetes/stable/{docname}",
    },
    // Current TOC: /{lang}/tidb-in-kubernetes/dev/TOC-tidb-operator-releases
    // Link: /releases/{docname} -> /{lang}/tidb-in-kubernetes/stable/{docname}
    {
      pathPattern: "/{lang}/tidb-in-kubernetes/dev/TOC-tidb-operator-releases",
      linkPattern: "/releases/{docname}",
      targetPattern: "/{lang}/tidb-in-kubernetes/stable/{docname}",
    },
    // Links starting with specific namespaces (direct link mapping)
    // Special handling for namespace index links:
    // /develop/_index -> /developer
    // /best-practices/_index -> /best-practices
    // /api/_index -> /api
    // /ai/_index -> /ai
    // /tidb-cloud-lake/_index -> /tidbcloudlake
    {
      linkPattern: "/{namespace}/{...folders}/_index",
      targetPattern: "/{curLang}/{namespace}/{folders}",
      conditions: {
        namespace: [
          "tidb-cloud",
          "tidb-cloud-lake",
          "develop",
          "best-practices",
          "api",
          "ai",
        ],
      },
      namespaceTransform: {
        "tidb-cloud": "tidbcloud",
        "tidb-cloud-lake": "tidbcloudlake",
        develop: "developer",
      },
    },
    // /{namespace}/{...any}/{docname} -> /{curLang}/{namespace}/{docname}
    // Special: tidb-cloud -> tidbcloud, tidb-cloud-lake -> tidbcloudlake, develop -> developer
    {
      linkPattern: "/{namespace}/{...any}/{docname}",
      targetPattern: "/{curLang}/{namespace}/{docname}",
      conditions: {
        namespace: [
          "tidb-cloud",
          "tidb-cloud-lake",
          "develop",
          "best-practices",
          "api",
          "ai",
        ],
      },
      namespaceTransform: {
        "tidb-cloud": "tidbcloud",
        "tidb-cloud-lake": "tidbcloudlake",
        develop: "developer",
      },
    },
    // tidbcloud with prefix pages (path-based mapping)
    // Current page: /{lang}/tidbcloud/{...any}
    // Link: /{...any}/{docname} -> /{lang}/tidbcloud/{docname}
    {
      pathPattern: "/{lang}/tidbcloud/{...any}",
      linkPattern: "/{...any}/{docname}",
      targetPattern: "/{lang}/tidbcloud/{docname}",
    },
    // tidbcloudlake pages (path-based mapping)
    // Current page: /{lang}/tidbcloudlake/{...any}
    // Link: /{...any}/{docname} -> /{lang}/tidbcloudlake/{docname}
    {
      pathPattern: "/{lang}/tidbcloudlake/{...any}",
      linkPattern: "/{...any}/{docname}",
      targetPattern: "/{lang}/tidbcloudlake/{docname}",
    },
    // Relative Filesystem links stay in the English product namespace.
    // Explicit AI and other namespace links are handled by the rules above.
    {
      pathPattern: "/{lang}/tidbcloud-filesystem/{...any}",
      linkPattern: "/{...folders}/{docname}",
      targetPattern: "/tidbcloud-filesystem/{docname}",
    },
    // developer, best-practices, api, ai namespace in tidb folder
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
    // Versioned docs with branch pages (path-based mapping)
    // Current page: /{lang}/{repo}/{branch}/{...any} (branch is already aliased, e.g., "stable", "v8.5")
    // Link: /{...any}/{docname} -> /{lang}/{repo}/{branch}/{docname}
    {
      pathPattern: "/{lang}/{repo}/{branch}/{...any}",
      pathConditions: {
        repo: ["tidb", "tidb-in-kubernetes", "tidb-data-migration"],
      },
      linkPattern: "/{...folders}/_index",
      targetPattern: "/{lang}/{repo}/{branch}/{folders}",
    },
    {
      pathPattern: "/{lang}/{repo}/{branch}/{...any}",
      pathConditions: {
        repo: ["tidb", "tidb-in-kubernetes", "tidb-data-migration"],
      },
      linkPattern: "/{...any}/{docname}",
      targetPattern: "/{lang}/{repo}/{branch}/{docname}",
    },
  ],
};
