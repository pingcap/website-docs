/**
 * Branch alias matching utilities
 */

import type { BranchAlias, BranchAliasPattern } from "./types";

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
 * Get branch alias for a given branch name
 * Supports both exact matches and pattern-based matches
 */
export function getBranchAlias(
  branchAliases: BranchAlias,
  branch: string
): string | null {
  // First, try exact match
  const exactMatch = branchAliases[branch];
  if (typeof exactMatch === "string") {
    return exactMatch;
  }

  // Then, try pattern-based matches
  // Check each entry in branchAliases
  for (const [key, value] of Object.entries(branchAliases)) {
    // Skip if it's an exact match (already checked)
    if (key === branch) {
      continue;
    }

    // Check if it's a pattern-based alias
    if (typeof value === "object" && value !== null) {
      const pattern = value as BranchAliasPattern;
      if (pattern.pattern && pattern.replacement) {
        let result: string | null = null;
        if (pattern.useRegex) {
          result = applyRegexReplacement(
            pattern.pattern,
            pattern.replacement,
            branch
          );
        } else {
          // Try wildcard matching
          result = applyWildcardReplacement(
            pattern.pattern,
            pattern.replacement,
            branch
          );
        }
        if (result) {
          return result;
        }
      }
    } else if (typeof value === "string") {
      // Check if key is a wildcard pattern
      if (key.includes("*")) {
        const result = applyWildcardReplacement(key, value, branch);
        if (result) {
          return result;
        }
      }
    }
  }

  return null;
}
