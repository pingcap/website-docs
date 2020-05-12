const originalVersionRegx = /release-\d+(\.\d)*/
const masterRegx = /master/

function replaceDocsTypeDir(relativePath) {
  var rp = relativePath
  if (rp.includes('docs-tidb-operator')) {
    rp = rp.replace('docs-tidb-operator', 'tidb-in-kubernetes')
  } else if (rp.includes('docs-dm')) {
    rp = rp.replace('docs-dm', 'tidb-data-migration')
  }

  return rp
}

// replace docs path
exports.replacePath = function (relativePath, basePath) {
  var rp = relativePath
  rp = replaceDocsTypeDir(relativePath)

  if (rp.match(originalVersionRegx)) {
    rp = rp.replace('release-', 'v')
  } else if (rp.match(masterRegx)) {
    rp = rp.replace('master', 'dev')
  }

  const docsType = rp.split('/')[0]
  const docsVersion = rp.split('/')[1]
  rp = docsType + '/' + docsVersion + '/' + basePath

  return rp.replace('.md', '')
}

// concate toc directory
exports.tocDir = function (relativePath) {
  var rp = relativePath

  const docsType = rp.split('/')[0]
  const docsVersion = rp.split('/')[1]
  tocPath = docsType + '/' + docsVersion + '/TOC.md'

  return tocPath
}
