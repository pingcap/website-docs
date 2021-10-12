const fs = require('fs')
const path = require('path')

const config = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../docs.json'))
)

exports.getRepo = function (doc, lang) {
  return config.docs[doc].languages[lang].repo
}

function getStable(doc) {
  return config.docs[doc].stable
}
exports.getStable = getStable

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

function renameVersionByDoc(doc, version) {
  switch (doc) {
    case 'tidb':
    case 'tidb-data-migration':
    case 'tidb-in-kubernetes':
      return renameVersion(version, getStable(doc))
    case 'tidbcloud':
      return 'public-preview'
    case 'dev-guide':
      return 'dev'
  }
}
exports.renameVersionByDoc = renameVersionByDoc

function genDocCategory(slug, separator = '/') {
  const [name, branch] = slug.split('/')

  return `${name}${separator}${renameVersionByDoc(name, branch)}`
}

exports.genTOCSlug = function (slug) {
  return `${slug.split('/').slice(0, 3).join('/')}/TOC`
}

exports.genPDFDownloadURL = function (slug, lang) {
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
exports.replacePath = function (slug, name, lang, pathWithoutVersion) {
  const docPath = genDocCategory(slug)
  lang = lang === 'en' ? '' : '/' + lang

  if (name === '_index') {
    return `${lang}/${docPath}`
  }

  return `${lang}/${docPath}/${pathWithoutVersion}`
}
