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

// replace docs path
exports.replacePath = function (relativeDir, base) {
  const splitPaths = relativeDir.split('/')
  const docName = renameDoc(splitPaths[0])
  const docVersion = renameDocVersion(splitPaths[1])
  const baseName = base.replace('.md', '')

  return `/${docName}/${docVersion}/${baseName}`
}

exports.genPathPrefix = function (relativeDir, locale) {
  const splitPaths = relativeDir.split('/')
  const docName = renameDoc(splitPaths[0])
  const docVersion = renameDocVersion(splitPaths[1])

  return `${locale === 'en' ? '' : `/${locale}`}/${docName}/${docVersion}/`
}

// concate toc directory
exports.genTOCPath = function (relativeDir) {
  const splitPaths = relativeDir.split('/')
  const docName = splitPaths[0]
  const docVersion = splitPaths[1]

  return `${docName}/${docVersion}/TOC.md`
}
