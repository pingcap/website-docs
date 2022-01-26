export enum Repo {
  tidb = 'docs',
  tidb_zh = 'docs-cn',
  dm = 'tidb-data-migration',
  operator = 'tidb-in-kubernetes',
  appdev = 'tidbcloud',
  dbaas = 'appdev',
}

export interface FrontMatter {
  title: string
  summary?: string
  aliases?: string
  keywords?: string[]
}

export enum Locale {
  en = 'en',
  zh = 'zh',
}
