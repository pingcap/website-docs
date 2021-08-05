import { getContent, http } from './http.js'

import fs from 'fs'
import sig from 'signale'
import stream from 'stream'

/**
 * Write content through streams.
 *
 * @param {string} url
 * @param {fs.PathLike} destPath
 * @param {*} [pipelines=[]]
 */
async function writeContent(url, destPath, pipelines = []) {
  const writeStream = fs.createWriteStream(destPath)
  writeStream.on('close', () => sig.success('Downloaded:', url))

  let readableStream = stream.Readable.from((await http.get(url)).data)
  if (pipelines.length) {
    pipelines.forEach((p) => (readableStream = readableStream.pipe(p())))
  }

  readableStream.pipe(writeStream)
}

/**
 * Retrieve all MDs recursively.
 *
 * @param {*} metaInfo
 * @param {string} destDir
 * @param {*} [pipelines=[]]
 */
export async function retrieveAllMDs(metaInfo, destDir, pipelines = []) {
  const { repo, path, ref } = metaInfo
  const dest = path ? `${destDir}/${path}` : destDir

  const data = (await getContent(repo, ref, path)).data

  // Create destDir if not exist
  if (data && !fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true })
  }

  if (Array.isArray(data)) {
    data.forEach((d) => {
      const { type, name, download_url } = d
      const nextDest = `${dest}/${name}`

      // if (shouldIgnorePath(name)) {
      //   return
      // }

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
          pipelines
        )
      } else {
        if (name.endsWith('.md')) {
          writeContent(download_url, nextDest, pipelines)
        }
      }
    })
  } else {
    if (data.name.endsWith('.md')) {
      writeContent(data.download_url, `${dest}/${data.name}`, pipelines)
    }
  }
}
