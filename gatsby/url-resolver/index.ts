/**
 * URL Resolver - Main entry point
 *
 * This module provides utilities for:
 * - Mapping source file paths to published URLs
 */

// Export types
export type {
  PathMappingRule,
  AliasMapping,
  AliasPattern,
  UrlResolverConfig,
  ParsedSourcePath,
  FileUrlContext,
} from "./types";

// Export URL resolver functions
export { parseSourcePath, calculateFileUrl, calculateFileUrlWithConfig, clearUrlResolverCache } from "./url-resolver";

// Export pattern matcher utilities (for advanced use cases)
export { matchPattern, applyPattern } from "./pattern-matcher";

// Export alias utilities
export { getAlias, getVariableAlias } from "./branch-alias";

// Export default configuration
export { defaultUrlResolverConfig } from "./config";
