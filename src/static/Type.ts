export type DocLeftNavItemContent = (
  | { code: boolean; value: string }
  | string
)[];

export interface DocLeftNavItem {
  content: DocLeftNavItemContent;
  link?: string;
  children?: DocLeftNavItem[];
  id: string;
}

export type DocLeftNav = DocLeftNavItem[];

export interface TableOfContent {
  title: string;
  url: string;
  items?: TableOfContent[];
}

export enum Repo {
  tidb = "tidb",
  dm = "tidb-data-migration",
  operator = "tidb-in-kubernetes",
  tidbcloud = "tidbcloud",
}

export enum Locale {
  en = "en",
  zh = "zh",
  ja = "ja",
}

export interface PathConfig {
  repo: Repo;
  locale: Locale;
  branch: string;
  version: string | null;
}
