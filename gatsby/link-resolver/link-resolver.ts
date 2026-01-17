/**
 * Link resolver for transforming markdown links within articles
 */

import { matchPattern, applyPattern } from "../url-resolver/pattern-matcher";
import { defaultUrlResolverConfig } from "../url-resolver/config";
import { defaultLinkResolverConfig } from "./config";

// Cache for resolveMarkdownLink results
// Key: linkPath + currentPageUrl
// Value: resolved URL or original linkPath
const linkResolverCache = new Map<string, string>();

// Cache for parseLinkPath results
// Key: linkPath
// Value: parsed segments array
const parsedLinkPathCache = new Map<string, string[]>();

/**
 * Parse link path into segments
 */
function parseLinkPath(linkPath: string): string[] {
  // Check cache first
  const cached = parsedLinkPathCache.get(linkPath);
  if (cached !== undefined) {
    return cached;
  }

  // Remove leading and trailing slashes, then split
  const normalized = linkPath.replace(/^\/+|\/+$/g, "");
  if (!normalized) {
    parsedLinkPathCache.set(linkPath, []);
    return [];
  }
  const segments = normalized.split("/").filter((s) => s.length > 0);
  parsedLinkPathCache.set(linkPath, segments);
  return segments;
}

/**
 * Check if conditions are met
 */
function checkConditions(
  conditions: Record<string, string[]> | undefined,
  variables: Record<string, string>
): boolean {
  if (!conditions) return true;

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
 * Resolve markdown link based on mapping rules
 * Uses global defaultLinkResolverConfig and defaultUrlResolverConfig
 *
 * @param linkPath - The markdown link path to resolve
 * @param currentPageUrl - The current page URL for context-based resolution
 */
export function resolveMarkdownLink(
  linkPath: string,
  currentPageUrl: string
): string | null {
  // Early exit for external links and anchor links (most common case)
  if (!linkPath || linkPath.startsWith("http") || linkPath.startsWith("#")) {
    return linkPath;
  }

  // Check cache
  const cacheKey = `${linkPath}::${currentPageUrl}`;
  const cached = linkResolverCache.get(cacheKey);
  if (cached !== undefined) {
    return cached;
  }

  const linkConfig = defaultLinkResolverConfig;
  const urlConfig = defaultUrlResolverConfig;

  // Normalize link path
  const normalizedLink = linkPath.startsWith("/") ? linkPath : "/" + linkPath;
  const linkSegments = parseLinkPath(normalizedLink);

  // Early exit for empty links
  if (linkSegments.length === 0) {
    linkResolverCache.set(cacheKey, linkPath);
    return linkPath;
  }

  // Process all rules in order (first match wins)
  const currentPageSegments = parseLinkPath(currentPageUrl);

  // Extract curLang from the first segment of currentPageUrl
  const curLang = currentPageSegments.length > 0 ? currentPageSegments[0] : "";

  for (const rule of linkConfig.linkMappings) {
    let variables: Record<string, string> | null = null;

    // Check if this is a direct link mapping (linkPattern only) or path-based mapping (pathPattern + linkPattern)
    if (!rule.pathPattern) {
      // Direct link mapping: match link path directly
      variables = matchPattern(rule.linkPattern, linkSegments);
      if (!variables) {
        continue;
      }

      // Add curLang as default variable
      if (curLang) {
        variables.curLang = curLang;
      }

      // Check conditions
      if (rule.conditions) {
        let conditionsMet = true;
        for (const [varName, allowedValues] of Object.entries(
          rule.conditions
        )) {
          const varValue = variables[varName];
          if (varValue && allowedValues) {
            if (!allowedValues.includes(varValue)) {
              conditionsMet = false;
              break;
            }
          }
        }
        if (!conditionsMet) {
          continue;
        }
      }

      // Apply namespace transformation if needed
      if (rule.namespaceTransform && variables.namespace) {
        const transformed = rule.namespaceTransform[variables.namespace];
        if (transformed) {
          variables.namespace = transformed;
        }
      }
    } else {
      // Path-based mapping: match current page path first, then link path
      const pageVars = matchPattern(rule.pathPattern, currentPageSegments);
      if (!pageVars) {
        continue;
      }

      // Check path conditions (if specified, check against page variables)
      if (rule.pathConditions) {
        if (!checkConditions(rule.pathConditions, pageVars)) {
          continue;
        }
      }

      // Check conditions (if specified, check against page variables as fallback)
      if (rule.conditions && !rule.pathConditions) {
        if (!checkConditions(rule.conditions, pageVars)) {
          continue;
        }
      }

      // Match link pattern
      const linkVars = matchPattern(rule.linkPattern, linkSegments);
      if (!linkVars) {
        continue;
      }

      // Merge current page variables with link variables
      variables = { ...pageVars, ...linkVars };

      // Add curLang as default variable
      if (curLang) {
        variables.curLang = curLang;
      }

      // Set default values for missing variables
      // For tidb pages without lang prefix, default to "en"
      if (pageVars.repo === "tidb" && !variables.lang) {
        variables.lang = "en";
      }
    }

    // Build target URL
    const targetUrl = applyPattern(rule.targetPattern, variables, urlConfig);

    // Handle default language and trailing slash
    let result = targetUrl;
    // Use linkConfig.defaultLanguage if available, otherwise fallback to urlConfig.defaultLanguage
    const defaultLanguage =
      linkConfig.defaultLanguage || urlConfig.defaultLanguage;
    if (defaultLanguage && result.startsWith(`/${defaultLanguage}/`)) {
      result = result.replace(`/${defaultLanguage}/`, "/");
    }
    if (urlConfig.trailingSlash === "never") {
      result = result.replace(/\/$/, "");
    }

    // Cache the result
    linkResolverCache.set(cacheKey, result);
    return result;
  }

  // No match found, return original link
  // Cache the original linkPath
  linkResolverCache.set(cacheKey, linkPath);
  return linkPath;
}

/**
 * Clear link resolver cache (useful for testing or when config changes)
 */
export function clearLinkResolverCache(): void {
  linkResolverCache.clear();
  parsedLinkPathCache.clear();
}
