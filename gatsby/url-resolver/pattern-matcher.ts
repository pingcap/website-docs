/**
 * Pattern matching utilities for URL resolver
 */

/**
 * Match path segments against a pattern
 * Supports patterns with variable number of folders using {...folders} syntax
 * Variables are dynamically extracted from the pattern
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

    // Handle variable folders pattern {...folders} or {folders} or {...folder}
    if (
      patternPart === "{...folders}" ||
      patternPart === "{folders}" ||
      patternPart === "{...folder}"
    ) {
      // Find the next pattern part after {...folders}
      const nextPatternIndex = patternIndex + 1;
      if (nextPatternIndex < patternParts.length) {
        // We need to match the remaining patterns to the remaining segments
        // The folders should be everything between current position and where the next pattern matches
        const remainingPatterns = patternParts.slice(nextPatternIndex);
        const remainingSegments = segments.slice(segmentIndex);

        // Calculate how many segments should be consumed by folders
        // The remaining patterns need to match the remaining segments
        // So folders = remainingSegments.length - remainingPatterns.length
        const folderCount = remainingSegments.length - remainingPatterns.length;
        if (folderCount >= 0) {
          // Extract folders (can be empty if folderCount is 0)
          const folderSegments = remainingSegments.slice(0, folderCount);
          result["folders"] = folderSegments.join("/");
          // Continue matching from after folders
          segmentIndex += folderCount;
          patternIndex++;
          continue;
        }
      } else {
        // {...folders} is the last pattern part
        // All remaining segments except the last one are folders
        // But wait, if it's the last pattern, we shouldn't have more segments
        // Actually, this case shouldn't happen if pattern ends with {...folders}
        // Let's handle it: all remaining segments are folders
        const folderSegments = segments.slice(segmentIndex);
        result["folders"] = folderSegments.join("/");
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
 */
export function applyPattern(
  pattern: string,
  variables: Record<string, string>
): string {
  const parts = pattern
    .split("/")
    .filter((p) => p.length > 0)
    .filter((p) => !p.startsWith("/"));

  const result: string[] = [];
  for (const part of parts) {
    if (part.startsWith("{") && part.endsWith("}")) {
      const key = part.slice(1, -1);
      // Handle branch:alias syntax
      if (key.includes(":")) {
        const [varKey, aliasKey] = key.split(":");
        const value = variables[varKey];
        if (value && variables[aliasKey]) {
          result.push(variables[aliasKey]);
        } else if (value) {
          result.push(value);
        }
      } else {
        const value = variables[key];
        if (value) {
          result.push(value);
        }
      }
    } else {
      result.push(part);
    }
  }

  return "/" + result.join("/");
}
