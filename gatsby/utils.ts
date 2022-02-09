import { DOC, Locale } from '../src/typing'
import config from '../docs.json'

export function getRepo(doc: DOC, lang: Locale) {
  return config.docs[doc].languages[lang].repo
}

export function getStable(doc: DOC) {
  return config.docs[doc].stable
}

function renameVersion(version: string, stable: string) {
  switch (version) {
    case 'master':
      return 'dev'
    case stable:
      return 'stable'
    default:
      return version.replace('release-', 'v')
  }
}

export function renameVersionByDoc(doc: DOC, version: string) {
  switch (doc) {
    case 'tidb':
    case 'tidb-data-migration':
    case 'tidb-in-kubernetes':
    case 'appdev':
      return renameVersion(version, getStable(doc))
    case 'tidbcloud':
      return 'public-preview'
  }
}

function genDocCategory(slug: string, separator = '/') {
  const [name, branch] = slug.split('/')

  if (!(name in DOC)) {
    throw new Error(`invalid repo name ${name}`)
  }

  return `${name}${separator}${renameVersionByDoc(name as DOC, branch)}`
}

export function genTOCSlug(slug: string) {
  return `${slug.split('/').slice(0, 3).join('/')}/TOC`
}

export function genPDFDownloadURL(slug: string, lang: Locale) {
  return `${genDocCategory(slug, '-')}-${lang}-manual.pdf`
}

/**
 * Replace disk path to url path.
 *
 * @param {string} slug - mdx slug.
 * @param {string} name - filename.
 * @param {string} lang
 * @param {string} pathWithoutVersion
 * @returns {string} - Replaced path.
 */
export function replacePath(slug: string, name: string, lang: Locale, pathWithoutVersion: string) {
  const docPath = genDocCategory(slug)
  const language = lang === 'en' ? '' : '/' + lang

  if (name === '_index') {
    return `${language}/${docPath}`
  }

  return `${language}/${docPath}/${pathWithoutVersion}`
}
