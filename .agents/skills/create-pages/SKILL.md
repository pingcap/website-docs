---
name: create-pages
description: Create or update a page-generation workflow in website-docs when the task adds a new Gatsby page type, template-backed route, or build-time page creation rule. Implement the page creator under gatsby/create-pages/, connect the correct template under src/templates/, pass pageContext consistently, and review routing, i18n, and build-type behavior.
---

# Create Pages

## Overview

Use this skill when the change is about Gatsby `createPage` logic rather than a single component. In this repo, page creation is centralized under `gatsby/create-pages/`, while templates live in `src/templates/`.

## Workflow

### 1) Match the request to an existing page pattern

Review these reference implementations:
- `gatsby/create-pages/create-docs.ts`
- `gatsby/create-pages/create-cloud-api.ts`
- `gatsby/create-pages/create-search.ts`
- `gatsby/create-pages/create-404.ts`

Choose the closest pattern:
- Content-backed docs pages
- Data-driven non-MDX pages
- Singleton utility pages like search or 404

### 2) Create or update the page creator

Add or edit a file under `gatsby/create-pages/`.

Common requirements in this repo:
- Resolve the template with `resolve(__dirname, "../../src/templates/...")`
- Use Gatsby `createPage`
- Pass `buildType` using `DEFAULT_BUILD_TYPE`
- Pass `feature.banner` and similar flags explicitly when template behavior depends on them
- Include `availIn` when the page participates in locale/version UI

If the page creator is new, export it from `gatsby/create-pages/index.ts` and ensure the Gatsby Node entrypoint already invokes that index.

### 3) Create or update the template

Create or edit the matching file under `src/templates/`.

Template conventions visible in this repo:
- Use `Layout`
- Use `Seo`
- Query `locales` when the page uses `gatsby-plugin-react-i18next`
- Respect `buildType`, `feature.banner`, and `TOCNamespace` where applicable

If the page is docs-like, check whether it should instead reuse `DocTemplate.tsx` before inventing a new template.

### 4) Define pageContext carefully

Do not pass ad hoc fields without checking existing patterns.

Typical pageContext fields in this repo include:
- `id`
- `pathConfig`
- `pageUrl`
- `availIn`
- `buildType`
- `feature`
- `namespace`

Keep field names aligned with current templates and shared interfaces where possible.

### 5) Review routing and i18n implications

After adding a new top-level route or page family, review:
- `gatsby-config.js` `gatsby-plugin-react-i18next` `pages[].matchPath`
- Any locale restrictions, for example English-only API pages
- Whether the route should include language prefixes or omit `/en/`

### 6) Validate

At minimum:
- Confirm the creator is exported from `gatsby/create-pages/index.ts` if needed
- Confirm the template path resolves correctly
- Confirm pageContext fields match template expectations
- Run `yarn build` when feasible

## Output Checklist

Report:
- Which page creator and template files changed
- What routes are created
- Key pageContext fields
- Any i18n or `matchPath` review performed
- Whether `yarn build` was run
