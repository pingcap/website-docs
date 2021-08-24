import { imageCDNs, retrieveAllMDs } from './utils.js'
import {
  replaceCopyableStream,
  replaceImagePathStream,
  replaceTabsPanelStream,
} from '@pingcap/docs-content'

import { execSync } from 'child_process'
import fs from 'fs'
import { genContentFromOutline } from './gen.js'
import { handleSync } from './sync.js'
import nPath from 'path'
import rimraf from 'rimraf'
import sig from 'signale'

function genOptions(repo, config) {
  const options = {
    pipelines: [
      () => replaceImagePathStream(imageCDNs[repo.split('/')[1]]),
      replaceCopyableStream,
      replaceTabsPanelStream,
    ],
  }

  if (config) {
    options.ignore = JSON.parse(fs.readFileSync(config)).ignore
  }

  return options
}

export function download(argv) {
  const { repo, path, ref, destination, config } = argv
  const dest = nPath.resolve(destination)
  const options = genOptions(repo, config)

  switch (repo) {
    case 'pingcap/docs':
    case 'pingcap/docs-cn':
      retrieveAllMDs(
        {
          repo,
          path,
          ref,
        },
        nPath.resolve(
          dest,
          `${repo.endsWith('-cn') ? 'zh' : 'en'}/docs-tidb/${ref}`
        ),
        options
      )

      break
    case 'pingcap/docs-dm':
    case 'pingcap/docs-tidb-operator':
    case 'pingcap/docs-dev-guide':
      if (!path) {
        sig.warn(
          'For docs-dm/docs-tidb-operator/docs-dev-guide, you must provide en or zh path.'
        )

        return
      }

      retrieveAllMDs(
        {
          repo,
          path,
          ref,
        },
        nPath.resolve(
          dest,
          `${path.split('/')[0]}/${repo.split('/')[1]}/${ref}`
        ),
        options
      )

      break
    case 'tidbcloud/dbaas-docs':
      retrieveAllMDs(
        {
          repo,
          path,
          ref,
        },
        nPath.resolve(dest, `en/docs-dbaas/${ref}`),
        options
      )

      break
  }
}

export const clean = rimraf

export function sync(argv) {
  const { repo, ref, base, head, destination, config } = argv
  const dest = nPath.resolve(destination)
  const options = genOptions(repo, config)

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
          `${repo.endsWith('-cn') ? 'zh' : 'en'}/docs-tidb/${ref}`
        ),
        options
      )

      break
    case 'pingcap/docs-dm':
    case 'pingcap/docs-tidb-operator':
    case 'pingcap/docs-dev-guide':
      handleSync(
        {
          repo,
          ref,
          base,
          head,
        },
        nPath.resolve(
          dest,
          `${path.split('/')[0]}/${repo.split('/')[1]}/${ref}`
        ),
        options
      )

      break
    case 'tidbcloud/dbaas-docs':
      handleSync(
        {
          repo,
          ref,
          base,
          head,
        },
        nPath.resolve(dest, `en/docs-dbaas/${ref}`),
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
      `git clone https://github.com/${repo}.git ${repoDest} --branch ${ref} --depth 1`
    )
  }

  genContentFromOutline(repo, from, output)
}
