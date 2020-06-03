/**
 * Get repo info(repo name, branch, pathPrefix) from relativeDir
 */
exports.getRepoInfo = function (relativeDir, locale) {
  const splitPaths = relativeDir.split('/')
  const isDocs = splitPaths[0] === 'docs-tidb'
  const repo = isDocs ? (locale === 'zh' ? 'docs-cn' : 'docs') : splitPaths[0]
  let pathPrefix = splitPaths.slice(2).join('/')
  pathPrefix = pathPrefix ? pathPrefix + '/' : ''
  return {
    repo: repo, // doc-cn,
    ref: splitPaths[1], // master, release-1
    pathPrefix: isDocs ? pathPrefix : `${locale}/${pathPrefix}`,
  }
}
