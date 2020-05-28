const replaceStream = require('replacestream')

const BASE_IMAGE_CDN_URL = 'https://download.pingcap.com/images'
const DOCS_IMAGE_CDN_URL = BASE_IMAGE_CDN_URL + '/docs'
const DOCS_CN_IMAGE_CDN_URL = BASE_IMAGE_CDN_URL + '/docs-cn'
const TIDB_IN_KUBERNETES_IMAGE_CDN_URL =
  BASE_IMAGE_CDN_URL + '/tidb-in-kubernetes'
const TIDB_DATA_MIGRATION_IMAGE_CDN_URL =
  BASE_IMAGE_CDN_URL + '/tidb-data-migration'

function createReplaceImagePathStream(replaced) {
  return replaceStream(/\(\/?media\//g, `(${replaced}/`)
}

function createReplaceCopyableStream() {
  return replaceStream(/{{<\scopyable.+>}}/g, '')
}

const ignorePaths = [
  '.circleci',
  '.github',
  'media',
  'resources',
  'scripts',
  'templates',
  'CONTRIBUTING.md',
  'README.md',
  'contribute.md',
]

function shouldIgnorePath(path) {
  if (ignorePaths.includes(path)) {
    return true
  }

  // Temporarily ignore docs-tidb-operator => api-references.md
  if (path === 'api-references.md') {
    return true
  }

  return false
}

module.exports = {
  DOCS_IMAGE_CDN_URL,
  DOCS_CN_IMAGE_CDN_URL,
  TIDB_IN_KUBERNETES_IMAGE_CDN_URL,
  TIDB_DATA_MIGRATION_IMAGE_CDN_URL,
  createReplaceImagePathStream,
  createReplaceCopyableStream,
  shouldIgnorePath,
}
