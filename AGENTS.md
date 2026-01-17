# Repository Guidelines

## Project Structure & Module Organization

- `src/`: Gatsby site code (React components, templates, state, theme, and styles).
- `gatsby/`: build-time utilities (page creation, link/url resolvers, custom plugins) and unit tests.
- `docs/`: documentation content (git submodule pointing to `pingcap/docs-staging`).
- `locale/`: i18n dictionaries (`locale/{en,zh,ja}/translation.json`).
- `static/`, `src/media/`, `images/`: static assets used by the site/README.
- Generated (do not commit): `.cache/`, `public/`, `coverage/`.

## Build, Test, and Development Commands

- `yarn`: install dependencies and apply `patches/` via `patch-package`.
- `git submodule update --init --depth 1 --remote`: fetch/update the docs submodule content.
- `yarn start` (or `yarn dev`): run local development server (Gatsby develop).
- `yarn build`: create a production build.
- `yarn serve`: serve the production build locally.
- `yarn clean`: remove Gatsby build caches (`.cache/`, `public/`).
- `yarn test`: run Jest with coverage for code under `gatsby/`.

## Coding Style & Naming Conventions

- Indentation: 2 spaces (see `.editorconfig`); keep TypeScript `strict` passing.
- Formatting: Prettier runs via Husky + lint-staged on commit (`.husky/pre-commit`).
- Components: PascalCase folders/files (e.g. `src/components/Layout/`); utilities/hooks: camelCase.
- Styles: prefer CSS Modules (`*.module.css`); shared CSS in `src/styles/*.css`.
- Imports: `tsconfig.json` sets `baseUrl: "./src"` (absolute imports like `shared/utils/...` are preferred).

## Testing Guidelines

- Framework: Jest + `ts-jest` (`jest.config.js`).
- Location/pattern: `gatsby/**/__tests__/**/*.test.{ts,tsx,js,jsx}`.
- Add/adjust tests when changing resolver logic or Gatsby build utilities.

## Commit & Pull Request Guidelines

- Commit messages follow a Conventional Commits pattern (common types: `feat:`, `fix:`, `refactor:`, `chore:`).
- PRs should include: clear description + rationale, linked issue(s), and screenshots for UI changes.
- Before requesting review, ensure `yarn test` and `yarn build` pass locally.

## Security & Configuration Tips

- Put local-only env vars in `.env.development` (e.g. `GATSBY_ALGOLIA_APPLICATION_ID`, `GATSBY_ALGOLIA_API_KEY`).
- If GitHub API rate-limits during development, set `GITHUB_AUTHORIZATION_TOKEN=...` when running commands.
- Never commit `.env*` files (they are gitignored).
