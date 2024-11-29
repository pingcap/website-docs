export const getPageType = (filePath) => {
  if (filePath.includes("/tidb/")) {
    return "tidb";
  }
  if (filePath.includes("/tidbcloud/") || filePath.endsWith("/tidbcloud")) {
    return "tidbcloud";
  }
};

export const OPEN_IF_REGEX = /<IF platform="(.+?)">/;
export const CLOSE_IF_REGEX = /<\/IF>/;
