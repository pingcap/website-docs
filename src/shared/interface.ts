export interface TableOfContent {
  title: string;
  url: string;
  items?: TableOfContent[];
  condition?: {
    platform?: string;
    plan?: string;
    language?: string;
  };
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
  prefix?: string;
}

export interface PageContext {
  name: string;
  pathConfig: PathConfig;
  filePath: string;
  availIn: {
    locale: Locale[];
    version: string[];
  };
}

export interface FrontMatter {
  title: string;
  summary?: string;
  aliases?: string[];
  keywords?: string[];
  hide_sidebar?: boolean;
  hide_commit?: boolean;
  hide_leftNav?: boolean;
}

export type RepoNavLinkContent = { code: boolean; value: string } | string;

export interface RepoNavLink {
  type: "nav" | "heading";
  content: RepoNavLinkContent[];
  link?: string;
  tag?: {
    value: string;
    query?: string;
  };
  children?: RepoNavLink[];
  id: string;
}

export type RepoNav = RepoNavLink[];

export type BuildType = "prod" | "archive";

export enum CloudPlan {
  Dedicated = "dedicated",
  Starter = "starter",
  Essential = "essential",
  Premium = "premium",
}
