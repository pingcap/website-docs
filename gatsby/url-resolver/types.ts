/**
 * Type definitions for URL resolver
 */

export interface PathMappingRule {
  // Pattern to match source path segments
  // e.g., "/{lang}/{repo}/{namespace}/{prefix}/{filename}"
  sourcePattern: string;
  // Target URL pattern
  // e.g., "/{lang}/{repo}/{prefix}/{filename}"
  targetPattern: string;
  // Conditions for this rule to apply
  // Supports arbitrary variables from sourcePattern
  // e.g., { repo: ["tidbcloud"], folder: ["develop", "api"] }
  conditions?: Record<string, string[]>;
  // Special handling for filename
  filenameTransform?: {
    ignoreIf?: string[]; // e.g., ["_index"] - ignore filename if it matches
    // Conditional target pattern based on filename
    // If filename matches any value in keepIf, use keepTargetPattern, otherwise use targetPattern
    conditionalTarget?: {
      keepIf?: string[]; // e.g., ["_index"] - use keepTargetPattern if filename matches
      keepTargetPattern: string; // Alternative target pattern when filename matches keepIf
    };
  };
}

export interface AliasPattern {
  // Pattern to match value (supports wildcard * and regex)
  // e.g., "release-*" or "release-(.*)"
  pattern: string;
  // Replacement pattern (supports $1, $2, etc. for captured groups)
  // e.g., "v$1" for "release-8.5" -> "v8.5"
  replacement: string;
  // Whether to use regex matching (default: false, uses wildcard matching)
  useRegex?: boolean;
}

export interface AliasMapping {
  // Value to alias mapping
  // Can be:
  // 1. Simple string mapping: { "master": "stable" }
  // 2. Pattern-based mapping: { "release-*": "v*" } (wildcard)
  // 3. Regex-based mapping: { pattern: "release-(.*)", replacement: "v$1", useRegex: true }
  [value: string]: string | AliasPattern;
}

export interface UrlResolverConfig {
  // Base path for source files
  sourceBasePath: string;
  // Path mapping rules (ordered, first match wins)
  pathMappings: PathMappingRule[];
  // Alias mappings for variables
  // Supports arbitrary alias names like 'branch-alias', 'repo-alias', etc.
  // Usage in targetPattern: {branch:branch-alias} -> uses aliases['branch-alias']
  aliases?: {
    [aliasName: string]: {
      // Optional context conditions for the alias
      // e.g., { repo: ["tidb", "tidb-in-kubernetes"] } - only apply when repo matches
      context?: Record<string, string[]>;
      // The actual alias mappings
      mappings: AliasMapping;
    };
  };
  // Default language to omit from URL (e.g., "en" -> /tidb/stable instead of /en/tidb/stable)
  defaultLanguage?: string;
  // Control trailing slash behavior
  // "always" - always add trailing slash
  // "never" - never add trailing slash
  // "auto" - add for non-index files, remove for index files (default)
  trailingSlash?: "always" | "never" | "auto";
}

export interface ParsedSourcePath {
  segments: string[];
  filename: string;
}

export interface FileUrlContext {
  lang: string;
  repo: string;
  branch?: string;
  version?: string;
  prefix?: string;
  filename?: string;
}
