export const SEARCH_CATEGORIES = {
  Releases: "releases",
  TiDBCloud: "tidb-cloud",
  TiDBInKubernetes: "tidb-in-kubernetes",
  TiDB: "tidb",
  TiDBForAI: "tidb-for-ai",
  Developer: "developer",
  BestPractices: "best-practices",
  API: "api",
} as const;

export type SearchCategory =
  (typeof SEARCH_CATEGORIES)[keyof typeof SEARCH_CATEGORIES];

const LANGUAGE_PREFIXES = new Set(["en", "zh", "ja"]);

export const getSearchCategoryLabelKey = (
  category: SearchCategory
): string => {
  switch (category) {
    case SEARCH_CATEGORIES.TiDBCloud:
      return "navbar.cloud";
    case SEARCH_CATEGORIES.TiDBInKubernetes:
      return "navbar.tidbOnKubernetes";
    case SEARCH_CATEGORIES.TiDB:
      return "navbar.tidbShortTerm";
    case SEARCH_CATEGORIES.TiDBForAI:
      return "navbar.tidbForAI";
    case SEARCH_CATEGORIES.Developer:
      return "navbar.developer";
    case SEARCH_CATEGORIES.BestPractices:
      return "navbar.bestPractices";
    case SEARCH_CATEGORIES.API:
      return "navbar.api";
    case SEARCH_CATEGORIES.Releases:
      return "navbar.releases";
    default:
      return "";
  }
};

export const normalizeSearchResultPath = (url: string): string => {
  if (!url) {
    return "";
  }

  const fallbackPath = url
    .split("?")[0]
    .split("#")[0]
    .replace(/^https?:\/\/[^/]+\//i, "")
    .replace(/^\/+/, "")
    .toLowerCase();

  const normalizedPathname = (() => {
    try {
      const parsedUrl = new URL(url);
      return parsedUrl.pathname.replace(/^\/+/, "").toLowerCase();
    } catch (_) {
      return fallbackPath;
    }
  })();

  if (!normalizedPathname) {
    return "";
  }

  const segments = normalizedPathname.split("/").filter(Boolean);
  if (segments.length === 0) {
    return "";
  }

  if (LANGUAGE_PREFIXES.has(segments[0])) {
    segments.shift();
  }

  return segments.join("/");
};

export const resolveSearchCategory = (url: string): SearchCategory | null => {
  const normalizedPath = normalizeSearchResultPath(url);
  if (!normalizedPath) {
    return null;
  }

  if (normalizedPath === "releases" || normalizedPath.startsWith("releases/")) {
    return SEARCH_CATEGORIES.Releases;
  }

  if (normalizedPath.startsWith("tidbcloud/")) {
    return SEARCH_CATEGORIES.TiDBCloud;
  }

  if (normalizedPath.startsWith("tidb-in-kubernetes/")) {
    return SEARCH_CATEGORIES.TiDBInKubernetes;
  }

  if (normalizedPath.startsWith("tidb/")) {
    return SEARCH_CATEGORIES.TiDB;
  }

  if (normalizedPath.startsWith("ai/")) {
    return SEARCH_CATEGORIES.TiDBForAI;
  }

  if (normalizedPath.startsWith("developer/")) {
    return SEARCH_CATEGORIES.Developer;
  }

  if (normalizedPath.startsWith("best-practices/")) {
    return SEARCH_CATEGORIES.BestPractices;
  }

  if (normalizedPath.startsWith("api/")) {
    return SEARCH_CATEGORIES.API;
  }

  return null;
};
