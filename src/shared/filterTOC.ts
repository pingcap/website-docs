import { Locale, RepoNav, RepoNavLink } from "./interface";

const BLOCK_NAVS = [
  "/ja/tidbcloud/set-up-private-endpoint-connections-on-alibaba-cloud",
];

export const filterTOC = (navs?: RepoNavLink[]): RepoNav => {
  if (!navs) return [];

  return navs.filter((item) => {
    item.children = filterTOC(item.children);
    return !BLOCK_NAVS.includes(item.link || "");
  });
};
