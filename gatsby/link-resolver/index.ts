/**
 * Link Resolver - Main entry point
 *
 * This module provides utilities for:
 * - Resolving markdown links within articles based on mapping rules
 * - Context-based link resolution based on current page URL
 */

// Export types
export type { LinkMappingRule, LinkResolverConfig } from "./types";

// Export link resolver functions
export { resolveMarkdownLink, clearLinkResolverCache } from "./link-resolver";

// Export default configuration
export { defaultLinkResolverConfig } from "./config";
