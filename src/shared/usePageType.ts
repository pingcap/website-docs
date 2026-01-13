import { Locale } from "./interface";

export enum PageType {
  Home = "home",
  TiDB = "tidb",
  TiDBCloud = "tidbcloud",
  TiDBInKubernetes = "tidb-in-kubernetes",
  Develop = "develop",
  BestPractice = "best-practice",
  Api = "api",
  Releases = "releases",
}

const LANGUAGE_CODES = Object.values(Locale);

/**
 * Normalize pageUrl by removing language prefix and extracting the segment to check
 * Returns the segment that should be checked for pageType (second segment if language exists, first otherwise)
 */
const normalizePageUrl = (pageUrl: string): string => {
  // Remove leading and trailing slashes, then split
  const segments = pageUrl
    .replace(/^\/+|\/+$/g, "")
    .split("/")
    .filter(Boolean);

  if (segments.length === 0) {
    return "";
  }

  // Check if first segment is a language code
  const firstSegment = segments[0];
  if (LANGUAGE_CODES.includes(firstSegment as Locale)) {
    // If first segment is language, return second segment (or empty if only language)
    return segments.length > 1 ? segments[1] : "";
  }

  // No language prefix, return first segment
  return firstSegment;
};

/**
 * Check if the normalized segment matches a pageType
 * Matches if segment equals pageType exactly
 * Also checks if the full URL path contains /{pageType} at the end or followed by /
 */
const matchesPageType = (
  segment: string,
  pageType: string,
  fullUrl: string
): boolean => {
  if (!segment) {
    return false;
  }

  // Exact match of the segment
  if (segment === pageType) {
    return true;
  }

  // Check if URL contains /{pageType} at the end or followed by /
  // This handles cases like /tidb/stable/... or /en/tidb/stable/...
  const pattern = new RegExp(`/${pageType}(/|$)`);
  return pattern.test(fullUrl);
};

export const usePageType = (language?: string, pageUrl?: string): PageType => {
  if (!pageUrl) {
    return PageType.Home;
  }

  // Check for home page
  if (
    pageUrl === "/" ||
    pageUrl === `/${language}/` ||
    pageUrl === `/${language}`
  ) {
    return PageType.Home;
  }

  // Normalize URL to get the segment to check
  const segment = normalizePageUrl(pageUrl);

  // If no segment after normalization, it's home
  if (!segment) {
    return PageType.Home;
  }

  // Check page types in priority order
  // Check for release pages
  if (matchesPageType(segment, PageType.Releases, pageUrl)) {
    return PageType.Releases;
  }

  // Check for api pages
  if (matchesPageType(segment, PageType.Api, pageUrl)) {
    return PageType.Api;
  }

  // Check for developer pages
  if (matchesPageType(segment, PageType.Develop, pageUrl)) {
    return PageType.Develop;
  }

  // Check for best-practice pages
  if (matchesPageType(segment, PageType.BestPractice, pageUrl)) {
    return PageType.BestPractice;
  }

  // Check for tidb-in-kubernetes pages
  if (matchesPageType(segment, PageType.TiDBInKubernetes, pageUrl)) {
    return PageType.TiDBInKubernetes;
  }

  // Check for tidbcloud pages
  if (matchesPageType(segment, PageType.TiDBCloud, pageUrl)) {
    return PageType.TiDBCloud;
  }

  // Check for tidb pages
  if (matchesPageType(segment, PageType.TiDB, pageUrl)) {
    return PageType.TiDB;
  }

  return PageType.Home;
};
