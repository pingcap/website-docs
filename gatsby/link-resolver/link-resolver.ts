/**
 * Link resolver for transforming markdown links within articles
 */

import { matchPattern, applyPattern } from "../url-resolver/pattern-matcher";
import { defaultUrlResolverConfig } from "../url-resolver/config";
import { defaultLinkResolverConfig } from "./config";

/**
 * Parse link path into segments
 */
function parseLinkPath(linkPath: string): string[] {
  // Remove leading and trailing slashes, then split
  const normalized = linkPath.replace(/^\/+|\/+$/g, "");
  if (!normalized) {
    return [];
  }
  return normalized.split("/").filter((s) => s.length > 0);
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
  const linkConfig = defaultLinkResolverConfig;
  const urlConfig = defaultUrlResolverConfig;
  if (!linkPath || linkPath.startsWith("http") || linkPath.startsWith("#")) {
    // Skip external links and anchor links
    return linkPath;
  }

  // Normalize link path
  const normalizedLink = linkPath.startsWith("/") ? linkPath : "/" + linkPath;
  const linkSegments = parseLinkPath(normalizedLink);

  if (linkSegments.length === 0) {
    return linkPath;
  }

  // Rule 1: Try link mappings first
  for (const rule of linkConfig.linkMappings) {
    const variables = matchPattern(rule.sourcePattern, linkSegments);
    if (!variables) {
      continue;
    }

    // Check conditions
    if (rule.conditions) {
      let conditionsMet = true;
      for (const [varName, allowedValues] of Object.entries(rule.conditions)) {
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

    return result;
  }

  // Rule 2: Path-based link mappings (based on current page path)
  if (linkConfig.linkMappingsByPath) {
    const currentPageSegments = parseLinkPath(currentPageUrl);

    for (const pathRule of linkConfig.linkMappingsByPath) {
      // Match current page path pattern
      const pageVars = matchPattern(pathRule.pathPattern, currentPageSegments);
      if (!pageVars) {
        continue;
      }

      // Check path conditions (if specified, check against page variables)
      if (pathRule.pathConditions) {
        if (!checkConditions(pathRule.pathConditions, pageVars)) {
          continue;
        }
      }

      // Check conditions (if specified, check against page variables as fallback)
      if (pathRule.conditions && !pathRule.pathConditions) {
        if (!checkConditions(pathRule.conditions, pageVars)) {
          continue;
        }
      }

      // Match link pattern
      const linkVars = matchPattern(pathRule.linkPattern, linkSegments);
      if (!linkVars) {
        continue;
      }

      // Merge current page variables with link variables
      const mergedVars = { ...pageVars, ...linkVars };

      // Set default values for missing variables
      // For tidb pages without lang prefix, default to "en"
      if (pageVars.repo === "tidb" && !mergedVars.lang) {
        mergedVars.lang = "en";
      }

      // Build target URL
      const targetUrl = applyPattern(
        pathRule.targetPattern,
        mergedVars,
        urlConfig
      );

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

      return result;
    }
  }

  // No match found, return original link
  return linkPath;
}
