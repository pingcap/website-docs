export enum DOC {
  tidb = 'docs',
  dm = 'tidb-data-migration',
  operator = 'tidb-in-kubernetes',
  tidbcloud = 'tidbcloud',
  appdev = 'appdev',
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
