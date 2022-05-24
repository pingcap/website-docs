export enum Repo {
  tidb = 'tidb',
  dm = 'tidb-data-migration',
  operator = 'tidb-in-kubernetes',
  tidbcloud = 'tidbcloud',
}

export interface FrontMatter {
  title: string
  summary?: string
  aliases?: string[]
  keywords?: string[]
  hide_sidebar?: boolean
  hide_commit?: boolean
}

export enum Locale {
  en = 'en',
  zh = 'zh',
  ja = 'ja',
}

export interface PageContext {
  name: string
  pathConfig: PathConfig
  filePath: string
  availIn: {
    locale: Locale[]
    version: string[]
  }
}

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

export interface PathConfig {
  repo: Repo
  locale: Locale
  branch: string
  version: string | null
}
