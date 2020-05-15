const originalVersionRegex = /release-\d+(\.\d+)*/
const masterRegex = /master/

function renameDoc(name) {
  switch (name) {
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

// replace docs path
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

// concate toc directory
exports.genTOCPath = function (relativeDir) {
  return `${genDocPath(relativeDir, false)}/TOC.md`
}
