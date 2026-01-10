export enum PageType {
  Home = "home",
  TiDB = "tidb",
  TiDBCloud = "tidbcloud",
  TiDBInKubernetes = "tidb-in-kubernetes",
  Developer = "developer",
  BestPractice = "best-practice",
  Api = "api",
  Release = "release",
}

export const usePageType = (language?: string, pageUrl?: string): PageType => {
  if (!pageUrl) {
    return PageType.Home;
  }

  // Check for home page
  if (pageUrl === "/" || pageUrl === `/${language}/`) {
    return PageType.Home;
  }

  // Check for release pages (should be checked before other paths)
  if (pageUrl.includes("/release/")) {
    return PageType.Release;
  }

  // Check for api pages
  if (pageUrl.includes("/api/")) {
    return PageType.Api;
  }

  // Check for developer pages
  if (pageUrl.includes("/developer/")) {
    return PageType.Developer;
  }

  // Check for best-practice pages
  if (pageUrl.includes("/best-practice/")) {
    return PageType.BestPractice;
  }

  // Check for tidb-in-kubernetes pages
  if (pageUrl.includes("/tidb-in-kubernetes/")) {
    return PageType.TiDBInKubernetes;
  }

  // Check for tidbcloud pages
  if (pageUrl.includes("/tidbcloud/")) {
    return PageType.TiDBCloud;
  }

  // Check for tidb pages
  if (pageUrl.includes("/tidb/")) {
    return PageType.TiDB;
  }

  return PageType.Home;
};
