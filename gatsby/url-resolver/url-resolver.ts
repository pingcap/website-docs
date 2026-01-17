/**
 * URL resolver for mapping source file paths to published URLs
 */

import type {
  PathMappingRule,
  UrlResolverConfig,
  ParsedSourcePath,
} from "./types";
import {
  matchPattern,
  applyPattern,
  clearPatternCache,
} from "./pattern-matcher";
import { defaultUrlResolverConfig } from "./config";

// Cache for calculateFileUrl results
// Key: absolutePath + omitDefaultLanguage flag
// Value: resolved URL or null
const fileUrlCache = new Map<string, string | null>();

// Cache for parseSourcePath results
// Key: absolutePath + sourceBasePath
// Value: ParsedSourcePath or null
const parsedPathCache = new Map<string, ParsedSourcePath | null>();

/**
 * Parse source file path into segments and filename
 * No hardcoded logic - variables will be extracted via pattern matching
 *
 * Supports both absolute paths and relative paths (slug format):
 * - Absolute path: "/path/to/docs/markdown-pages/en/tidb/master/alert-rules.md"
 * - Relative path (slug): "en/tidb/master/alert-rules" (will be treated as relative to sourceBasePath)
 *
 * A path is considered a slug (relative path) if:
 * - It doesn't start with sourceBasePath
 * - It doesn't start with "/" (unless it's a valid slug starting with lang code)
 * - It looks like a slug format (starts with lang code like "en/", "zh/", "ja/")
 */
export function parseSourcePath(
  absolutePath: string,
  sourceBasePath: string
): ParsedSourcePath | null {
  // Check cache first
  const cacheKey = `${absolutePath}::${sourceBasePath}`;
  const cached = parsedPathCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  // Normalize paths
  const normalizedBase = sourceBasePath.replace(/\/$/, "");
  const normalizedPath = absolutePath.replace(/\/$/, "");

  let relativePath: string;

  // Check if path is absolute (starts with sourceBasePath)
  if (normalizedPath.startsWith(normalizedBase)) {
    // Absolute path: extract relative path
    relativePath = normalizedPath.slice(normalizedBase.length);
  } else {
    // Check if it looks like a slug (relative path)
    // Remove leading slash if present for checking
    const pathWithoutLeadingSlash = normalizedPath.startsWith("/")
      ? normalizedPath.slice(1)
      : normalizedPath;

    // Slug format: must start with valid lang code (en/, zh/, ja/)
    // This ensures we only accept valid slug formats, not arbitrary paths
    const isSlugFormat = /^(en|zh|ja)\//.test(pathWithoutLeadingSlash);

    if (isSlugFormat) {
      // Relative path (slug format): use path without leading slash
      relativePath = pathWithoutLeadingSlash;
    } else {
      // Invalid path: doesn't match absolute path and doesn't look like a slug
      return null;
    }
  }

  // Remove leading slash for processing
  if (relativePath.startsWith("/")) {
    relativePath = relativePath.slice(1);
  }

  const segments = relativePath
    .split("/")
    .filter((s) => s.length > 0)
    .filter((s) => !s.startsWith("."));

  if (segments.length < 2) {
    // At least: lang, filename (or more)
    return null;
  }

  // Extract filename (last segment)
  // If it doesn't have .md extension, add it for consistency
  let lastSegment = segments[segments.length - 1];
  if (!lastSegment.endsWith(".md")) {
    lastSegment = lastSegment + ".md";
  }
  const filename = lastSegment.replace(/\.md$/, "");

  // Update segments array to include .md extension if it was added
  segments[segments.length - 1] = lastSegment;

  const result: ParsedSourcePath = {
    segments,
    filename,
  };

  // Cache the result
  parsedPathCache.set(cacheKey, result);
  return result;
}

/**
 * Check if conditions are met
 * Conditions are checked against matched variables from pattern
 * Supports arbitrary variables from sourcePattern
 */
function checkConditions(
  conditions: PathMappingRule["conditions"],
  variables: Record<string, string>
): boolean {
  if (!conditions) return true;

  // Check each condition - supports arbitrary variable names
  for (const [variableName, allowedValues] of Object.entries(conditions)) {
    const variableValue = variables[variableName];
    if (variableValue && allowedValues) {
      if (!allowedValues.includes(variableValue)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Calculate file URL from source path (internal implementation with config)
 * Variables are dynamically extracted via pattern matching
 */
export function calculateFileUrlWithConfig(
  absolutePath: string,
  config: UrlResolverConfig,
  omitDefaultLanguage: boolean = false
): string | null {
  // Check cache first
  const cacheKey = `${absolutePath}::${omitDefaultLanguage}`;
  const cached = fileUrlCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  const parsed = parseSourcePath(absolutePath, config.sourceBasePath);
  if (!parsed) {
    // Cache null result
    fileUrlCache.set(cacheKey, null);
    return null;
  }

  // Build segments for pattern matching (include filename)
  const allSegments = [...parsed.segments];

  // Try each mapping rule in order
  for (const rule of config.pathMappings) {
    // Try to match source pattern first to extract variables
    const variables = matchPattern(rule.sourcePattern, allSegments);
    if (!variables) {
      continue;
    }

    // Replace filename variable with parsed filename (without .md extension)
    // This ensures conditions can check against the actual filename without extension
    if (variables.filename) {
      variables.filename = parsed.filename;
    }

    // Check conditions using matched variables
    if (!checkConditions(rule.conditions, variables)) {
      continue;
    }

    // Handle filename transform
    let finalFilename = parsed.filename;
    if (rule.filenameTransform?.ignoreIf) {
      if (rule.filenameTransform.ignoreIf.includes(parsed.filename)) {
        finalFilename = "";
      }
    }

    // Determine which target pattern to use
    let targetPatternToUse = rule.targetPattern;
    if (rule.filenameTransform?.conditionalTarget?.keepIf) {
      if (
        rule.filenameTransform.conditionalTarget.keepIf.includes(
          parsed.filename
        )
      ) {
        targetPatternToUse =
          rule.filenameTransform.conditionalTarget.keepTargetPattern;
      }
    }

    // Build target URL
    const targetVars = { ...variables };
    if (finalFilename) {
      targetVars.filename = finalFilename;
    } else {
      delete targetVars.filename;
    }

    let url = applyPattern(targetPatternToUse, targetVars, config);

    // Handle default language omission
    // Only omit if omitDefaultLanguage is explicitly true
    if (
      omitDefaultLanguage === true &&
      config.defaultLanguage &&
      url.startsWith(`/${config.defaultLanguage}/`)
    ) {
      url = url.replace(`/${config.defaultLanguage}/`, "/");
    }

    // Handle trailing slash based on config
    const trailingSlash = config.trailingSlash || "auto";
    if (trailingSlash === "never") {
      url = url.replace(/\/$/, "");
    } else if (trailingSlash === "always") {
      if (!url.endsWith("/")) {
        url = url + "/";
      }
    } else {
      // "auto" mode: remove trailing slash if filename was ignored, add for non-index files
      if (!finalFilename && url.endsWith("/")) {
        url = url.slice(0, -1);
      } else if (finalFilename && !url.endsWith("/")) {
        url = url + "/";
      }
    }

    return url;
  }

  // Fallback: use default rule
  // Extract at least lang and repo from segments
  if (parsed.segments.length >= 2) {
    const lang = parsed.segments[0];
    const repo = parsed.segments[1];
    let url = `/${lang}/${repo}`;
    if (parsed.filename && parsed.filename !== "_index") {
      url = `${url}/${parsed.filename}/`;
    } else {
      url = url + "/";
    }

    // Handle default language omission
    // Only omit if omitDefaultLanguage is explicitly true
    if (
      omitDefaultLanguage === true &&
      config.defaultLanguage &&
      url.startsWith(`/${config.defaultLanguage}/`)
    ) {
      url = url.replace(`/${config.defaultLanguage}/`, "/");
    }

    // Handle trailing slash based on config
    const trailingSlash = config.trailingSlash || "auto";
    if (trailingSlash === "never") {
      url = url.replace(/\/$/, "");
    } else if (trailingSlash === "always") {
      if (!url.endsWith("/")) {
        url = url + "/";
      }
    }
    // "auto" mode is already handled above

    // Cache the result before returning
    fileUrlCache.set(cacheKey, url);
    return url;
  }

  // Cache null result
  fileUrlCache.set(cacheKey, null);
  // Cache null result
  fileUrlCache.set(cacheKey, null);
  return null;
}

/**
 * Calculate file URL from source path
 * Variables are dynamically extracted via pattern matching
 * Uses global defaultUrlResolverConfig
 *
 * @param absolutePath - Absolute path to the source file or slug format (e.g., "en/tidb/master/alert-rules")
 * @param omitDefaultLanguage - Whether to omit default language prefix (default: false, keeps language prefix)
 */
export function calculateFileUrl(
  absolutePath: string,
  omitDefaultLanguage: boolean = false
): string | null {
  return calculateFileUrlWithConfig(
    absolutePath,
    defaultUrlResolverConfig,
    omitDefaultLanguage
  );
}

/**
 * Clear all caches (useful for testing or when config changes)
 */
export function clearUrlResolverCache(): void {
  fileUrlCache.clear();
  parsedPathCache.clear();
  // Also clear pattern cache
  clearPatternCache();
}
