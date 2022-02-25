export enum Repo {
  tidb = 'tidb',
  dm = 'tidb-data-migration',
  operator = 'tidb-in-kubernetes',
  tidbcloud = 'tidbcloud',
  appdev = 'appdev',
}

export interface FrontMatter {
  title: string
  summary?: string
  aliases?: string[]
  keywords?: string[]
}

export enum Locale {
  en = 'en',
  zh = 'zh',
}

export interface PageData {}

export interface RepoNavLink {
  content: ({ code: boolean; value: string } | string)[]
  link?: string
  children?: RepoNavLink[]
}

export type RepoNav = RepoNavLink[]

export interface TableOfContent {
  title: string
  url: string
  items?: TableOfContent[]
}
