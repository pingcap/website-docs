import { Locale, Repo } from '../src/typing'
import CONFIG from '../docs.json'

export interface PathConfig {
  repo: Repo
  locale: Locale
  branch: string
}

export function generateUrl(filename: string, config: PathConfig) {
  const lang = config.locale === Locale.en ? '' : '/zh'

  return `${lang}/${config.repo}/${branchToVersion(config)}/${filename}`
}

export function generateConfig(slug: string): PathConfig {
  const [locale, repo, branch] = slug.split('/') as [Locale, Repo, string]

  return { locale, repo, branch }
}

function branchToVersion(config: PathConfig) {
  switch (config.repo) {
    case 'tidb':
    case 'tidb-in-kubernetes': {
      const stable = CONFIG.docs[config.repo].stable
      switch (config.branch) {
        case 'master':
          return 'dev'
        case stable:
          return 'stable'
        default:
          return config.branch.replace('release-', 'v')
      }
    }
    case 'tidb-data-migration':
      return config.branch.replace('release-', 'v')
    case 'appdev':
      return 'dev'

    case 'tidbcloud':
      return 'public-preview'
  }
}
