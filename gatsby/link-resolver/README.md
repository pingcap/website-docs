# Link Resolver

## Overview

The Link Resolver is a module that transforms internal markdown links within articles based on the current page's context. It provides context-aware link resolution, allowing relative links in markdown files to be automatically converted to correct absolute URLs.

## Purpose

The Link Resolver serves the following purposes:

1. **Context-Aware Resolution**: Resolves relative links based on the current page's URL, maintaining proper navigation structure
2. **Namespace Handling**: Handles special namespaces (`develop`, `best-practice`, `api`, `tidb-cloud`) with custom transformation rules
3. **Language Preservation**: Automatically preserves the current page's language in resolved links
4. **Path-Based Mapping**: Supports both direct link mappings and path-based mappings (where rules depend on the current page's path)
5. **Default Language Omission**: Optionally omits the default language prefix from resolved URLs

## Usage

### Basic Usage

```typescript
import { resolveMarkdownLink } from "../../gatsby/link-resolver";

// Resolve a link from a tidbcloud page
const resolved = resolveMarkdownLink(
  "/dedicated/getting-started",  // link path
  "/tidbcloud/dedicated"          // current page URL
);
// Result: "/tidbcloud/getting-started"

// Resolve a link from a develop namespace page
const resolved2 = resolveMarkdownLink(
  "/vector-search",
  "/develop/overview"
);
// Result: "/develop/vector-search"

// Resolve a link from a tidb page
const resolved3 = resolveMarkdownLink(
  "/upgrade/upgrade-tidb-using-tiup",
  "/tidb/stable/overview"
);
// Result: "/tidb/stable/upgrade-tidb-using-tiup"
```

### Usage in Gatsby

The Link Resolver is used in `gatsby/plugin/content/index.ts` during markdown processing:

```typescript
import { calculateFileUrl } from "../../url-resolver";
import { resolveMarkdownLink } from "../../link-resolver";

module.exports = function ({ markdownAST, markdownNode }) {
  // Get current page URL from file path
  const currentFileUrl = calculateFileUrl(markdownNode.fileAbsolutePath) || "";

  visit(markdownAST, (node: any) => {
    if (node.type === "link" && !node.url.startsWith("#")) {
      const ele = node as Link;

      if (ele.url.startsWith("http")) {
        // External links: keep as-is
        return externalLinkNode;
      } else {
        // Internal links: resolve using link-resolver
        const resolvedPath = resolveMarkdownLink(
          ele.url.replace(".md", ""),  // Remove .md extension
          currentFileUrl
        );

        return {
          type: "jsx",
          value: `<Link to="${resolvedPath}">`,
          // ... children
        };
      }
    }
  });
};
```

## Configuration

### Configuration Structure

The Link Resolver configuration is defined in `gatsby/link-resolver/config.ts`:

```typescript
export const defaultLinkResolverConfig: LinkResolverConfig = {
  defaultLanguage: "en",

  linkMappings: [
    // Direct link mapping (no pathPattern)
    {
      linkPattern: "/{namespace}/{...any}/{docname}",
      targetPattern: "/{curLang}/{namespace}/{docname}",
      conditions: {
        namespace: ["tidb-cloud", "develop", "best-practice", "api"],
      },
      namespaceTransform: {
        "tidb-cloud": "tidbcloud",
      },
    },

    // Path-based mapping (with pathPattern)
    {
      pathPattern: "/{lang}/tidbcloud/{...any}",
      linkPattern: "/{...any}/{docname}",
      targetPattern: "/{lang}/tidbcloud/{docname}",
    },
    // ... more rules
  ],
};
```

### Pattern Syntax

#### Variables

- `{curLang}` - Current page's language (extracted from current page URL)
- `{lang}` - Language from current page or link path
- `{repo}` - Repository name (e.g., `tidb`, `tidbcloud`)
- `{branch}` - Branch name (e.g., `stable`, `v8.5`)
- `{namespace}` - Namespace (e.g., `develop`, `best-practice`, `api`)
- `{docname}` - Document name (filename without extension)
- `{...any}` - Variable number of path segments

### Rule Types

#### 1. Direct Link Mapping

Direct link mappings match links directly without considering the current page path:

```typescript
{
  linkPattern: "/{namespace}/{...any}/{docname}",
  targetPattern: "/{curLang}/{namespace}/{docname}",
  conditions: {
    namespace: ["develop", "best-practice", "api"],
  },
}
```

**Example**:
- Link: `/develop/vector-search`
- Current Page: `/tidb/stable/overview` (any page)
- Result: `/develop/vector-search` (or `/en/develop/vector-search` if default language not omitted)

#### 2. Path-Based Mapping

Path-based mappings first match the current page path, then match the link path:

```typescript
{
  pathPattern: "/{lang}/tidbcloud/{...any}",
  linkPattern: "/{...any}/{docname}",
  targetPattern: "/{lang}/tidbcloud/{docname}",
}
```

**Example**:
- Current Page: `/tidbcloud/dedicated`
- Link: `/getting-started`
- Result: `/tidbcloud/getting-started`

**How it works**:
1. Match `pathPattern` against current page: `/{lang}/tidbcloud/{...any}` matches `/tidbcloud/dedicated`
   - Variables: `{ lang: "en" (default), ...any: ["dedicated"] }`
2. Match `linkPattern` against link: `/{...any}/{docname}` matches `/getting-started`
   - Variables: `{ ...any: [], docname: "getting-started" }`
3. Merge variables and apply `targetPattern`: `/{lang}/tidbcloud/{docname}`
   - Result: `/tidbcloud/getting-started`

### Conditions

#### `conditions`

Conditions are checked against link variables (for direct mappings) or merged variables (for path-based mappings):

```typescript
{
  linkPattern: "/{namespace}/{...any}/{docname}",
  targetPattern: "/{curLang}/{namespace}/{docname}",
  conditions: {
    namespace: ["develop", "best-practice", "api"],
  },
}
```

#### `pathConditions`

Path conditions are checked against variables extracted from the current page path (only for path-based mappings):

```typescript
{
  pathPattern: "/{lang}/{repo}/{branch}/{...any}",
  pathConditions: {
    repo: ["tidb", "tidb-in-kubernetes"],
  },
  linkPattern: "/{...any}/{docname}",
  targetPattern: "/{lang}/{repo}/{branch}/{docname}",
}
```

### Namespace Transformation

Transform namespace values during resolution:

```typescript
{
  linkPattern: "/{namespace}/{...any}/{docname}",
  targetPattern: "/{curLang}/{namespace}/{docname}",
  namespaceTransform: {
    "tidb-cloud": "tidbcloud",
  },
}
```

**Example**:
- Link: `/tidb-cloud/releases/_index`
- Result: `/tidbcloud/releases/_index` (namespace transformed)

## API Reference

### `resolveMarkdownLink(linkPath, currentPageUrl)`

Resolves a markdown link path based on the current page URL.

**Parameters**:
- `linkPath`: The markdown link path to resolve (e.g., `"/develop/vector-search"` or `"develop/vector-search"`)
- `currentPageUrl`: The current page URL for context-based resolution (e.g., `"/tidb/stable/overview"`)

**Returns**: `string | null` - The resolved URL or the original link path if no rule matches

**Behavior**:
- Returns external links (`http://`, `https://`) as-is
- Returns anchor links (`#section`) as-is
- Returns empty links as-is
- Normalizes link paths (adds leading slash if missing)
- Processes rules in order (first match wins)
- Caches results for performance

### `clearLinkResolverCache()`

Clears all caches (useful for testing or when configuration changes).

## How It Works

1. **Early Exit**: External links, anchor links, and empty links are returned as-is.

2. **Path Normalization**: Link paths are normalized (leading slash added if missing).

3. **Rule Processing**: Rules are processed in order:
   - **Direct Link Mapping**: Match `linkPattern` against link path
   - **Path-Based Mapping**:
     - First match `pathPattern` against current page path
     - Check `pathConditions` if specified
     - Then match `linkPattern` against link path
     - Merge variables from both matches

4. **Variable Extraction**: Variables are extracted from matched patterns.

5. **Condition Checking**: Conditions are checked against extracted variables.

6. **Namespace Transformation**: If `namespaceTransform` is specified, transform namespace values.

7. **curLang Injection**: The current page's language (`curLang`) is automatically extracted and added to variables.

8. **URL Construction**: The target URL is built by applying the target pattern with variables.

9. **Post-processing**:
   - Default language omission (if `defaultLanguage` is set)
   - Trailing slash removal (if `trailingSlash: "never"`)

10. **Fallback**: If no rule matches, return the original link path.

## Examples

### Example 1: Namespace Link from Any Page

```typescript
// Link: "/develop/vector-search"
// Current Page: "/tidb/stable/overview" (any page)
// Rule: Direct link mapping
//   linkPattern: "/{namespace}/{...any}/{docname}"
//   Matches: namespace="develop", docname="vector-search"
//   targetPattern: "/{curLang}/{namespace}/{docname}"
//   curLang extracted from current page: "en" (default)
// Result: "/develop/vector-search" (default language omitted)
```

### Example 2: TiDBCloud Page Link

```typescript
// Current Page: "/tidbcloud/dedicated"
// Link: "/getting-started"
// Rule: Path-based mapping
//   pathPattern: "/{lang}/tidbcloud/{...any}"
//     Matches current page: lang="en" (default), ...any=["dedicated"]
//   linkPattern: "/{...any}/{docname}"
//     Matches link: ...any=[], docname="getting-started"
//   targetPattern: "/{lang}/tidbcloud/{docname}"
// Result: "/tidbcloud/getting-started"
```

### Example 3: TiDB Page with Branch

```typescript
// Current Page: "/tidb/stable/upgrade"
// Link: "/upgrade-tidb-using-tiup"
// Rule: Path-based mapping
//   pathPattern: "/{lang}/{repo}/{branch}/{...any}"
//     pathConditions: repo=["tidb", "tidb-in-kubernetes"]
//     Matches current page: lang="en", repo="tidb", branch="stable", ...any=["upgrade"]
//   linkPattern: "/{...any}/{docname}"
//     Matches link: ...any=[], docname="upgrade-tidb-using-tiup"
//   targetPattern: "/{lang}/{repo}/{branch}/{docname}"
// Result: "/tidb/stable/upgrade-tidb-using-tiup"
```

### Example 4: Namespace Transformation

```typescript
// Link: "/tidb-cloud/releases/_index"
// Current Page: "/tidb/stable/overview" (any page)
// Rule: Direct link mapping with namespace transform
//   linkPattern: "/{namespace}/{...any}/{docname}"
//     Matches: namespace="tidb-cloud", docname="_index"
//   namespaceTransform: "tidb-cloud" -> "tidbcloud"
//   targetPattern: "/{curLang}/{namespace}/{docname}"
// Result: "/tidbcloud/releases/_index"
```

### Example 5: Hash Preservation

```typescript
// Link: "/develop/vector-search#data-types"
// Current Page: "/tidb/stable/overview"
// Rule: Direct link mapping
//   Hash is preserved automatically
// Result: "/develop/vector-search#data-types"
```

## Common Patterns

### Pattern 1: Namespace Links

Links starting with `develop`, `best-practice`, `api`, or `tidb-cloud` are resolved to namespace URLs:

```markdown
<!-- In any markdown file -->
[Vector Search](/develop/vector-search)
<!-- Resolves to: /develop/vector-search -->
```

### Pattern 2: Relative Links from TiDBCloud Pages

Relative links from TiDBCloud pages are resolved to TiDBCloud URLs:

```markdown
<!-- In /tidbcloud/dedicated page -->
[Getting Started](/getting-started)
<!-- Resolves to: /tidbcloud/getting-started -->
```

### Pattern 3: Relative Links from TiDB Pages

Relative links from TiDB pages preserve the branch:

```markdown
<!-- In /tidb/stable/upgrade page -->
[Upgrade Guide](/upgrade-tidb-using-tiup)
<!-- Resolves to: /tidb/stable/upgrade-tidb-using-tiup -->
```

### Pattern 4: Releases Links

Special handling for releases index pages:

```markdown
<!-- In any page -->
[TiDB Releases](/releases/_index)
<!-- Resolves to: /releases/tidb-self-managed -->

[TiDB Cloud Releases](/tidb-cloud/releases/_index)
<!-- Resolves to: /releases/tidb-cloud -->
```

## Best Practices

1. **Rule Order**: Place more specific rules before general ones, as the first match wins.

2. **Path Conditions**: Use `pathConditions` to narrow down when path-based rules should apply.

3. **curLang Variable**: Always use `{curLang}` in target patterns to preserve the current page's language.

4. **Namespace Transforms**: Use `namespaceTransform` to handle namespace name differences (e.g., `tidb-cloud` vs `tidbcloud`).

5. **Hash Preservation**: The resolver automatically preserves hash fragments (`#section`) in links.

6. **Testing**: Test link resolution from various page contexts to ensure correct behavior.

## Troubleshooting

### Link Not Resolved

- Check if the link matches any `linkPattern` in the configuration
- For path-based mappings, verify the current page matches the `pathPattern`
- Check if conditions are correctly specified
- Ensure the link path format is correct (with or without leading slash)

### Wrong URL Generated

- Check rule order - earlier rules take precedence
- Verify path conditions are correctly specified
- Check if namespace transforms are applied correctly
- Ensure `curLang` is being extracted correctly from the current page

### Language Not Preserved

- Ensure `{curLang}` is used in the target pattern
- Verify the current page URL has a language prefix (or defaults to configured default language)

### Hash Fragment Lost

- Hash fragments are automatically preserved - if lost, check if the link is being processed elsewhere
