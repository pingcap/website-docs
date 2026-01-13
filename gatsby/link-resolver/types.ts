/**
 * Type definitions for link resolver
 */

export interface LinkMappingRule {
  // Pattern to match link path
  // e.g., "/{namespace}/{...any}/{docname}"
  sourcePattern: string;
  // Target URL pattern
  // e.g., "/{namespace}/{docname}"
  targetPattern: string;
  // Conditions for this rule to apply
  conditions?: Record<string, string[]>;
  // Namespace transformation (e.g., "tidb-cloud" -> "tidbcloud")
  namespaceTransform?: Record<string, string>;
}

export interface LinkMappingByPath {
  // Pattern to match current page path (similar to sourcePattern in url-resolver)
  // e.g., "/tidbcloud/{...any}" or "/{lang}/{repo}/{branch:branch-alias}/{...any}"
  pathPattern: string;
  // Pattern to match link path
  // e.g., "/{...any}/{docname}"
  linkPattern: string;
  // Target URL pattern for the link
  // e.g., "/tidbcloud/{docname}" or "/{lang}/{repo}/{branch:branch-alias}/{docname}"
  targetPattern: string;
  // Conditions for current page path variables (checked against variables extracted from pathPattern)
  pathConditions?: Record<string, string[]>;
  // Conditions for this rule to apply (optional, checked against merged variables)
  conditions?: Record<string, string[]>;
}

export interface LinkResolverConfig {
  // Link mapping rules (ordered, first match wins)
  linkMappings: LinkMappingRule[];
  // Path-based link mappings that depend on current page URL
  // Matches current page path using pathPattern, then applies link transformation
  linkMappingsByPath?: LinkMappingByPath[];
  // Default language to omit from resolved URLs (e.g., "en" -> /tidb/stable instead of /en/tidb/stable)
  defaultLanguage?: string;
}
