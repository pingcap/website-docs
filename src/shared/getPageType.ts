export type PageType = "home" | "tidb" | "tidbcloud" | undefined;

export const getPageType = (language?: string, pageUrl?: string): PageType => {
  if (pageUrl === "/" || pageUrl === `/${language}/`) {
    return "home";
  } else if (pageUrl?.includes("/tidb/")) {
    return "tidb";
  } else if (
    pageUrl?.includes("/tidbcloud/") ||
    pageUrl?.endsWith("/tidbcloud")
  ) {
    return "tidbcloud";
  }
  return;
};

