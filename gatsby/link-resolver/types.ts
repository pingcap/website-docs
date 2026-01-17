/**
 * Type definitions for link resolver
 */

export interface LinkMappingRule {
  // Pattern to match current page path (for path-based mapping, optional)
  // e.g., "/tidbcloud/{...any}" or "/{lang}/{repo}/{branch:branch-alias}/{...any}"
  // If not specified, this is a direct link mapping
  pathPattern?: string;
  // Pattern to match link path
  // e.g., "/{namespace}/{...any}/{docname}" or "/{...any}/{docname}"
  linkPattern: string;
  // Target URL pattern
  // e.g., "/{namespace}/{docname}" or "/{lang}/tidbcloud/{docname}"
  targetPattern: string;
  // Conditions for this rule to apply (checked against link variables or merged variables)
  conditions?: Record<string, string[]>;
  // Conditions for current page path variables (checked against variables extracted from pathPattern)
  pathConditions?: Record<string, string[]>;
  // Namespace transformation (e.g., "tidb-cloud" -> "tidbcloud")
  namespaceTransform?: Record<string, string>;
}

export interface LinkResolverConfig {
  // Link mapping rules (ordered, first match wins)
  // Rules can be either direct link mappings (linkPattern only) or path-based mappings (pathPattern + linkPattern)
  linkMappings: LinkMappingRule[];
  // Default language to omit from resolved URLs (e.g., "en" -> /tidb/stable instead of /en/tidb/stable)
  defaultLanguage?: string;
}
