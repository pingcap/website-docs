const yargs = require('yargs')
const sig = require('signale')
const { retrieveAllMDs, handleSync } = require('./download')
const {
  DOCS_IMAGE_CDN_URL,
  DOCS_CN_IMAGE_CDN_URL,
  TIDB_IN_KUBERNETES_IMAGE_CDN_URL,
  TIDB_DATA_MIGRATION_IMAGE_CDN_URL,
  createReplaceImagePathStream,
} = require('./utils')

const argv = yargs
  .command(
    'download <repo> [path] [ref]',
    'specify which repo of docs you want to download'
  )
  .command(
    'sync <repo> <ref> <sha>',
    "Sync the docs' changes by a single commit"
  ).argv

switch (argv._[0]) {
  case 'download':
    main(argv)
    break
  case 'sync':
    sync(argv)
    break
  default:
    break
}

function main(argv) {
  const repo = argv.repo
  const path = argv.path
  // If ref is not provided, use master as the default
  const ref = argv.ref || 'master'

  switch (repo) {
    case 'docs':
      retrieveAllMDs(
        {
          owner: 'pingcap',
          repo,
          ref,
          path: path ? path : '',
        },
        // Use docs-special-week branch temporarily
        `${__dirname}/contents/en/docs-tidb/${
          ref === 'docs-special-week' ? 'master' : ref
        }`,
        [() => createReplaceImagePathStream(DOCS_IMAGE_CDN_URL)]
      )

      break
    case 'docs-cn':
      retrieveAllMDs(
        {
          owner: 'pingcap',
          repo,
          ref,
          path: path ? path : '',
        },
        // Use docs-special-week branch temporarily
        `${__dirname}/contents/zh/docs-tidb/${
          ref === 'docs-special-week' ? 'master' : ref
        }`,
        [() => createReplaceImagePathStream(DOCS_CN_IMAGE_CDN_URL)]
      )

      break
    case 'docs-tidb-operator':
      if (!path) {
        sig.warn(
          'For docs-tidb-operator, you must provide the path of en or zh. Details: https://github.com/pingcap/docs-tidb-operator'
        )

        return
      }

      retrieveAllMDs(
        {
          owner: 'pingcap',
          repo,
          ref,
          path,
        },
        `${__dirname}/contents/${path}/docs-tidb-operator/${ref}`,
        [() => createReplaceImagePathStream(TIDB_IN_KUBERNETES_IMAGE_CDN_URL)]
      )

      break
    case 'docs-dm':
      if (!path) {
        sig.warn(
          'For docs-dm, you must provide the path of en or zh. Details: https://github.com/pingcap/docs-dm'
        )

        return
      }

      retrieveAllMDs(
        {
          owner: 'pingcap',
          repo,
          ref,
          path,
        },
        `${__dirname}/contents/${path}/docs-dm/${ref}`,
        [() => createReplaceImagePathStream(TIDB_DATA_MIGRATION_IMAGE_CDN_URL)]
      )

      break
    default:
      break
  }
}

function sync(argv) {
  const repo = argv.repo
  const ref = argv.ref
  const sha = argv.sha

  sig.info(`Sync Info: repo => ${repo} ref => ${ref} sha => ${sha}`)

  switch (repo) {
    case 'docs-tidb-operator':
      handleSync({ owner: 'pingcap', repo, ref, sha }, [
        () => createReplaceImagePathStream(TIDB_IN_KUBERNETES_IMAGE_CDN_URL),
      ])

      break
    case 'docs-dm':
      handleSync({ owner: 'pingcap', repo, ref, sha }, [
        () => createReplaceImagePathStream(TIDB_DATA_MIGRATION_IMAGE_CDN_URL),
      ])

      break
    default:
      break
  }
}
