/**
 * Alias matching utilities (generalized from branch alias)
 */

import type { AliasMapping, AliasPattern } from "./types";

/**
 * Convert wildcard pattern to regex
 * e.g., "release-*" -> /^release-(.+)$/
 */
function wildcardToRegex(pattern: string): RegExp {
  // Escape special regex characters except *
  const escaped = pattern.replace(/[.+?^${}()|[\]\\]/g, "\\$&");
  // Replace * with (.+?) to capture the matched part (non-greedy)
  const regexPattern = escaped.replace(/\*/g, "(.+?)");
  return new RegExp(`^${regexPattern}$`);
}

/**
 * Apply wildcard replacement
 * e.g., pattern: "release-*", replacement: "v*", input: "release-8.5" -> "v8.5"
 */
function applyWildcardReplacement(
  pattern: string,
  replacement: string,
  input: string
): string | null {
  const regex = wildcardToRegex(pattern);
  const match = input.match(regex);
  if (!match) {
    return null;
  }

  const replacementWildcardCount = (replacement.match(/\*/g) || []).length;

  // Replace * in replacement with captured groups
  let result = replacement;
  let replacementIndex = 0;
  for (
    let i = 1;
    i < match.length && replacementIndex < replacementWildcardCount;
    i++
  ) {
    // Replace the first * with the captured group
    result = result.replace("*", match[i]);
    replacementIndex++;
  }

  return result;
}

/**
 * Apply regex replacement
 * e.g., pattern: "release-(.*)", replacement: "v$1", input: "release-8.5" -> "v8.5"
 */
function applyRegexReplacement(
  pattern: string,
  replacement: string,
  input: string
): string | null {
  try {
    const regex = new RegExp(pattern);
    const match = input.match(regex);
    if (!match) {
      return null;
    }

    // Replace $1, $2, etc. with captured groups
    let result = replacement;
    for (let i = 1; i < match.length; i++) {
      result = result.replace(new RegExp(`\\$${i}`, "g"), match[i]);
    }

    return result;
  } catch (e) {
    // Invalid regex pattern
    return null;
  }
}

/**
 * Get alias for a given value
 * Supports both exact matches and pattern-based matches
 */
export function getAlias(
  aliasMappings: AliasMapping,
  value: string
): string | null {
  // First, try exact match
  const exactMatch = aliasMappings[value];
  if (typeof exactMatch === "string") {
    return exactMatch;
  }

  // Then, try pattern-based matches
  // Check each entry in aliasMappings
  for (const [key, mappingValue] of Object.entries(aliasMappings)) {
    // Skip if it's an exact match (already checked)
    if (key === value) {
      continue;
    }

    // Check if it's a pattern-based alias
    if (typeof mappingValue === "object" && mappingValue !== null) {
      const pattern = mappingValue as AliasPattern;
      if (pattern.pattern && pattern.replacement) {
        let result: string | null = null;
        if (pattern.useRegex) {
          result = applyRegexReplacement(
            pattern.pattern,
            pattern.replacement,
            value
          );
        } else {
          // Try wildcard matching
          result = applyWildcardReplacement(
            pattern.pattern,
            pattern.replacement,
            value
          );
        }
        if (result) {
          return result;
        }
      }
    } else if (typeof mappingValue === "string") {
      // Check if key is a wildcard pattern
      if (key.includes("*")) {
        const result = applyWildcardReplacement(key, mappingValue, value);
        if (result) {
          return result;
        }
      }
    }
  }

  return null;
}

/**
 * Check if context conditions are met
 */
function checkContext(
  context: Record<string, string[]> | undefined,
  variables: Record<string, string>
): boolean {
  if (!context) return true;

  for (const [varName, allowedValues] of Object.entries(context)) {
    const varValue = variables[varName];
    if (varValue && allowedValues) {
      if (!allowedValues.includes(varValue)) {
        return false;
      }
    }
  }

  return true;
}

/**
 * Get alias for a variable value using alias configuration
 * Supports context-based alias selection
 */
export function getVariableAlias(
  aliasName: string,
  variableValue: string,
  config: {
    aliases?: {
      [aliasName: string]: {
        context?: Record<string, string[]>;
        mappings: AliasMapping;
      };
    };
  },
  contextVariables: Record<string, string>
): string | null {
  if (!config.aliases || !config.aliases[aliasName]) {
    return null;
  }

  const aliasConfig = config.aliases[aliasName];

  // Check context conditions if specified
  if (!checkContext(aliasConfig.context, contextVariables)) {
    return null;
  }

  // Get alias from mappings
  return getAlias(aliasConfig.mappings, variableValue);
}
