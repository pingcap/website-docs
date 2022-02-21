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

export interface RepoTocLink {
  content: ({ code: boolean; value: string } | string)[]
  link?: string
  children?: RepoTocLink[]
}

export type RepoToc = RepoTocLink[]
