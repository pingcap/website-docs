---
name: manage-toc
description: Modify TOC extraction, navigation generation, or TOC-based filtering behavior in website-docs when the task changes how document navigation trees, right-side headings, or TOC membership are computed. Update the Gatsby TOC pipeline under gatsby/, keep runtime filtering logic in src/shared/ aligned, and add or adjust Jest coverage for the changed TOC behavior.
---

# Manage TOC

## Overview

Use this skill when the request changes how navigation trees or heading TOCs are generated, filtered, or consumed. In this repo, TOC behavior spans build-time Gatsby code and runtime filtering helpers.

## Workflow

### 1) Locate the TOC layer being changed

Common files:
- `gatsby/toc.ts`
- `gatsby/toc-filter.ts`
- `gatsby/toc-ignore.ts`
- `gatsby/create-types/create-navs.ts`
- `src/shared/filterTOC.ts`
- `src/shared/filterRightToc.ts`

Choose the layer deliberately:
- Build-time extraction and nav construction in `gatsby/`
- Runtime hiding or conditional filtering in `src/shared/`

### 2) Keep TOC membership and nav generation coherent

Current repo behavior includes:
- Parsing TOC MDX into nav structures
- Filtering build output based on TOC references
- Mapping docs to TOC names
- Special starter and essential nav handling for TiDB Cloud

If you change one of these, check whether the others must also change.

### 3) Prefer existing helper paths

Examples to follow:
- `getFilesFromTocs()` and `filterNodesByToc()` in `gatsby/toc-filter.ts`
- `createNavs()` in `gatsby/create-types/create-navs.ts`
- `filterTOC()` and `filterRightToc()` in `src/shared/`

Avoid duplicating TOC parsing rules in templates or components.

### 4) Update tests

TOC logic in this repo already has Jest coverage under `gatsby/__tests__/`.
When changing build-time TOC behavior, add or adjust tests near the affected code.

Typical areas:
- TOC whitelist or ignore behavior
- file inclusion/exclusion from TOCs
- right TOC filtering conditions
- nav generation for starter or essential plans

### 5) Validate

At minimum:
- Confirm the changed TOC layer is the right one
- Confirm runtime consumers still receive the expected shape
- Run targeted Jest tests when applicable
- Run `yarn test` or at least the relevant test file when feasible

## Output Checklist

Report:
- Which TOC build-time or runtime files changed
- Whether Jest tests were updated
- What navigation or filtering behavior changed
- Whether `yarn test` or targeted tests were run
