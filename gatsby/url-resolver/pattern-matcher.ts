/**
 * Pattern matching utilities for URL resolver
 */

import { getAlias } from "./branch-alias";

/**
 * Match path segments against a pattern
 * Supports patterns with variable number of segments using {...variableName} syntax
 * Variables are dynamically extracted from the pattern
 *
 * Examples:
 * - {...folders} matches 0 or more segments, accessible as {folders} in target
 * - {...prefix} matches 0 or more segments, accessible as {prefix} in target
 */
export function matchPattern(
  pattern: string,
  segments: string[]
): Record<string, string> | null {
  const patternParts = pattern
    .split("/")
    .filter((p) => p.length > 0)
    .filter((p) => !p.startsWith("/"));

  const result: Record<string, string> = {};
  let segmentIndex = 0;
  let patternIndex = 0;

  while (patternIndex < patternParts.length && segmentIndex < segments.length) {
    const patternPart = patternParts[patternIndex];
    const segment = segments[segmentIndex];

    // Handle variable segments pattern {...variableName}
    // e.g., {...folders} -> variable name is "folders", accessible as {folders} in target
    if (patternPart.startsWith("{...") && patternPart.endsWith("}")) {
      // Extract variable name from {...variableName}
      const variableName = patternPart.slice(4, -1); // Remove "{..." and "}"

      // Find the next pattern part after {...variableName}
      const nextPatternIndex = patternIndex + 1;
      if (nextPatternIndex < patternParts.length) {
        // We need to match the remaining patterns to the remaining segments
        // The variable segments should be everything between current position and where the next pattern matches
        const remainingPatterns = patternParts.slice(nextPatternIndex);
        const remainingSegments = segments.slice(segmentIndex);

        // Calculate how many segments should be consumed by variable segments
        // The remaining patterns need to match the remaining segments
        // So variable segments = remainingSegments.length - remainingPatterns.length
        const variableCount =
          remainingSegments.length - remainingPatterns.length;
        if (variableCount >= 0) {
          // Extract variable segments (can be empty if variableCount is 0)
          const variableSegments = remainingSegments.slice(0, variableCount);
          // Store with the variable name (without ...)
          result[variableName] = variableSegments.join("/");
          // Continue matching from after variable segments
          segmentIndex += variableCount;
          patternIndex++;
          continue;
        }
      } else {
        // {...variableName} is the last pattern part
        // All remaining segments are variable segments
        const variableSegments = segments.slice(segmentIndex);
        result[variableName] = variableSegments.join("/");
        segmentIndex = segments.length;
        patternIndex++;
        continue;
      }
      return null;
    }

    // Handle regular variable patterns {variable}
    if (patternPart.startsWith("{") && patternPart.endsWith("}")) {
      const key = patternPart.slice(1, -1);
      // Skip colon syntax for now (e.g., {branch:branch-alias} is not used in source pattern)
      result[key] = segment;
      segmentIndex++;
      patternIndex++;
    } else if (patternPart === segment) {
      // Literal match
      segmentIndex++;
      patternIndex++;
    } else {
      // No match
      return null;
    }
  }

  // Handle case where {...variableName} is the last pattern part and there are no more segments
  // This allows {...variableName} at the end to match 0 segments
  if (patternIndex < patternParts.length && segmentIndex === segments.length) {
    const remainingPatternPart = patternParts[patternIndex];
    if (
      remainingPatternPart.startsWith("{...") &&
      remainingPatternPart.endsWith("}")
    ) {
      // This is a {...variableName} pattern at the end, allow it to match 0 segments
      const variableName = remainingPatternPart.slice(4, -1);
      result[variableName] = "";
      patternIndex++;
    }
  }

  // Check if we consumed all segments and patterns
  if (
    segmentIndex !== segments.length ||
    patternIndex !== patternParts.length
  ) {
    return null;
  }

  return result;
}

/**
 * Apply pattern to generate URL from variables
 * Supports variable references like {folders}, {prefix}, etc.
 * Empty variables (from {...variableName} matching 0 segments) are skipped
 * Supports alias syntax: {variable:alias-name} -> uses aliases['alias-name']
 */
export function applyPattern(
  pattern: string,
  variables: Record<string, string>,
  config?: {
    aliases?: {
      [aliasName: string]: {
        context?: Record<string, string[]>;
        mappings: any;
      };
    };
  }
): string {
  const parts = pattern
    .split("/")
    .filter((p) => p.length > 0)
    .filter((p) => !p.startsWith("/"));

  const result: string[] = [];
  for (const part of parts) {
    if (part.startsWith("{") && part.endsWith("}")) {
      const key = part.slice(1, -1);
      // Handle variable:alias-name syntax (e.g., {branch:branch-alias}, {repo:repo-alias})
      if (key.includes(":")) {
        const [varKey, aliasName] = key.split(":");
        const value = variables[varKey];

        if (value && config?.aliases?.[aliasName]) {
          // Try to get alias from config
          const aliasConfig = config.aliases[aliasName];

          // Check context conditions if specified
          let contextMatches = true;
          if (aliasConfig.context) {
            for (const [ctxVarName, allowedValues] of Object.entries(
              aliasConfig.context
            )) {
              const ctxValue = variables[ctxVarName];
              if (ctxValue && allowedValues) {
                if (!allowedValues.includes(ctxValue)) {
                  contextMatches = false;
                  break;
                }
              }
            }
          }

          if (contextMatches) {
            const alias = getAlias(aliasConfig.mappings, value);
            if (alias) {
              result.push(alias);
            } else if (value) {
              result.push(value);
            }
          } else if (value) {
            result.push(value);
          }
        } else if (value) {
          // Fallback to original value if alias not found
          result.push(value);
        }
      } else {
        const value = variables[key];
        // Only push if value exists and is not empty
        // Empty string means {...variableName} matched 0 segments, so skip it
        if (value && value.length > 0) {
          // If value contains "/", split and push each segment
          // This handles cases like folders: "folder1/folder2" -> ["folder1", "folder2"]
          if (value.includes("/")) {
            result.push(...value.split("/"));
          } else {
            result.push(value);
          }
        }
      }
    } else {
      result.push(part);
    }
  }

  return "/" + result.join("/");
}
