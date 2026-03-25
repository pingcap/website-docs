---
name: create-plugin
description: Create or update repository-local Gatsby MDX plugins in website-docs when the task requires custom Markdown transformation, AST rewriting, shortcode conversion, or remark/rehype-style behavior during build. Implement the plugin under gatsby/plugin/, register it from gatsby-config.js, connect it to MDX components when JSX output is needed, and verify the affected Markdown rendering path.
---

# Create Plugin

## Overview

Use this skill for build-time Markdown and MDX transformations in this repo. Existing local plugins under `gatsby/plugin/` show the expected pattern: transform `markdownAST` nodes, emit JSX when needed, then register the plugin in `gatsby-config.js` inside the `gatsby-plugin-mdx` pipeline.

## Workflow

### 1) Confirm the task belongs in a Gatsby plugin

Use this skill when the request is about:
- Converting Markdown syntax into JSX or component tags
- Rewriting links, blockquotes, or code fences at build time
- Adding a local remark-like plugin under `gatsby/plugin/`

Prefer other skills when:
- Authors can already write `<Component />` directly in MDX
- The change is only a React component or template change
- The change belongs in URL resolution or page creation

### 2) Pick the transformation layer

Inspect the current plugin chain in `gatsby-config.js`.

Current local MDX plugins:
- `gatsby/plugin/mermaid`
- `gatsby/plugin/syntax-diagram`
- `gatsby/plugin/content`

Decision rule:
- Transform Markdown AST nodes in `gatsby/plugin/*/index.ts` when source syntax should compile into JSX
- Update `src/components/MDXComponents/*` when the JSX tag already exists but the UI must change
- Touch both when the plugin emits a new custom tag like `<Mermaid />` or `<Note />`

### 3) Implement the plugin

Create or update `gatsby/plugin/<plugin-name>/index.ts`.

Follow repo patterns:
- Use `unist-util-visit` for AST traversal
- Accept Gatsby MDX plugin input such as `{ markdownAST, markdownNode }`
- Replace target nodes with `{ type: "jsx", value: "..." }` when emitting component tags
- Use repo helpers instead of duplicating URL logic, for example:
  - `gatsby/url-resolver`
  - `gatsby/link-resolver`

If the plugin is new, also add `gatsby/plugin/<plugin-name>/package.json` matching the existing local plugin layout.

### 4) Register in Gatsby

Update `gatsby-config.js`.

For MDX pipeline work, register the plugin under `gatsby-plugin-mdx` -> `gatsbyRemarkPlugins`.
Use `require.resolve("./gatsby/plugin/<plugin-name>")` to match current conventions.

Check whether plugin order matters:
- Link or content rewrites usually need deterministic ordering
- A later plugin will only see the AST shape produced by earlier plugins

### 5) Wire emitted JSX to runtime components when needed

If the plugin emits custom JSX tags, ensure the component exists in:
- `src/components/MDXComponents/`
- `src/components/MDXComponents/index.tsx`

In this repo, `src/components/MDXContent.tsx` already spreads `...MDXComponents` into `MDXProvider`, so runtime registration is usually just the export in `index.tsx`.

### 6) Validate against representative content

At minimum:
- Verify the transformed node type and JSX string are valid
- Confirm any emitted component tag exists as a named export
- Review one representative Markdown or MDX example that exercises the plugin
- Run `yarn build` when feasible

Useful reference files:
- `gatsby/plugin/content/index.ts`
- `gatsby/plugin/mermaid/index.ts`
- `gatsby/plugin/syntax-diagram/index.ts`
- `gatsby-config.js`

## Output Checklist

Report:
- Which plugin files changed or were added
- Where the plugin was registered in `gatsby-config.js`
- Whether a runtime MDX component was added or reused
- What sample Markdown syntax now works
- Whether `yarn build` was run
