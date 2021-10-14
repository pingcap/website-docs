const yargs = require('yargs')
const sig = require('signale')
const { retrieveAllMDs, handleSync, writeContent } = require('./download')
const {
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
} = require('./utils')

const argv = yargs
  .command(
    'download <repo> [path] [ref]',
    'specify which repo of docs you want to download'
  )
  .command(
    'sync <repo> <ref> <base> <head>',
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
    case 'local-test':
      ;['_index.md', 'TOC.md', 'views.md'].forEach((m) => {
        writeContent(
          'https://raw.githubusercontent.com/pingcap/docs/master/' + m,
          `${__dirname}/contents/en/docs-tidb/${ref}/${m}`,
          [
            () => createReplaceImagePathStream(DOCS_IMAGE_CDN_URL),
            () => createReplaceCopyableStream(),
            () => createReplaceTabPanelStream(),
            // () => createReplaceTrailingWhiteSpaceStream(),
          ]
        )
      })
      break

    case 'docs':
      retrieveAllMDs(
        {
          owner: 'pingcap',
          repo,
          ref,
          path: path ? path : '',
        },
        `${__dirname}/contents/en/docs-tidb/${ref}`,
        [
          () => createReplaceImagePathStream(DOCS_IMAGE_CDN_URL),
          () => createReplaceCopyableStream(),
          () => createReplaceTabPanelStream(),
          // () => createReplaceTrailingWhiteSpaceStream(),
        ]
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
        `${__dirname}/contents/zh/docs-tidb/${ref}`,
        [
          () => createReplaceImagePathStream(DOCS_CN_IMAGE_CDN_URL),
          () => createReplaceCopyableStream(),
          () => createReplaceTabPanelStream(),
          // () => createReplaceTrailingWhiteSpaceStream(),
        ]
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
        [
          () => createReplaceImagePathStream(TIDB_IN_KUBERNETES_IMAGE_CDN_URL),
          () => createReplaceCopyableStream(),
          () => createReplaceTabPanelStream(),
          // () => createReplaceTrailingWhiteSpaceStream(),
        ]
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
        [
          () => createReplaceImagePathStream(TIDB_DATA_MIGRATION_IMAGE_CDN_URL),
          () => createReplaceCopyableStream(),
          () => createReplaceTabPanelStream(),
          // () => createReplaceTrailingWhiteSpaceStream(),
        ]
      )
      break

    case 'docs-dbaas':
      retrieveAllMDs(
        {
          owner: 'tidbcloud',
          repo: 'dbaas-docs',
          ref,
          path: path ? path : '',
        },
        `${__dirname}/contents/en/docs-dbaas/${ref}`,
        [
          () => createReplaceImagePathStream(TIDB_CLOUD_IMAGE_CDN_URL),
          () => createReplaceCopyableStream(),
          () => createReplaceTabPanelStream(),
          // () => createReplaceTrailingWhiteSpaceStream(),
        ]
      )
      break

    case 'dev-guide':
      if (!path) {
        sig.warn(
          'For dev-guide, you must provide the path of en or zh. Details: https://github.com/pingcap/dev-guide'
        )

        return
      }

      retrieveAllMDs(
        {
          owner: 'pingcap',
          repo,
          ref,
          path: path,
        },
        `${__dirname}/contents/${path}/docs-developer/${ref}`,
        [
          () => createReplaceImagePathStream(DEV_GUIDE_IMAGE_CDN_URL),
          () => createReplaceCopyableStream(),
          () => createReplaceTabPanelStream(),
          // () => createReplaceTrailingWhiteSpaceStream(),
        ]
      )
      break

    default:
      break
  }
}

function sync(argv) {
  const repo = argv.repo
  const ref = argv.ref
  const base = argv.base
  const head = argv.head

  sig.info(
    `Sync Info: repo => ${repo} ref => ${ref} base => ${base} head => ${head}`
  )

  switch (repo) {
    case 'docs-tidb-operator':
      handleSync({ owner: 'pingcap', repo, ref, base, head }, [
        () => createReplaceImagePathStream(TIDB_IN_KUBERNETES_IMAGE_CDN_URL),
        () => createReplaceCopyableStream(),
        () => createReplaceTabPanelStream(),
        // () => createReplaceTrailingWhiteSpaceStream(),
      ])
      break

    case 'docs-dm':
      handleSync({ owner: 'pingcap', repo, ref, base, head }, [
        () => createReplaceImagePathStream(TIDB_DATA_MIGRATION_IMAGE_CDN_URL),
        () => createReplaceCopyableStream(),
        () => createReplaceTabPanelStream(),
        // () => createReplaceTrailingWhiteSpaceStream(),
      ])
      break

    case 'dbaas-docs':
      handleSync({ owner: 'tidbcloud', repo, ref, base, head }, [
        () => createReplaceImagePathStream(TIDB_CLOUD_IMAGE_CDN_URL),
        () => createReplaceCopyableStream(),
        () => createReplaceTabPanelStream(),
        // () => createReplaceTrailingWhiteSpaceStream(),
      ])
      break

    case 'docs':
      handleSync({ owner: 'pingcap', repo, ref, base, head }, [
        () => createReplaceImagePathStream(DOCS_IMAGE_CDN_URL),
        () => createReplaceCopyableStream(),
        () => createReplaceTabPanelStream(),
        // () => createReplaceTrailingWhiteSpaceStream(),
      ])
      break

    case 'docs-cn':
      handleSync({ owner: 'pingcap', repo, ref, base, head }, [
        () => createReplaceImagePathStream(DOCS_CN_IMAGE_CDN_URL),
        () => createReplaceCopyableStream(),
        () => createReplaceTabPanelStream(),
        // () => createReplaceTrailingWhiteSpaceStream(),
      ])
      break

    case 'dev-guide':
      handleSync({ owner: 'pingcap', repo, ref, base, head }, [
        () => createReplaceImagePathStream(DEV_GUIDE_IMAGE_CDN_URL),
        () => createReplaceCopyableStream(),
        () => createReplaceTabPanelStream(),
        // () => createReplaceTrailingWhiteSpaceStream(),
      ])
      break
    default:
      break
  }
}
