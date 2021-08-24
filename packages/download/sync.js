import { genDest, writeContent } from './utils.js'

import { compare } from './http.js'
import fs from 'fs'

/**
 * Synchronize doc changes between base and head.
 *
 * @export
 * @param {Object} metaInfo
 * @param {string} metaInfo.repo - Short for owner/repo
 * @param {string} metaInfo.ref - which branch
 * @param {string} metaInfo.base
 * @param {string} metaInfo.head
 * @param {Object} [options]
 * @param {string[]} [options.ignore] - Specify the files to be ignored
 * @param {Array} [options.pipelines]
 */
export async function handleSync(metaInfo, destDir, options) {
  const { repo, ref, base, head } = metaInfo
  const { ignore = [], pipelines = [] } = options

  let files
  try {
    files = (await compare(repo, base, head)).data.files
  } catch (err) {
    throw err
  }

  files.forEach((file) => {
    const { filename, status, download_url, previous_filename } = file

    if (ignore.includes(filename)) {
      return
    }

    const dest = genDest(repo, filename, destDir)

    switch (status) {
      case 'added':
      case 'modified':
        writeContent(download_url, dest, pipelines)

        break
      case 'removed':
        fs.unlink(dest, (err) => {
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
        fs.unlink(previous, (err) => {
          if (err) {
            sig.error(`Fail to unlink ${previous}: ${err}`)
          } else {
            sig.success(`Renamed: ${previous} => ${dest}`)
          }
        })

        break
    }
  })
}
