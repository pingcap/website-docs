# URL Resolver

## Overview

The URL Resolver is a core module that maps source file paths to published URLs during the Gatsby build process. It provides a flexible, pattern-based configuration system for transforming file paths into clean, SEO-friendly URLs.

## Purpose

The URL Resolver serves the following purposes:

1. **Path Transformation**: Converts source file paths (e.g., `/docs/markdown-pages/en/tidb/master/alert-rules.md`) into published URLs (e.g., `/tidb/dev/alert-rules`)
2. **Branch Aliasing**: Maps internal branch names (e.g., `master`, `release-8.5`) to display versions (e.g., `dev`, `v8.5`)
3. **Namespace Handling**: Handles special namespaces like `developer` (source folder `develop`), `best-practices`, `api`, and `releases` with custom URL structures
4. **Default Language Omission**: Optionally omits the default language prefix (e.g., `/en/`) from URLs
5. **Trailing Slash Control**: Configures trailing slash behavior (`always`, `never`, or `auto`)

## Usage

### Basic Usage

```typescript
import { calculateFileUrl } from "../../gatsby/url-resolver";

// Calculate URL from absolute file path
const url = calculateFileUrl(
  "/path/to/docs/markdown-pages/en/tidb/master/alert-rules.md",
  true // omitDefaultLanguage: omit /en/ prefix for default language
);
// Result: "/tidb/dev/alert-rules"

// Calculate URL from slug format (relative path)
const url2 = calculateFileUrl("en/tidb/master/alert-rules", true);
// Result: "/tidb/dev/alert-rules"
```

### Usage in Gatsby

The URL Resolver is used in `gatsby/create-pages/create-docs.ts` to generate page URLs:

```typescript
import { calculateFileUrl } from "../../gatsby/url-resolver";

nodes.forEach((node) => {
  // node.slug is in format: "en/tidb/master/alert-rules"
  const path = calculateFileUrl(node.slug, true);

  if (!path) {
    console.info(`Failed to calculate URL for ${node.slug}`);
    return;
  }

  createPage({
    path,
    component: template,
    context: { /* ... */ },
  });
});
```

## Configuration

### Configuration Structure

The URL Resolver configuration is defined in `gatsby/url-resolver/config.ts`:

```typescript
export const defaultUrlResolverConfig: UrlResolverConfig = {
  sourceBasePath: path.resolve(__dirname, "../../docs/markdown-pages"),
  defaultLanguage: "en",
  trailingSlash: "never",

  pathMappings: [
    // Rules are evaluated in order, first match wins
    {
      sourcePattern: "/{lang}/tidb/{branch}/{...folders}/{filename}",
      targetPattern: "/{lang}/tidb/{branch:branch-alias-tidb}/{filename}",
      filenameTransform: {
        ignoreIf: ["_index", "_docHome"],
      },
    },
    // ... more rules
  ],

  aliases: {
    "branch-alias-tidb": {
      mappings: {
        master: "dev",
        "release-*": "v*", // Wildcard pattern
      },
    },
  },
};
```

### Pattern Syntax

#### Variables

- `{lang}` - Language code (e.g., `en`, `zh`, `ja`)
- `{repo}` - Repository name (e.g., `tidb`, `tidbcloud`, `tidb-in-kubernetes`)
- `{branch}` - Branch name (e.g., `master`, `release-8.5`)
- `{filename}` - File name without extension (e.g., `alert-rules`, `_index`)
- `{...folders}` - Variable number of folder segments (captures all remaining segments)
- `{namespace}` - Namespace (e.g., `developer`, `best-practices`, `api`)

#### Alias Syntax

Use `{variable:alias-name}` in target patterns to apply aliases:

```typescript
// In targetPattern: "{branch:branch-alias-tidb}"
// This applies the "branch-alias-tidb" alias to the branch variable
```

#### Filename Transform

```typescript
filenameTransform: {
  // Ignore filename in target URL if it matches any value
  ignoreIf: ["_index", "_docHome"],

  // Use alternative target pattern when filename matches
  conditionalTarget: {
    keepIf: ["_index"],
    keepTargetPattern: "/{lang}/{namespace}/{folders}",
  },
}
```

### Example Rules

#### 1. TiDBCloud Dedicated Index

```typescript
{
  sourcePattern: "/{lang}/tidbcloud/master/tidb-cloud/dedicated/{filename}",
  targetPattern: "/{lang}/tidbcloud",
  conditions: { filename: ["_index"] },
}
```

**Result**:
- Source: `/en/tidbcloud/master/tidb-cloud/dedicated/_index.md`
- Target: `/en/tidbcloud` (or `/tidbcloud` if default language is omitted)

#### 2. Developer Namespace with Folders (Source: `develop`)

```typescript
{
  sourcePattern: "/{lang}/tidb/{branch}/{folder}/{...folders}/{filename}",
  targetPattern: "/{lang}/developer/{filename}",
  conditions: { folder: ["develop"] },
  filenameTransform: {
    ignoreIf: ["_index"],
    conditionalTarget: {
      keepIf: ["_index"],
      keepTargetPattern: "/{lang}/developer/{folders}",
    },
  },
}
```

**Result**:
- Source: `/en/tidb/master/develop/subfolder/_index.md`
- Target: `/en/developer/subfolder`
- Source: `/en/tidb/master/develop/subfolder/page.md`
- Target: `/en/developer/page`

#### 3. Branch Aliasing

```typescript
{
  sourcePattern: "/{lang}/tidb/{branch}/{...folders}/{filename}",
  targetPattern: "/{lang}/tidb/{branch:branch-alias-tidb}/{filename}",
  filenameTransform: {
    ignoreIf: ["_index", "_docHome"],
  },
}
```

With alias configuration:
```typescript
aliases: {
  "branch-alias-tidb": {
    mappings: {
      master: "dev",
      "release-*": "v*", // release-8.5 -> v8.5
    },
  },
}
```

**Result**:
- Source: `/en/tidb/master/alert-rules.md`
- Target: `/en/tidb/dev/alert-rules`
- Source: `/en/tidb/release-8.5/alert-rules.md`
- Target: `/en/tidb/v8.5/alert-rules`

## API Reference

### `parseSourcePath(absolutePath, sourceBasePath)`

Parses a source file path into segments and filename.

**Parameters**:
- `absolutePath`: Absolute path to source file or slug format (e.g., `"en/tidb/master/alert-rules"`)
- `sourceBasePath`: Base path for source files

**Returns**: `ParsedSourcePath | null`

```typescript
interface ParsedSourcePath {
  segments: string[]; // ["en", "tidb", "master", "alert-rules.md"]
  filename: string;   // "alert-rules"
}
```

### `calculateFileUrl(absolutePath, omitDefaultLanguage?)`

Calculates the published URL for a source file path.

**Parameters**:
- `absolutePath`: Absolute path to source file or slug format
- `omitDefaultLanguage`: Whether to omit default language prefix (default: `false`)

**Returns**: `string | null` - The resolved URL or `null` if no rule matches

### `calculateFileUrlWithConfig(absolutePath, config, omitDefaultLanguage?)`

Internal implementation that accepts a custom configuration object.

### `clearUrlResolverCache()`

Clears all caches (useful for testing or when configuration changes).

## How It Works

1. **Parse Source Path**: The resolver first parses the input path (absolute or slug format) into segments and filename.

2. **Pattern Matching**: It iterates through `pathMappings` rules in order, trying to match the `sourcePattern` against the parsed segments.

3. **Variable Extraction**: When a pattern matches, variables are extracted (e.g., `lang`, `repo`, `branch`, `filename`).

4. **Condition Checking**: If the rule has `conditions`, they are checked against the extracted variables.

5. **Filename Transform**: If `filenameTransform` is specified, the filename may be ignored or an alternative target pattern may be used.

6. **Alias Application**: If the target pattern contains alias syntax (e.g., `{branch:branch-alias-tidb}`), the alias is applied.

7. **URL Construction**: The target URL is built by applying the target pattern with the variables.

8. **Post-processing**:
   - Default language omission (if `omitDefaultLanguage` is `true`)
   - Trailing slash handling (based on `trailingSlash` config)

9. **Fallback**: If no rule matches, a default fallback rule is used.

## Examples

### Example 1: Basic TiDB Page

```typescript
// Input: "en/tidb/master/alert-rules.md"
// Rule matches: /{lang}/tidb/{branch}/{...folders}/{filename}
// Variables: { lang: "en", repo: "tidb", branch: "master", filename: "alert-rules" }
// Alias applied: master -> dev (via branch-alias-tidb)
// Target: /{lang}/tidb/{branch}/{filename} = /en/tidb/dev/alert-rules
// omitDefaultLanguage=true: /tidb/dev/alert-rules
```

### Example 2: Developer Namespace Index (Source: `develop`)

```typescript
// Input: "en/tidb/release-8.5/develop/subfolder/_index.md"
// Rule matches: /{lang}/tidb/{branch}/{folder}/{...folders}/{filename}
//   with condition: folder = "develop"
// Variables: { lang: "en", repo: "tidb", branch: "release-8.5", folder: "develop", folders: ["subfolder"], filename: "_index" }
// Filename transform: _index matches keepIf, use keepTargetPattern
// Target: /{lang}/developer/{folders} = /en/developer/subfolder
// omitDefaultLanguage=true: /developer/subfolder
```

### Example 3: TiDBCloud with Prefix

```typescript
// Input: "en/tidbcloud/master/tidb-cloud/dedicated/starter/_index.md"
// Rule matches: /{lang}/tidbcloud/{branch}/tidb-cloud/{...prefixes}/{filename}
// Variables: { lang: "en", repo: "tidbcloud", branch: "master", prefixes: ["dedicated", "starter"], filename: "_index" }
// Filename transform: _index matches keepIf, use keepTargetPattern
// Target: /{lang}/tidbcloud/{prefixes} = /en/tidbcloud/dedicated/starter
// omitDefaultLanguage=true: /tidbcloud/dedicated/starter
```

## Best Practices

1. **Rule Order**: Place more specific rules before general ones, as the first match wins.

2. **Conditions**: Use conditions to narrow down when a rule should apply, avoiding conflicts.

3. **Filename Transforms**: Use `filenameTransform` to handle special cases like `_index` files.

4. **Aliases**: Use aliases for branch name transformations to keep rules clean and maintainable.

5. **Testing**: Always test URL resolution with various input formats (absolute paths, slugs, with/without extensions).

6. **Cache Clearing**: Clear caches when configuration changes during development.

## Troubleshooting

### URL is `null`

- Check if the source path matches any `sourcePattern` in the configuration
- Verify the path format (absolute path or valid slug format)
- Ensure the path has at least 2 segments (lang + filename or more)

### Wrong URL Generated

- Check rule order - earlier rules take precedence
- Verify conditions are correctly specified
- Check if filename transforms are applied correctly
- Ensure aliases are properly configured

### Default Language Not Omitted

- Ensure `omitDefaultLanguage` parameter is set to `true`
- Verify `defaultLanguage` is set in configuration
- Check that the URL starts with `/{defaultLanguage}/`
