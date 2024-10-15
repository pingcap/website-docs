export const getPageType = (filePath) => {
  if (filePath.includes("/tidb/")) {
    return "tidb";
  }
  if (filePath.includes("/tidbcloud/") || filePath.endsWith("/tidbcloud")) {
    return "tidbcloud";
  }
};
