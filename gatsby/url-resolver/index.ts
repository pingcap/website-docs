/**
 * URL Resolver - Main entry point
 *
 * This module provides utilities for:
 * - Mapping source file paths to published URLs
 * - Resolving markdown links to target URLs
 */

// Export types
export type {
  PathMappingRule,
  BranchAlias,
  BranchAliasPattern,
  LinkMappingRule,
  UrlResolverConfig,
  ParsedSourcePath,
  FileUrlContext,
} from "./types";

// Export URL resolver functions
export { parseSourcePath, calculateFileUrl } from "./url-resolver";

// Export link resolver functions
export { parseMarkdownLink, resolveMarkdownLink } from "./link-resolver";

// Export pattern matcher utilities (for advanced use cases)
export { matchPattern, applyPattern } from "./pattern-matcher";

// Export branch alias utilities
export { getBranchAlias } from "./branch-alias";

// Export default configuration
export { defaultUrlResolverConfig } from "./config";
