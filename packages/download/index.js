import {
  genDest,
  imageCDNs,
  retrieveAllMDs,
  retrieveAllMDsFromZip,
  copyFilesFromToc,
  copyDirectorySync,
} from './utils.js'
import {
  replaceCopyableStream,
  replaceImagePathStream,
} from '@pingcap/docs-content'

import { execSync } from 'child_process'
import fs from 'fs'
import { genContentFromOutline } from './gen.js'
import { handleSync } from './sync.js'
import nPath from 'path'
import rimraf from 'rimraf'
import sig from 'signale'

function genOptions(repo, config, dryRun) {
  const options = {
    pipelines: [
      () => replaceImagePathStream(imageCDNs[repo.split('/')[1]]),
      replaceCopyableStream,
    ],
    dryRun,
  }

  if (config) {
    let contents
    try {
      contents = fs.readFileSync(config)
    } catch (err) {
      return options
    }

    options.ignore = JSON.parse(contents).ignore
  }

  return options
}

function renameDoc(repo) {
  switch (repo) {
    case 'pingcap/docs-dm':
      return 'tidb-data-migration'
    case 'pingcap/docs-tidb-operator':
      return 'tidb-in-kubernetes'
  }
}

export function download(argv) {
  const { repo, path, ref, destination, config, dryRun } = argv
  const dest = nPath.resolve(destination)
  const options = genOptions(repo, config, dryRun)

  switch (repo) {
    case 'pingcap/docs-cn':
      retrieveAllMDsFromZip(
        {
          repo,
          path,
          ref,
        },
        genDest(
          repo,
          path,
          nPath.resolve(
            dest,
            `${repo.endsWith('-cn') ? 'zh' : 'en'}/tidb/${ref}`
          )
        ),
        options
      )
      break
    case 'pingcap/docs':
      if (ref.startsWith('i18n-')) {
        const refDataList = ref.split('-')
        refDataList.shift()
        const refLang = refDataList.shift()
        const refVer = refDataList.join('-')
        retrieveAllMDsFromZip(
          {
            repo,
            path,
            ref,
          },
          genDest(repo, path, nPath.resolve(dest, `${refLang}/tidb/${refVer}`)),
          options
        )
      } else {
        retrieveAllMDsFromZip(
          {
            repo,
            path,
            ref,
          },
          genDest(
            repo,
            path,
            nPath.resolve(
              dest,
              `${repo.endsWith('-cn') ? 'zh' : 'en'}/tidb/${ref}`
            )
          ),
          options
        )
      }
      break
    case 'pingcap/docs-dm':
    case 'pingcap/docs-tidb-operator':
      if (!path) {
        sig.warn(
          'For docs-dm/docs-tidb-operator/docs-appdev, you must provide en or zh path.'
        )

        return
      }

      const name = renameDoc(repo)

      retrieveAllMDs(
        {
          repo,
          path,
          ref,
        },
        genDest(
          repo,
          path,
          nPath.resolve(dest, `${path.split('/')[0]}/${name}/${ref}`)
        ),
        options
      )

      break
    default:
      // ! TO REMOVE
      retrieveAllMDsFromZip(
        {
          repo,
          path,
          ref,
        },
        genDest(
          repo,
          path,
          nPath.resolve(
            dest,
            `${repo.endsWith('-cn') ? 'zh' : 'en'}/tidb/master`
          )
        ),
        options
      )
      break
  }
}

export const clean = rimraf

export function sync(argv) {
  const { repo, ref, base, head, destination, config, dryRun } = argv
  const dest = nPath.resolve(destination)
  const options = genOptions(repo, config, dryRun)

  switch (repo) {
    case 'pingcap/docs':
      if (ref.startsWith('i18n-')) {
        const refDataList = ref.split('-')
        refDataList.shift()
        const refLang = refDataList.shift()
        const refVer = refDataList.join('-')
        handleSync(
          {
            repo,
            ref,
            base,
            head,
          },
          nPath.resolve(dest, `${refLang}/tidb/${refVer}`),
          options
        )
      } else {
        handleSync(
          {
            repo,
            ref,
            base,
            head,
          },
          nPath.resolve(dest, `en/tidb/${ref}`),
          options
        )
      }
      break
    case 'pingcap/docs-cn':
      handleSync(
        {
          repo,
          ref,
          base,
          head,
        },
        nPath.resolve(
          dest,
          `${repo.endsWith('-cn') ? 'zh' : 'en'}/tidb/${ref}`
        ),
        options
      )
      break
    case 'pingcap/docs-dm':
    case 'pingcap/docs-tidb-operator':
      const name = renameDoc(repo)

      handleSync(
        {
          repo,
          ref,
          base,
          head,
        },
        nPath.resolve(dest, `en/${name}/${ref}`), // use en as a placeholder
        options
      )

      break
  }
}

export function gen(argv) {
  const { repo, ref, from, output } = argv
  const repoDest = `${nPath.dirname(from)}/${repo}`

  if (!fs.existsSync(repoDest)) {
    sig.start('Clone', repoDest, '...')

    execSync(
      `git clone git@github.com:${repo}.git ${repoDest} --branch ${ref} --depth 1`,
      { stdio: 'inherit' }
    )
  }

  genContentFromOutline(repo, from, output)
}

export function filterCloud(argv) {
  const { repo, path, ref, destination, lang } = argv
  const dest = nPath.resolve(destination)
  const srcPath = genDest(
    repo,
    path,
    nPath.resolve(dest, `${lang}/tidb/${ref}`)
  )
  const destPath = nPath.resolve(dest, `${lang}/tidbcloud/master`)
  copyFilesFromToc(`${srcPath}/TOC-tidb-cloud.md`, `${destPath}`)
  copyDirectorySync(`${srcPath}/tidb-cloud`, `${destPath}/tidb-cloud/`)
  fs.existsSync(`${srcPath}/tidb-cloud`) &&
    fs.rmSync(`${srcPath}/tidb-cloud`, { recursive: true })
}
