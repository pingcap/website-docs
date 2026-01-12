/**
 * Link resolver for resolving markdown links to target URLs
 */

import type { LinkMappingRule, UrlResolverConfig } from "./types";
import { matchPattern, applyPattern } from "./pattern-matcher";

/**
 * Parse markdown link
 */
export function parseMarkdownLink(linkPath: string): {
  isAbsolute: boolean;
  segments: string[];
  filename: string;
} {
  const normalized = linkPath.startsWith("/") ? linkPath.slice(1) : linkPath;
  const segments = normalized.split("/").filter((s) => s.length > 0);
  const lastSegment = segments[segments.length - 1] || "";
  const filename = lastSegment.replace(/\.md$/, "");

  return {
    isAbsolute: linkPath.startsWith("/"),
    segments,
    filename,
  };
}

/**
 * Check if link mapping rule conditions are met
 * Supports arbitrary variables from linkPattern
 */
function checkLinkConditions(
  conditions: LinkMappingRule["conditions"],
  linkPath: string,
  variables: Record<string, string>
): boolean {
  if (!conditions) return true;

  // Check startsWith condition (special field, checked against linkPath)
  if (conditions.startsWith) {
    const matches = conditions.startsWith.some((prefix) =>
      linkPath.startsWith(prefix)
    );
    if (!matches) {
      return false;
    }
  }

  // Check other variable conditions (arbitrary variables from linkPattern)
  for (const [variableName, allowedValues] of Object.entries(conditions)) {
    // Skip startsWith as it's already checked above
    if (variableName === "startsWith") {
      continue;
    }

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
 * Resolve markdown link to target URL
 */
export function resolveMarkdownLink(
  linkPath: string,
  currentFileUrl: string,
  config: UrlResolverConfig
): string | null {
  const parsed = parseMarkdownLink(linkPath);

  // Try link mapping rules
  for (const rule of config.linkMappings) {
    // Quick check: startsWith condition (can be checked before pattern matching)
    if (rule.conditions?.startsWith) {
      const matches = rule.conditions.startsWith.some((prefix) =>
        linkPath.startsWith(prefix)
      );
      if (!matches) {
        continue;
      }
    }

    // Try to match link pattern
    const variables = matchPattern(rule.linkPattern, parsed.segments);
    if (variables) {
      // Check all conditions (including variable conditions)
      if (!checkLinkConditions(rule.conditions, linkPath, variables)) {
        continue;
      }
      // Extract context from current file URL
      // Note: currentFileUrl already contains the aliased branch
      const currentSegments = currentFileUrl
        .split("/")
        .filter((s) => s.length > 0);
      const currentLang = currentSegments[0] || "en";
      const currentRepo = currentSegments[1] || "";
      const currentBranch = currentSegments[2] || "";

      // Build variables for target pattern
      const targetVars: Record<string, string> = {
        ...variables,
        lang: currentLang,
        repo: currentRepo,
        branch: currentBranch,
      };

      // For branch:alias syntax, we need to set branch-alias to the same value
      // since currentBranch is already aliased
      if (currentBranch) {
        targetVars["branch-alias"] = currentBranch;
      }

      let url = applyPattern(rule.targetPattern, targetVars);

      // Remove default language segment if configured
      if (config.defaultLanguage && currentLang === config.defaultLanguage) {
        const segments = url.split("/").filter((s) => s.length > 0);
        if (segments[0] === config.defaultLanguage) {
          segments.shift();
          url = "/" + segments.join("/");
        }
      }

      if (!url.endsWith("/")) {
        url = url + "/";
      }
      return url;
    }
  }

  // Default: use current context
  // Note: currentFileUrl already contains the aliased branch (e.g., "stable" instead of "master")
  if (config.defaultLinkResolution?.useCurrentContext) {
    const currentSegments = currentFileUrl
      .split("/")
      .filter((s) => s.length > 0);
    const currentLang = currentSegments[0] || "en";
    const currentRepo = currentSegments[1] || "";
    // Use branch directly from current URL (it's already aliased)
    const currentBranch = currentSegments[2] || "";

    const filename = parsed.filename;
    let url: string;
    if (filename) {
      url = `/${currentLang}/${currentRepo}/${currentBranch}/${filename}/`;
    } else {
      url = `/${currentLang}/${currentRepo}/${currentBranch}/`;
    }

    // Remove default language segment if configured
    if (config.defaultLanguage && currentLang === config.defaultLanguage) {
      const segments = url.split("/").filter((s) => s.length > 0);
      if (segments[0] === config.defaultLanguage) {
        segments.shift();
        url = "/" + segments.join("/") + "/";
      }
    }

    return url;
  }

  return null;
}
