---
name: integrate-search
description: Update onsite search behavior in website-docs when the task changes the search page, search box flows, Algolia client wiring, result categorization, external search fallbacks, or search-related routing. Edit the relevant Gatsby page creator, search template or components, and shared search utilities while keeping locale, category, and tracking behavior aligned.
---

# Integrate Search

## Overview

Use this skill for search experience changes in this repo. Search behavior spans Gatsby page creation, the search page template, UI components, Algolia wiring, category labeling, and external search fallbacks.

## Workflow

### 1) Locate the affected search layer

Common files:
- `gatsby/create-pages/create-search.ts`
- `src/templates/DocSearchTemplate.tsx`
- `src/components/Search/index.tsx`
- `src/components/Search/Results.tsx`
- `src/shared/utils/algolia.ts`
- `src/shared/utils/searchCategory.ts`

Choose the correct layer before editing:
- Page route creation
- Search box interactions
- Result rendering and paging
- Category resolution
- Algolia client configuration

### 2) Preserve current locale and route assumptions

Search in this repo currently:
- creates `/search/`
- navigates to `/search/?q=...`
- uses `gatsby-plugin-react-i18next` helpers in UI
- mixes onsite search with Google or Bing fallbacks

If you change search route shape or category prefixes, review i18n routing and `resolveSearchCategory()`.

### 3) Update Algolia and category logic carefully

When touching search data wiring:
- Keep `GATSBY_ALGOLIA_APPLICATION_ID` and `GATSBY_ALGOLIA_API_KEY` usage intact unless the task explicitly changes them
- Reuse `normalizeSearchResultPath()` and `resolveSearchCategory()` patterns
- Update translation keys if new labels or UI strings are introduced

When adding a new top-level docs section, search categorization may need updates.

### 4) Review tracking and external search behavior

`src/components/Search/index.tsx` includes GTM events and Google/Bing fallbacks.
If you alter submit behavior, preserve or intentionally update:
- onsite vs external search selection
- query propagation to the search page
- GTM events

### 5) Validate

At minimum:
- Confirm the search route still resolves
- Confirm query string handling still works
- Confirm category chips still resolve correctly for representative URLs
- Run `yarn build` when feasible

## Output Checklist

Report:
- Which search files changed
- Whether route, Algolia, category, or tracking behavior changed
- Any new translation keys or route-prefix dependencies
- Whether `yarn build` was run
