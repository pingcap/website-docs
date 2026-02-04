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

