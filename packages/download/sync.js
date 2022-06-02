import { genDest, writeContent } from './utils.js'

import { compare, http } from './http.js'
import fs from 'fs'
import sig from 'signale'

/**
 * Synchronize doc changes between base and head.
 *
 * @export
 * @param {Object} metaInfo
 * @param {string} metaInfo.repo - Short for owner/repo
 * @param {string} metaInfo.base
 * @param {string} metaInfo.head
 * @param {Object} [options]
 * @param {string[]} [options.ignore] - Specify the files to be ignored
 * @param {Array} [options.pipelines]
 */
export async function handleSync(metaInfo, destDir, options) {
  const { repo, base, head } = metaInfo
  const { ignore = [], pipelines = [], dryRun } = options

  let files
  try {
    files = (await compare(repo, base, head)).data.files
  } catch (err) {
    throw err
  }

  // TODO: use patch directly
  await Promise.all(
    files.map(async file => {
      const { filename, status, contents_url, previous_filename } = file

      const { download_url } = (await http.get(contents_url)).data

      if (dryRun) {
        sig.debug('dryRun:', status, filename)

        return
      }

      if (
        ignore.includes(filename) ||
        ignore.some(i => filename.startsWith(i)) ||
        !filename.endsWith('.md')
      ) {
        return
      }

      const dest = genDest(repo, filename, destDir, true)

      switch (status) {
        case 'added':
        case 'modified':
          writeContent(download_url, dest, pipelines)

          break
        case 'removed':
          fs.unlink(dest, err => {
            if (err) {
              sig.error(`Fail to unlink ${dest}: ${err}`)
            } else {
              sig.success(`Removed: ${dest}`)
            }
          })

          break
        case 'renamed':
          writeContent(download_url, dest, pipelines)

          const previous = genDest(repo, previous_filename, destDir)
          fs.unlink(previous, err => {
            if (err) {
              sig.error(`Fail to unlink ${previous}: ${err}`)
            } else {
              sig.success(`Renamed: ${previous} => ${dest}`)
            }
          })

          break
      }
    })
  )
}
