const replaceStream = require('replacestream')

const BASE_IMAGE_CDN_URL = 'https://download.pingcap.com/images'
const DOCS_IMAGE_CDN_URL = BASE_IMAGE_CDN_URL + '/docs'
const DOCS_CN_IMAGE_CDN_URL = BASE_IMAGE_CDN_URL + '/docs-cn'
const DEV_GUIDE_IMAGE_CDN_URL = BASE_IMAGE_CDN_URL + '/dev-guide'
const TIDB_IN_KUBERNETES_IMAGE_CDN_URL =
  BASE_IMAGE_CDN_URL + '/tidb-in-kubernetes'
const TIDB_DATA_MIGRATION_IMAGE_CDN_URL =
  BASE_IMAGE_CDN_URL + '/tidb-data-migration'
const TIDB_CLOUD_IMAGE_CDN_URL = BASE_IMAGE_CDN_URL + '/tidbcloud'

function createReplaceImagePathStream(replaced) {
  return replaceStream(/\(\/?media\//g, `(${replaced}/`)
}

function createReplaceCopyableStream() {
  return replaceStream(/{{<\scopyable(.+)>}}/g, function (match, copyMsg) {
    return `<WithCopy tag="${copyMsg.replace(/"/g, '').trim()}" />`
  })
}

function createReplaceTabPanelStream() {
  return replaceStream(/{{<\stabs-panel(.+)>}}/g, function (match, letters) {
    return `<TabsPanel letters='${letters.replace(/"|\s/g, '')}' />`
  })
}

function createReplaceTrailingWhiteSpaceStream() {
  return replaceStream(/[ \t]+$/gm, '')
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
  'hack',
  'assets/get-started',
  '.markdownlint.yaml',
  'markdownlint-rules.md',
]

function shouldIgnorePath(path) {
  const startPath = path.split('/')[0]
  if (ignorePaths.includes(startPath)) {
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
  DEV_GUIDE_IMAGE_CDN_URL,
  TIDB_IN_KUBERNETES_IMAGE_CDN_URL,
  TIDB_DATA_MIGRATION_IMAGE_CDN_URL,
  TIDB_CLOUD_IMAGE_CDN_URL,
  createReplaceImagePathStream,
  createReplaceCopyableStream,
  createReplaceTabPanelStream,
  createReplaceTrailingWhiteSpaceStream,
  shouldIgnorePath,
}
