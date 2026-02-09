# URL Mapping Architecture

## Overview

This document describes how the project handles URL mapping across three key areas:
1. **Page URL Mapping**: Converting source file paths to published page URLs during build
2. **TOC Mapping**: Resolving links in TOC (Table of Contents) files
3. **Article Link Mapping**: Transforming internal links within markdown articles

The system uses two core resolvers (`url-resolver` and `link-resolver`) that work together to provide a consistent, maintainable URL structure throughout the documentation site.

## Architecture Flow

### 1. Page URL Mapping (Build Time)

**Location**: `gatsby/create-pages/create-docs.ts`

**Process**:
1. Gatsby queries all MDX files from the GraphQL data layer
2. For each file, `calculateFileUrl()` from `url-resolver` converts the source path to a published URL
3. `getTOCNamespace()` from `toc-namespace` determines the page's TOC namespace for navigation/context
4. The resolved URL is used to create the Gatsby page with `createPage()`

**Example**:
```typescript
// Source file: docs/markdown-pages/en/tidb/master/alert-rules.md
// Slug: "en/tidb/master/alert-rules"
const path = calculateFileUrl(node.slug, true);
// Result: "/tidb/dev/alert-rules"
// Creates page at: /tidb/dev/alert-rules
```

**Key Points**:
- Uses `url-resolver` to transform source paths to URLs
- Default language (`en`) is omitted from URLs (`omitDefaultLanguage: true`)
- Only files referenced in TOC files are built (filtered by `filterNodesByToc`)

### 2. TOC Mapping (Build Time)

**Location**: `gatsby/toc.ts` and `gatsby/toc-filter.ts`

**Process**:
1. Gatsby queries all TOC files (files matching `/TOC.*md$/`)
2. For each TOC file, `mdxAstToToc()` parses the markdown AST
3. Links within TOC are resolved using `resolveMarkdownLink()` from `link-resolver`
4. The resolved TOC structure is used to:
   - Determine which files should be built (`getFilesFromTocs`)
   - Generate navigation menus for pages

**Example**:
```typescript
// TOC file: docs/markdown-pages/en/tidb/stable/TOC.md
// Contains link: [Getting Started](/develop/getting-started)
// TOC path: "/en/tidb/stable" (resolved from TOC file slug)
const resolvedLink = resolveMarkdownLink("/develop/getting-started", "/en/tidb/stable");
// Result: "/developer/getting-started"
// Used in navigation menu
```

**Key Points**:
- Uses `link-resolver` to resolve links in TOC files
- TOC links are resolved relative to the TOC file's own URL
- Resolved links are used to build a whitelist of files to include in the build

### 3. Article Link Mapping (Build Time)

**Location**: `gatsby/plugin/content/index.ts`

**Process**:
1. During markdown processing, Gatsby's MDX plugin processes each article
2. For each link in the markdown AST, `resolveMarkdownLink()` resolves the link path
3. The resolved link is converted to a Gatsby `<Link>` component
4. External links (`http://`, `https://`) are kept as-is with `target="_blank"`

**Example**:
```typescript
// Article: docs/markdown-pages/en/tidb/stable/overview.md
// Contains link: [Upgrade Guide](/upgrade/upgrade-tidb-using-tiup)
// Current page URL: "/tidb/stable/overview" (resolved from file path)
const resolvedPath = resolveMarkdownLink(
  "/upgrade/upgrade-tidb-using-tiup",
  "/tidb/stable/overview"
);
// Result: "/tidb/stable/upgrade-tidb-using-tiup"
// Rendered as: <Link to="/tidb/stable/upgrade-tidb-using-tiup">Upgrade Guide</Link>
```

**Key Points**:
- Uses `link-resolver` to resolve links based on current page context
- Links are resolved relative to the current article's URL
- Hash fragments (`#section`) are preserved automatically

## How They Connect

### Build Process Flow

```
1. GraphQL Query
   └─> Query all MDX files (including TOC files)

2. TOC Processing (toc-filter.ts)
   ├─> Parse TOC files
   ├─> Resolve TOC links (link-resolver)
   └─> Build file whitelist (locale/repo/version -> Set<filenames>)

3. Page Creation (create-docs.ts)
   ├─> Filter files by TOC whitelist
   ├─> Resolve page URLs (url-resolver)
   ├─> Determine namespace (toc-namespace/getTOCNamespace)
   └─> Create Gatsby pages

4. Content Processing (plugin/content/index.ts)
   ├─> Process markdown AST
   ├─> Resolve article links (link-resolver)
   └─> Convert to JSX components
```

### Data Flow

```
Source File Path
    ↓
[url-resolver] → Published Page URL
    ↓
Page Context (pageUrl, namespace, etc.)
    ↓
[link-resolver] → Resolved Links (in TOC and articles)
    ↓
Final HTML/JSX
```

### Example: Complete Flow

**Scenario**: Building a TiDB article with links

1. **Source File**: `docs/markdown-pages/en/tidb/master/alert-rules.md`
   - Contains link: `[Vector Search](/develop/vector-search)`

2. **Page URL Resolution** (`create-docs.ts`):
   ```typescript
   const pageUrl = calculateFileUrl("en/tidb/master/alert-rules", true);
   // Result: "/tidb/dev/alert-rules"
   ```

3. **TOC Processing** (`toc-filter.ts`):
   - TOC file: `en/tidb/stable/TOC.md`
   - Contains link to `alert-rules`
   - Link resolved: `/tidb/dev/alert-rules`
   - File added to whitelist: `en/tidb/stable -> Set(["alert-rules"])`

4. **Page Creation** (`create-docs.ts`):
   - File matches TOC whitelist → page is created
   - Page URL: `/tidb/dev/alert-rules`
   - Namespace: `TOCNamespace.TiDB`

5. **Content Processing** (`plugin/content/index.ts`):
   - Current page URL: `/en/tidb/dev/alert-rules`
   - Link `/develop/vector-search` resolved:
     ```typescript
     resolveMarkdownLink("/develop/vector-search", "/en/tidb/dev/alert-rules")
     // Result: "/developer/vector-search"
     ```
   - Rendered as: `<Link to="/developer/vector-search">Vector Search</Link>`

## Configuration Rules

The following sections describe the effects of each configuration rule in order of evaluation.

---

## URL Resolver Configuration Rules

Rules are evaluated in order; the first matching rule wins.

### Rule 1: TiDBCloud Dedicated Index

**Effect**: Maps TiDBCloud dedicated `_index.md` files to the TiDBCloud root URL.

**Source Pattern**: `/{lang}/tidbcloud/master/tidb-cloud/dedicated/{filename}`

**Target Pattern**: `/{lang}/tidbcloud`

**Conditions**: `filename = "_index"`

**Example**:
- Source: `en/tidbcloud/master/tidb-cloud/dedicated/_index.md`
- Target: `/tidbcloud` (or `/en/tidbcloud` if default language not omitted)

**Use Case**: The dedicated plan index page is served at the TiDBCloud root.

---

### Rule 2: TiDBCloud Releases Index

**Effect**: Maps TiDBCloud releases `_index.md` to the releases namespace.

**Source Pattern**: `/{lang}/tidbcloud/master/tidb-cloud/releases/{filename}`

**Target Pattern**: `/{lang}/releases/tidb-cloud`

**Conditions**: `filename = "_index"`

**Example**:
- Source: `en/tidbcloud/master/tidb-cloud/releases/_index.md`
- Target: `/releases/tidb-cloud`

**Use Case**: TiDBCloud releases are grouped under the shared releases namespace.

---

### Rule 3: TiDB Releases Index

**Effect**: Maps TiDB stable branch releases `_index.md` to the releases namespace.

**Source Pattern**: `/{lang}/tidb/{stable}/releases/{filename}`

**Target Pattern**: `/{lang}/releases/tidb-self-managed`

**Conditions**: `filename = "_index"`

**Example**:
- Source: `en/tidb/release-8.5/releases/_index.md`
- Target: `/releases/tidb-self-managed`

**Use Case**: TiDB releases are grouped under the shared releases namespace.

---

### Rule 4: TiDB-in-Kubernetes Releases Index

**Effect**: Maps TiDB-in-Kubernetes releases `_index.md` to the releases namespace.

**Source Pattern**: `/{lang}/tidb-in-kubernetes/main/releases/{filename}`

**Target Pattern**: `/{lang}/releases/tidb-operator`

**Conditions**: `filename = "_index"`

**Example**:
- Source: `en/tidb-in-kubernetes/main/releases/_index.md`
- Target: `/releases/tidb-operator`

**Use Case**: TiDB-in-Kubernetes releases are grouped under the shared releases namespace.

---

### Rule 5: TiDBCloud with Prefix

**Effect**: Maps TiDBCloud pages with prefixes (dedicated, starter, essential) to TiDBCloud URLs.

**Source Pattern**: `/{lang}/tidbcloud/{branch}/tidb-cloud/{...prefixes}/{filename}`

**Target Pattern**:
- For `_index`: `/{lang}/tidbcloud/{prefixes}` (keeps prefixes)
- For other files: `/{lang}/tidbcloud/{filename}` (removes prefixes)

**Filename Transform**:
- `ignoreIf: ["_index"]` - Filename removed from URL for non-index files
- `conditionalTarget.keepIf: ["_index"]` - Uses alternative pattern for `_index` files

**Example**:
- Source: `en/tidbcloud/master/tidb-cloud/dedicated/starter/_index.md`
- Target: `/tidbcloud/dedicated/starter`
- Source: `en/tidbcloud/master/tidb-cloud/dedicated/starter/getting-started.md`
- Target: `/tidbcloud/getting-started`

**Use Case**: TiDBCloud has multiple plan types (dedicated, starter, essential) with different URL structures.

---

### Rule 6: Developer/Best-Practices/API/AI Namespace

**Effect**: Maps TiDB pages in `develop` (published as `developer`), `best-practices`, `api`, or `ai` folders to namespace URLs.

**Source Pattern**: `/{lang}/tidb/{stable}/{folder}/{...folders}/{filename}`

**Target Pattern**:
- For `develop` folder:
  - `_index`: `/{lang}/developer/{folders}` (keeps folder structure)
  - Other files: `/{lang}/developer/{filename}` (removes folder structure)
- For `best-practices`, `api`, and `ai` folders:
  - `_index`: `/{lang}/{folder}/{folders}` (keeps folder structure)
  - Other files: `/{lang}/{folder}/{filename}` (removes folder structure)

**Conditions**:
- `folder = ["develop"]` → published under `/developer`
- `folder = ["best-practices", "api", "ai"]` → published under `/{folder}`

**Filename Transform**:
- `ignoreIf: ["_index"]` - Filename removed from URL for non-index files
- `conditionalTarget.keepIf: ["_index"]` - Uses alternative pattern for `_index` files

**Example**:
- Source: `en/tidb/release-8.5/develop/subfolder/_index.md`
- Target: `/developer/subfolder`
- Source: `en/tidb/release-8.5/develop/subfolder/vector-search.md`
- Target: `/developer/vector-search`
- Source: `en/tidb/release-8.5/ai/overview.md`
- Target: `/ai/overview`

**Use Case**: These namespaces are shared across all TiDB versions, so folder structure is flattened for non-index files.

---

### Rule 7: TiDB with Branch Alias

**Effect**: Maps TiDB pages with branch aliasing (master → dev, release-* → v*).

**Source Pattern**: `/{lang}/tidb/{branch}/{...folders}/{filename}`

**Target Pattern**: `/{lang}/tidb/{branch:branch-alias-tidb}/{filename}`

**Filename Transform**: `ignoreIf: ["_index", "_docHome"]`

**Alias Mapping** (`branch-alias-tidb`):
- `master` → `dev`
- `{stable}` → `stable` (exact match)
- `release-*` → `v*` (wildcard pattern)

**Example**:
- Source: `en/tidb/master/alert-rules.md`
- Target: `/tidb/dev/alert-rules`
- Source: `en/tidb/release-8.5/alert-rules.md`
- Target: `/tidb/v8.5/alert-rules`

**Use Case**: Branch names are transformed to user-friendly version identifiers.

---

### Rule 8: TiDB-in-Kubernetes with Branch Alias

**Effect**: Maps TiDB-in-Kubernetes pages with branch aliasing (main → dev, release-* → v*).

**Source Pattern**: `/{lang}/tidb-in-kubernetes/{branch}/{...folders}/{filename}`

**Target Pattern**: `/{lang}/tidb-in-kubernetes/{branch:branch-alias-tidb-in-kubernetes}/{filename}`

**Filename Transform**: `ignoreIf: ["_index", "_docHome"]`

**Alias Mapping** (`branch-alias-tidb-in-kubernetes`):
- `main` → `dev`
- `{stable}` → `stable` (exact match)
- `release-*` → `v*` (wildcard pattern)

**Example**:
- Source: `en/tidb-in-kubernetes/main/deploy/deploy-tidb-on-kubernetes.md`
- Target: `/tidb-in-kubernetes/dev/deploy-tidb-on-kubernetes`
- Source: `en/tidb-in-kubernetes/release-1.6/deploy/deploy-tidb-on-kubernetes.md`
- Target: `/tidb-in-kubernetes/v1.6/deploy-tidb-on-kubernetes`

**Use Case**: Branch names are transformed to user-friendly version identifiers.

---

### Rule 9: Fallback Rule

**Effect**: Generic fallback for any remaining paths.

**Source Pattern**: `/{lang}/{repo}/{...any}/{filename}`

**Target Pattern**: `/{lang}/{repo}/{filename}`

**Filename Transform**: `ignoreIf: ["_index", "_docHome"]`

**Example**:
- Source: `en/dm/release-5.3/migration/migrate-data.md`
- Target: `/en/dm/migrate-data`

**Use Case**: Catches any paths that don't match previous rules.

---

## Link Resolver Configuration Rules

Rules are evaluated in order; the first matching rule wins.

### Rule 1: Releases Index Links

**Effect**: Resolves `/releases/_index` links to TiDB self-managed releases page.

**Link Pattern**: `/releases/_index`

**Target Pattern**: `/{curLang}/releases/tidb-self-managed`

**Example**:
- Link: `/releases/_index`
- Current Page: Any page
- Result: `/releases/tidb-self-managed` (or `/en/releases/tidb-self-managed` if default language not omitted)

**Use Case**: Direct links to TiDB releases page.

---

### Rule 2: TiDB Cloud Releases Index Links

**Effect**: Resolves `/tidb-cloud/releases/_index` links to TiDB Cloud releases page.

**Link Pattern**: `/tidb-cloud/releases/_index`

**Target Pattern**: `/{curLang}/releases/tidb-cloud`

**Example**:
- Link: `/tidb-cloud/releases/_index`
- Current Page: Any page
- Result: `/releases/tidb-cloud`

**Use Case**: Direct links to TiDB Cloud releases page.

---

### Rule 3: TiDB-in-Kubernetes Releases Index Links (Path-Based)

**Effect**: Resolves `/tidb-in-kubernetes/releases/_index` links from TiDB-in-Kubernetes pages.

**Path Pattern**: `/{lang}/tidb-in-kubernetes/{branch}/{...any}`

**Link Pattern**: `/tidb-in-kubernetes/releases/_index`

**Target Pattern**: `/{curLang}/releases/tidb-operator`

**Example**:
- Current Page: `/tidb-in-kubernetes/stable/deploy`
- Link: `/tidb-in-kubernetes/releases/_index`
- Result: `/releases/tidb-operator`

**Use Case**: Links to TiDB-in-Kubernetes releases from operator pages.

---

### Rule 4: Links from TiDB Releases Landing Page (Path-Based)

**Effect**: Resolves `/releases/*` links from the releases landing page to TiDB stable branch URLs.

**Path Pattern**: `/{lang}/releases/tidb-self-managed/{...any}`

**Link Pattern**: `/releases/{docname}`

**Target Pattern**: `/{lang}/tidb/stable/{docname}`

**Example**:
- Current Page: `/releases/tidb-self-managed`
- Link: `/releases/release-8.5.4`
- Result: `/tidb/stable/release-8.5.4` (or `/en/tidb/stable/release-8.5.4` if default language not omitted)

**Use Case**: The releases landing page uses `/releases/*` links, but the actual release notes pages are published under `/tidb/stable/*`.

---

### Rule 5: Links from TiDB Operator Releases Landing Page (Path-Based)

**Effect**: Resolves relative links from the operator releases landing page to TiDB-in-Kubernetes `dev` branch URLs.

**Path Pattern**: `/{lang}/releases/tidb-operator/{...any}`

**Link Pattern**: `/{docname}`

**Target Pattern**: `/{lang}/tidb-in-kubernetes/dev/{docname}`

**Example**:
- Current Page: `/releases/tidb-operator`
- Link: `release-2.0.0`
- Result: `/tidb-in-kubernetes/dev/release-2.0.0` (or `/en/tidb-in-kubernetes/dev/release-2.0.0` if default language not omitted)

**Use Case**: The operator releases landing page comes from `tidb-in-kubernetes/main` and uses relative links; `main` is published as `/tidb-in-kubernetes/dev/*`.

---

### Rule 6: Namespace Links (Direct Mapping)

**Effect**: Resolves namespace links (`develop`, `best-practices`, `api`, `ai`, `tidb-cloud`) to namespace URLs (published as `/developer`, `/best-practices`, `/api`, `/ai`, `/tidbcloud`).

**Link Pattern**: `/{namespace}/{...any}/{docname}`

**Target Pattern**: `/{curLang}/{namespace}/{docname}`

**Conditions**: `namespace = ["tidb-cloud", "develop", "best-practices", "api", "ai"]`

**Namespace Transform**:
- `tidb-cloud` → `tidbcloud`
- `develop` → `developer`

**Example**:
- Link: `/develop/vector-search`
- Current Page: Any page
- Result: `/developer/vector-search`
- Link: `/tidb-cloud/releases/_index`
- Current Page: Any page
- Result: `/tidbcloud/releases/_index` (namespace transformed)

**Use Case**: Direct links to namespace pages from any location.

---

### Rule 7: TiDBCloud Page Links (Path-Based)

**Effect**: Resolves relative links from TiDBCloud pages to TiDBCloud URLs.

**Path Pattern**: `/{lang}/tidbcloud/{...any}`

**Link Pattern**: `/{...any}/{docname}`

**Target Pattern**: `/{lang}/tidbcloud/{docname}`

**Example**:
- Current Page: `/tidbcloud/dedicated`
- Link: `/getting-started`
- Result: `/tidbcloud/getting-started`
- Current Page: `/tidbcloud/dedicated/starter`
- Link: `/quick-start`
- Result: `/tidbcloud/quick-start`

**Use Case**: Relative links within TiDBCloud documentation preserve the TiDBCloud context.

---

### Rule 8: Developer/Best-Practices/API/AI Namespace Page Links (Path-Based)

**Effect**: Resolves relative links from namespace pages to TiDB stable branch URLs.

**Path Pattern**: `/{lang}/{namespace}/{...any}`

**Path Conditions**: `namespace = ["developer", "best-practices", "api", "ai"]`

**Link Pattern**: `/{...any}/{docname}`

**Target Pattern**: `/{lang}/tidb/stable/{docname}`

**Example**:
- Current Page: `/developer/overview`
- Link: `/vector-search`
- Result: `/tidb/stable/vector-search`
- Current Page: `/best-practices/guide`
- Link: `/performance-tuning`
- Result: `/tidb/stable/performance-tuning`

**Use Case**: Links from namespace pages resolve to TiDB stable branch, maintaining namespace context.

---

### Rule 9: TiDB/TiDB-in-Kubernetes Page Links (Path-Based)

**Effect**: Resolves relative links from TiDB or TiDB-in-Kubernetes pages, preserving branch/version.

**Path Pattern**: `/{lang}/{repo}/{branch}/{...any}`

**Path Conditions**: `repo = ["tidb", "tidb-in-kubernetes"]`

**Link Pattern**: `/{...any}/{docname}`

**Target Pattern**: `/{lang}/{repo}/{branch}/{docname}`

**Example**:
- Current Page: `/tidb/stable/upgrade`
- Link: `/upgrade-tidb-using-tiup`
- Result: `/tidb/stable/upgrade-tidb-using-tiup`
- Current Page: `/tidb/v8.5/alert-rules`
- Link: `/monitoring`
- Result: `/tidb/v8.5/monitoring`
- Current Page: `/tidb-in-kubernetes/stable/deploy`
- Link: `/deploy-tidb-on-kubernetes`
- Result: `/tidb-in-kubernetes/stable/deploy-tidb-on-kubernetes`

**Use Case**: Relative links within TiDB or TiDB-in-Kubernetes documentation preserve the branch/version context.

---

## Summary

The URL mapping system provides:

1. **Consistent URL Structure**: Source files are mapped to clean, SEO-friendly URLs
2. **Context-Aware Link Resolution**: Links are resolved based on the current page's context
3. **Namespace Support**: Special namespaces (`developer`, `best-practices`, `api`, `ai`) have their own URL structure
4. **Branch Aliasing**: Internal branch names are transformed to user-friendly versions
5. **Default Language Omission**: Default language (`en`) is omitted from URLs for cleaner paths
6. **TOC-Driven Build**: Only files referenced in TOC files are built, reducing build size

The system is designed to be maintainable and extensible, with configuration-driven rules that can be easily modified or extended as the documentation structure evolves.
