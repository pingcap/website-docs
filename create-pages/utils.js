const fs = require('fs')
const path = require('path')

const config = JSON.parse(
  fs.readFileSync(path.resolve(__dirname, '../docs.json'))
)

function renameVersion(version, versionStable) {
  if (version === 'master') {
    return 'dev'
  } else if (version === versionStable) {
    return 'stable'
  }

  return version.replace('release-', 'v')
}

function renameVersionByDoc(doc, version) {
  switch (doc) {
    case 'tidb':
    case 'tidb-data-migration':
    case 'tidb-in-kubernetes':
      return renameVersion(version, config.docs[doc].stable)
    case 'tidbcloud':
      return 'public-preview'
    case 'dev-guide':
      return 'dev'
  }
}

function genDocCategory(slug, separator) {
  const [name, branch] = slug.split('/')

  return `${name}${separator}${renameVersionByDoc(name, branch)}`
}

exports.genTOCPath = function (slug) {
  return `${genDocCategory(slug)}/TOC.md`
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
 * @returns {string} - Replaced path.
 */
exports.replacePath = function (slug, name, lang) {
  const docPath = genDocCategory(slug)
  lang = lang === 'en' ? '' : '/' + lang

  if (name === '_index') {
    return `${lang}/${docPath}`
  }

  return `${lang}/${docPath}/${name}`
}
