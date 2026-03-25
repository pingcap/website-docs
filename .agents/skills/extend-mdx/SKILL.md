---
name: extend-mdx
description: Extend MDX rendering in website-docs when a request needs either a new custom MDX component that authors can invoke with JSX-like tags, or a build-time Markdown-to-MDX transform that compiles plain Markdown syntax into custom JSX/AST behavior. Implement runtime components under src/components/MDXComponents/, implement build-time transforms under gatsby/plugin/, register exports and plugins in the right places, and validate the end-to-end MDX rendering path.
---

# Extend MDX

## Overview

Use this skill for any repo-specific MDX extension work. In this codebase, MDX can be extended in two ways:
- Runtime component path: authors write tags like `<FeatureCallout />` directly in MDX
- Build-time transform path: Gatsby plugins convert plain Markdown syntax into JSX or altered AST nodes during build

The important decision is whether the authoring format should be JSX-first or Markdown-first.

## Decision Tree

### 1) Choose the extension path

Use the runtime component path when:
- Authors can write `<MyComponent />` directly in MDX
- The task is mainly new UI, layout, cards, tabs, alerts, or rich content blocks
- No custom Markdown syntax parsing is needed

Use the build-time transform path when:
- Authors should not need to write JSX manually
- Existing Markdown constructs such as blockquotes, code fences, or custom text patterns should become richer behavior
- The task requires AST rewriting during the Gatsby build

Sometimes the task needs both:
- A plugin transforms Markdown into `<FeatureX />`
- A runtime MDX component renders `<FeatureX />`

## Runtime Component Path

### 2) Inspect existing component patterns

Review `src/components/MDXComponents/` and match the closest pattern:
- `Alert.tsx` for simple wrapper blocks
- `LearningPath.tsx` for structured layouts
- `developer/index.ts` for grouped feature exports

### 3) Implement the component

Create the component under `src/components/MDXComponents/`.

Rules:
- Use TypeScript React components
- Use PascalCase filenames and named exports
- Accept `children` when nested Markdown content is needed
- Keep props MDX-friendly: strings, booleans, numbers, and `children`
- Prefer MUI primitives or local CSS Modules that match nearby code
- Route fixed UI copy through i18n when needed

### 4) Register the component

Update `src/components/MDXComponents/index.tsx`.

In this repo, `src/components/MDXContent.tsx` already spreads `...MDXComponents` into `MDXProvider`, so most component registration is just the named export in `index.tsx`.

Edit `src/components/MDXContent.tsx` only when the task specifically needs built-in tag overrides or injected runtime props.

### 5) Show MDX authoring syntax

Provide or update the actual MDX usage pattern, for example:

```mdx
<FeatureCallout title="Fast setup">
  Write normal Markdown here.
</FeatureCallout>
```

## Build-Time Transform Path

### 6) Identify source syntax and desired output

Write the mapping explicitly before editing:
- Input syntax example
- Target node type or JSX output
- Whether a runtime component tag will be emitted

Current repo examples:
- `gatsby/plugin/content/index.ts` rewrites certain links and blockquotes
- `gatsby/plugin/mermaid/index.ts` turns fenced code blocks into `<Mermaid />`

### 7) Implement or update the Gatsby plugin

Edit or add a local plugin under `gatsby/plugin/`.

Guidelines:
- Traverse `markdownAST` using `unist-util-visit`
- Replace only the target nodes
- Preserve unaffected content
- Reuse repo URL and link helpers instead of duplicating path rules
- If emitting JSX, keep the generated tag and props stable and simple

If the plugin is new, add the local plugin package layout to match the existing `gatsby/plugin/*` directories.

### 8) Register the plugin in Gatsby

Update `gatsby-config.js` under `gatsby-plugin-mdx` -> `gatsbyRemarkPlugins`.
Use `require.resolve("./gatsby/plugin/<plugin-name>")` and check whether ordering relative to `content`, `mermaid`, or `syntax-diagram` matters.

### 9) Connect runtime components if the transform emits JSX

If the transform outputs a custom tag like `<FeatureX />`, also implement and export the runtime component under `src/components/MDXComponents/`.

If the transform only rewrites AST nodes without introducing a custom tag, no MDX component registration is needed.

## Validation

Check at minimum:
- The component or plugin file is syntactically valid
- Any custom tag emitted by a plugin exists as a named MDX component export
- `src/components/MDXComponents/index.tsx` exports new runtime components
- `gatsby-config.js` registers new plugins when applicable
- One representative Markdown or MDX example matches the intended authoring flow

When feasible:
- Run `yarn build`
- Run `yarn test` if the change also touches covered Gatsby logic

## Output Checklist

Report:
- Whether the task used the runtime component path, the build-time transform path, or both
- Which component and plugin files changed
- How components or plugins were registered
- The Markdown or MDX syntax authors should use
- Whether `yarn build` or tests were run
