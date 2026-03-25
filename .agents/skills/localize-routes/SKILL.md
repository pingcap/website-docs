---
name: localize-routes
description: Update language-aware routing and translation wiring in website-docs when the task changes locale behavior, top-level route prefixes, translation keys, page language availability, or Gatsby i18n configuration. Review gatsby-config.js matchPath rules, locale translation files, route generation assumptions, and any template or component code that depends on language-specific behavior.
---

# Localize Routes

## Overview

Use this skill for changes that affect locale prefixes, translation dictionaries, or Gatsby i18n routing behavior. This repo uses `gatsby-plugin-react-i18next` with manual `matchPath` rules and language-aware page structures, so routing changes usually touch more than one file.

## Workflow

### 1) Identify the scope of the i18n change

Typical triggers:
- New translation keys in UI
- New or renamed top-level route prefixes
- Locale-specific availability differences
- Language-dependent banner, navigation, or SEO behavior

### 2) Review the Gatsby i18n entrypoint

Inspect `gatsby-config.js`, especially:
- `languages`
- `defaultLanguage`
- `redirect`
- `pages[].matchPath`
- `getLanguageFromPath`

In this repo, route families under docs prefixes are explicitly listed in `matchPath`. New top-level prefixes often require updates there.

### 3) Update translation files when UI text changes

Edit:
- `locale/en/translation.json`
- `locale/zh/translation.json`
- `locale/ja/translation.json`

Rules:
- Keep keys consistent across locales
- Only add the languages actually supported by the feature
- Reuse existing namespaces and key naming conventions when possible

### 4) Review routing helpers and consumers

Depending on the task, also inspect:
- `gatsby/create-pages/*`
- `src/templates/*`
- `src/components/Layout/Header/LangSwitch.tsx`
- components using `useI18next`, `Trans`, or locale-aware branching

Be especially careful when changing:
- omission of `/en/`
- route prefixes like `developer`, `best-practices`, `api`, `ai`, `releases`
- locale availability shown in UI via `availIn.locale`

### 5) Validate

At minimum:
- Confirm `matchPath` covers the affected route family
- Confirm new translation keys exist in all intended locale files
- Confirm any locale-conditional UI logic still behaves correctly
- Run `yarn build` when feasible

## Output Checklist

Report:
- Which locale and routing files changed
- Whether `gatsby-config.js` `matchPath` was reviewed or changed
- Which translation keys were added or updated
- Any language-specific limitations
- Whether `yarn build` was run
