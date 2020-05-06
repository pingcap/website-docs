const yargs = require('yargs')
const chalk = require('chalk')
const log = console.log
const { retrieveAllMDs } = require('./download')
const {
  DOCS_IMAGE_CDN_URL,
  DOCS_CN_IMAGE_CDN_URL,
  TIDB_IN_KUBERNETES_IMAGE_CDN_URL,
  TIDB_DATA_MIGRATION_IMAGE_CDN_URL,
  createReplaceImagePathStream,
} = require('./utils')

const argv = yargs.command(
  'download <repo> [path] [ref]',
  'specify which repo of docs you want to download'
).argv

const repo = argv.repo
const path = argv.path
const ref = argv.ref

switch (repo) {
  case 'docs-tidb-operator':
    if (!path) {
      return
    }

    retrieveAllMDs(
      {
        owner: 'pingcap',
        repo,
        ref,
        path,
      },
      `${__dirname}/contents/docs-tidb-operator-${path}`,
      [() => createReplaceImagePathStream(TIDB_IN_KUBERNETES_IMAGE_CDN_URL)]
    )
  default:
    break
}
