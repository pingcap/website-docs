const originalVersionRegex = /release-\d+(\.\d+)+/
const masterRegex = /master/

function renameDoc(name) {
  switch (name) {
    case 'docs-tidb':
      return 'tidb'
    case 'docs-tidb-operator':
      return 'tidb-in-kubernetes'
    case 'docs-dm':
      return 'tidb-data-migration'
    default:
      return name
  }
}

function renameDocVersion(version) {
  if (version.match(masterRegex)) {
    return 'dev'
  } else if (version.match(originalVersionRegex)) {
    return version.replace('release-', 'v')
  } else {
    return version
  }
}

function genDocPath(relativeDir, needRename = true) {
  const splitPaths = relativeDir.split('/')
  const docName = needRename ? renameDoc(splitPaths[0]) : splitPaths[0]
  const docVersion = needRename
    ? renameDocVersion(splitPaths[1])
    : splitPaths[1]

  return `${docName}/${docVersion}`
}

exports.genDownloadURL = function (relativeDir, locale) {
  const docPath = genDocPath(relativeDir).replace('/', '-')

  return `${docPath}-${locale}-manual.pdf`
}

/**
 * Replace path by relativeDir and file basename.
 *
 * @param {string} relativeDir - GraphQL generated string.
 * @param {string} base - GraphQL generated string.
 * @returns {string} - Replaced path.
 */
exports.replacePath = function (relativeDir, base) {
  const docPath = genDocPath(relativeDir)
  const baseName = base.replace('.md', '')

  if (baseName === '_index') {
    return `/${docPath}`
  }

  return `/${docPath}/${baseName}`
}

exports.genPathPrefix = function (relativeDir, locale) {
  return `${locale === 'en' ? '' : `/${locale}`}/${genDocPath(relativeDir)}/`
}

/**
 * Generate TOC path by relativeDir.
 *
 * @param {string} relativeDir - GraphQL generated string.
 * @returns {string} - The string of TOC path.
 */
exports.genTOCPath = function (relativeDir) {
  return `${genDocPath(relativeDir, false)}/TOC.md`
}
