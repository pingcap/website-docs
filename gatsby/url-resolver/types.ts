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
  };
}

export interface BranchAliasPattern {
  // Pattern to match branch name (supports wildcard * and regex)
  // e.g., "release-*" or "release-(.*)"
  pattern: string;
  // Replacement pattern (supports $1, $2, etc. for captured groups)
  // e.g., "v$1" for "release-8.5" -> "v8.5"
  replacement: string;
  // Whether to use regex matching (default: false, uses wildcard matching)
  useRegex?: boolean;
}

export interface BranchAlias {
  // Branch name to alias mapping
  // Can be:
  // 1. Simple string mapping: { "master": "stable" }
  // 2. Pattern-based mapping: { "release-*": "v*" } (wildcard)
  // 3. Regex-based mapping: { pattern: "release-(.*)", replacement: "v$1", useRegex: true }
  [branch: string]: string | BranchAliasPattern;
}

export interface LinkMappingRule {
  // Pattern to match markdown link paths
  // e.g., "/abc/{filename}" or "/release/{filename}"
  linkPattern: string;
  // Target URL pattern
  // e.g., "/{lang}/{repo}/{branch}/{filename}"
  targetPattern: string;
  // Conditions
  conditions?: {
    // Special condition: Link must start with one of these prefixes
    startsWith?: string[];
    // Supports arbitrary variables from linkPattern
    // e.g., { repo: ["tidbcloud"], section: ["api", "docs"] }
    [variable: string]: string[] | undefined;
  };
}

export interface UrlResolverConfig {
  // Base path for source files
  sourceBasePath: string;
  // Path mapping rules (ordered, first match wins)
  pathMappings: PathMappingRule[];
  // Branch alias mappings
  branchAliases: {
    [repo: string]: BranchAlias;
  };
  // Link mapping rules
  linkMappings: LinkMappingRule[];
  // Default link resolution (when no rule matches)
  defaultLinkResolution?: {
    // Use current file's context (lang, repo, branch) for relative links
    useCurrentContext: boolean;
  };
  // Default language - if lang matches this, skip the language segment in URLs
  // e.g., if defaultLanguage is "en", /en/tidbcloud/api-overview/ becomes /tidbcloud/api-overview/
  defaultLanguage?: string;
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
