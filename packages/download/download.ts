import { genDest, imageCDNs, retrieveAllMDs } from './utils.js'
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

function genOptions(repo: string, config, dryRun: boolean) {
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

function renameDoc(repo: string) {
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
    case 'pingcap/docs':
    case 'pingcap/docs-cn':
      retrieveAllMDs(
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
    case 'pingcap/docs-dm':
    case 'pingcap/docs-tidb-operator':
    case 'tidbcloud/dbaas-docs':
      retrieveAllMDs(
        {
          repo,
          path,
          ref,
        },
        genDest(repo, path, nPath.resolve(dest, `en/tidbcloud/${ref}`)),
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
  }
}

export function gen(argv) {
  const { repo, ref, from, output } = argv
  const repoDest = `${nPath.dirname(from)}/${repo}`

  if (!fs.existsSync(repoDest)) {
    sig.start('Clone', repoDest, '...')

    execSync(
      `git clone https://github.com/${repo}.git ${repoDest} --branch ${ref} --depth 1`
    )
  }

  genContentFromOutline(repo, from, output)
}
