import { Repo, type PathConfig } from "../src/shared/interface";

function parseCommaSeparatedEnv(name: string): string[] {
  const raw = process.env[name];
  if (!raw) return [];
  return raw
    .split(",")
    .map((v) => v.trim())
    .filter(Boolean);
}

const DEFAULT_IGNORED_TOC_RELATIVE_PATH_SUBSTRINGS = [
  // TODO: Remove this filter once premium is public.
  "TOC-tidb-cloud-premium.md",
  // Temporarily ignore this TOC during build.
  "TOC-pingkai.md",
];

const IGNORED_TOC_RELATIVE_PATH_SUBSTRINGS = [
  ...DEFAULT_IGNORED_TOC_RELATIVE_PATH_SUBSTRINGS,
  ...parseCommaSeparatedEnv("WEBSITE_IGNORED_TOC_RELATIVE_PATH_SUBSTRINGS"),
];

export function isIgnoredTocRelativePath(relativePath: string): boolean {
  if (!relativePath) return false;
  return IGNORED_TOC_RELATIVE_PATH_SUBSTRINGS.some(
    (substr) => substr && relativePath.includes(substr)
  );
}

export function shouldIncludeTocNode(
  config: PathConfig,
  relativePath: string
): boolean {
  if (isIgnoredTocRelativePath(relativePath)) return false;

  // For tidb and tidb-in-kubernetes, only stable reads all TOCs.
  // Other versions/branches (including master/main) only read TOC.md.
  if (config.repo === Repo.tidb || config.repo === Repo.operator) {
    if (config.version !== "stable") {
      const filename = relativePath.split("/").pop() || relativePath;
      return filename === "TOC.md";
    }
  }

  // tidbcloud reads all TOCs.
  return true;
}

function isBranchRootIndexSlug(slug: string): boolean {
  const segments = slug.split("/");
  return segments.length === 4 && segments[segments.length - 1] === "_index";
}

export function isWhitelistedDocNode(node: {
  name: string;
  slug: string;
  pathConfig: PathConfig;
}): boolean {
  // Only whitelisting `_index.md`-derived pages.
  if (node.name !== "") return false;

  // tidbcloud's plan pages are not necessarily referenced by TOC links.
  // Keep the legacy behavior to always build `_index.md` pages.
  if (node.pathConfig.repo === Repo.tidbcloud) return true;

  // Only stable has all `_index.md` pages always built.
  if (
    (node.pathConfig.repo === Repo.tidb ||
      node.pathConfig.repo === Repo.operator) &&
    node.pathConfig.version === "stable"
  ) {
    return true;
  }

  // For other versions/branches, only build branch-root `_index.md`, e.g.
  // `master/_index.md`; `master/ai/_index.md` should not be whitelisted.
  if (
    node.pathConfig.repo === Repo.tidb ||
    node.pathConfig.repo === Repo.operator
  ) {
    return isBranchRootIndexSlug(node.slug);
  }

  // Default: keep legacy behavior for other repos.
  return true;
}
