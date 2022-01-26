import config from '../docs.json'

export function getRepo(doc, lang) {
  return config.docs[doc].languages[lang].repo
}

export function getStable(doc) {
  return config.docs[doc].stable
}

function renameVersion(version, stable) {
  switch (version) {
    case 'master':
      return 'dev'
    case stable:
      return 'stable'
    default:
      return version.replace('release-', 'v')
  }
}

export function renameVersionByDoc(doc, version) {
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

function genDocCategory(slug, separator = '/') {
  const [name, branch] = slug.split('/')

  return `${name}${separator}${renameVersionByDoc(name, branch)}`
}

export function genTOCSlug(slug) {
  return `${slug.split('/').slice(0, 3).join('/')}/TOC`
}

export function genPDFDownloadURL(slug, lang) {
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
export function replacePath(slug, name, lang, pathWithoutVersion) {
  const docPath = genDocCategory(slug)
  lang = lang === 'en' ? '' : '/' + lang

  if (name === '_index') {
    return `${lang}/${docPath}`
  }

  return `${lang}/${docPath}/${pathWithoutVersion}`
}
