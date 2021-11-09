import { getContent, http } from './http.js'

import fs from 'fs'
import sig from 'signale'
import stream from 'stream'

const IMAGE_CDN_PREFIX = 'https://download.pingcap.com/images'
export const imageCDNs = {
  docs: IMAGE_CDN_PREFIX + '/docs',
  'docs-cn': IMAGE_CDN_PREFIX + '/docs-cn',
  'docs-dm': IMAGE_CDN_PREFIX + '/tidb-data-migration',
  'docs-tidb-operator': IMAGE_CDN_PREFIX + '/tidb-in-kubernetes',
  'docs-dbaas': IMAGE_CDN_PREFIX + '/tidbcloud',
  'docs-appdev': IMAGE_CDN_PREFIX + '/appdev',
}

/**
 * Retrieve all MDs recursively.
 *
 * @export
 * @param {Object} metaInfo
 * @param {string} metaInfo.repo - Short for owner/repo
 * @param {string} metaInfo.path - Subpath to the repository
 * @param {string} metaInfo.ref - which branch
 * @param {string} destDir - destination
 * @param {Object} [options]
 * @param {string[]} [options.ignore] - Specify the files to be ignored
 * @param {Array} [options.pipelines]
 */
export async function retrieveAllMDs(metaInfo, destDir, options) {
  const { repo, ref, path = '' } = metaInfo
  const { ignore = [], pipelines = [] } = options

  const data = (await getContent(repo, ref, path)).data

  // Create destDir if not exist
  if (data && !fs.existsSync(destDir)) {
    fs.mkdirSync(destDir, { recursive: true })
  }

  if (Array.isArray(data)) {
    data.forEach(d => {
      const { type, name, download_url } = d
      const nextDest = `${destDir}/${name}`

      if (ignore.includes(name)) {
        return
      }

      if (type === 'dir') {
        if (!fs.existsSync(nextDest)) {
          fs.mkdirSync(nextDest)
        }

        retrieveAllMDs(
          {
            repo,
            ref,
            path: `${path}/${name}`,
          },
          nextDest,
          options
        )
      } else {
        if (name.endsWith('.md')) {
          writeContent(download_url, nextDest, pipelines)
        }
      }
    })
  } else {
    if (data.name.endsWith('.md')) {
      writeContent(data.download_url, `${destDir}/${data.name}`, pipelines)
    }
  }
}

/**
 * Generate destination. If a path is provided, special handling will be performed.
 *
 * @export
 * @param {string} repo
 * @param {string} path
 * @param {string} destDir
 */
export function genDest(repo, path, destDir, sync) {
  if (
    [
      'pingcap/docs-dm',
      'pingcap/docs-tidb-operator',
      'pingcap/docs-appdev',
    ].includes(repo)
  ) {
    const pathArr = path.split('/')
    const lang = pathArr[0]
    const pathWithoutLang = pathArr.slice(1).join('/')

    if (sync) {
      destDir = destDir.replace('en', lang)
    }

    return `${destDir}${pathWithoutLang ? '/' + pathWithoutLang : ''}`
  }

  return path ? `${destDir}/${path}` : destDir
}

/**
 * Write content through streams.
 *
 * @export
 * @param {string} url
 * @param {fs.PathLike} destPath
 * @param {Array} [pipelines=[]]
 */
export async function writeContent(url, destPath, pipelines = []) {
  const readableStream = stream.Readable.from((await http.get(url)).data)
  const writeStream = fs.createWriteStream(destPath)
  writeStream.on('close', () => sig.success('Downloaded:', url))

  stream.pipeline(readableStream, ...pipelines.map(p => p()), writeStream)
}
