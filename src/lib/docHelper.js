const { defaultDocInfo } = require('../state')

/**
 * Get repo info(repo name, branch, pathPrefix) from relativeDir
 */
exports.getRepoInfo = function (relativeDir, locale) {
  const splitPaths = relativeDir.split('/')
  let repo = ''
  let owner = ''
  let hasPathPrefix = false
  const docsType = splitPaths[0]

  switch (docsType) {
    case 'docs-tidb':
      repo = locale === 'zh' ? 'docs-cn' : 'docs'
      break

    case 'docs-dbaas':
      owner = 'tidbcloud'
      repo = 'dbaas-docs'
      break

    case 'docs-dev-guide':
      repo = 'dev-guide'
      hasPathPrefix = true
      break

    default:
      hasPathPrefix = true
      repo = docsType
  }

  let pathPrefix = splitPaths.slice(2).join('/')
  pathPrefix = pathPrefix ? pathPrefix + '/' : ''

  return {
    owner: owner || 'pingcap',
    repo: repo,
    ref: splitPaths[1], // master, release-1
    pathPrefix: hasPathPrefix ? `${locale}/${pathPrefix}` : pathPrefix,
  }
}
