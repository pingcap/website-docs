/**
 * URL resolver for mapping source file paths to published URLs
 */

import type {
  PathMappingRule,
  UrlResolverConfig,
  ParsedSourcePath,
} from "./types";
import { matchPattern, applyPattern } from "./pattern-matcher";
import { getBranchAlias } from "./branch-alias";

/**
 * Parse source file path into segments and filename
 * No hardcoded logic - variables will be extracted via pattern matching
 */
export function parseSourcePath(
  absolutePath: string,
  sourceBasePath: string
): ParsedSourcePath | null {
  // Normalize paths
  const normalizedBase = sourceBasePath.replace(/\/$/, "");
  const normalizedPath = absolutePath.replace(/\/$/, "");

  // Extract relative path
  if (!normalizedPath.startsWith(normalizedBase)) {
    return null;
  }

  const relativePath = normalizedPath.slice(normalizedBase.length);
  const segments = relativePath
    .split("/")
    .filter((s) => s.length > 0)
    .filter((s) => !s.startsWith("."));

  if (segments.length < 2) {
    // At least: lang, filename (or more)
    return null;
  }

  // Extract filename (last segment)
  const lastSegment = segments[segments.length - 1];
  const filename = lastSegment.replace(/\.md$/, "");

  return {
    segments,
    filename,
  };
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
 * Calculate file URL from source path
 * Variables are dynamically extracted via pattern matching
 */
export function calculateFileUrl(
  absolutePath: string,
  config: UrlResolverConfig
): string | null {
  const parsed = parseSourcePath(absolutePath, config.sourceBasePath);
  if (!parsed) {
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

    // Check conditions using matched variables
    if (!checkConditions(rule.conditions, variables)) {
      continue;
    }

    // Apply branch alias if needed
    if (
      variables.branch &&
      variables.repo &&
      config.branchAliases[variables.repo]
    ) {
      const alias = getBranchAlias(
        config.branchAliases[variables.repo],
        variables.branch
      );
      if (alias) {
        variables["branch-alias"] = alias;
      }
    }

    // Handle filename transform
    let finalFilename = parsed.filename;
    if (rule.filenameTransform?.ignoreIf) {
      if (rule.filenameTransform.ignoreIf.includes(parsed.filename)) {
        finalFilename = "";
      }
    }

    // Build target URL
    const targetVars = { ...variables };
    if (finalFilename) {
      targetVars.filename = finalFilename;
    } else {
      delete targetVars.filename;
    }

    let url = applyPattern(rule.targetPattern, targetVars);

    // Remove trailing slash if filename was ignored
    if (!finalFilename && url.endsWith("/")) {
      url = url.slice(0, -1);
    }

    // Add trailing slash for non-index files
    if (finalFilename && !url.endsWith("/")) {
      url = url + "/";
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
    return url;
  }

  return null;
}
