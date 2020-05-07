const fs = require('fs')
const sig = require('signale')
const http = require('./http')
const axios = require('axios').default
const toReadableStream = require('to-readable-stream')

function getContents(owner, repo, ref, path = '') {
  const url = `/repos/${owner}/${repo}/contents/${path}`

  sig.info(`getContents URL: ${url}, ref: ${ref}`)

  return http.get(url, {
    params: {
      ref,
    },
  })
}

async function writeContent(url, distPath, pipelines = []) {
  const writeStream = fs.createWriteStream(distPath)
  writeStream.on('close', () => sig.success(`Downloaded: ${url}`))

  let readableStream = toReadableStream((await axios.get(url)).data)
  if (pipelines.length) {
    pipelines.forEach((p) => (readableStream = readableStream.pipe(p())))
  }

  readableStream.pipe(writeStream)
}

async function retrieveAllMDs(metaInfo, distDir, pipelines = []) {
  const { owner, repo, ref, path } = metaInfo

  const list = (await getContents(owner, repo, ref, path)).data

  list.forEach((el) => {
    const { name, type, download_url } = el

    if (type === 'dir') {
      const nextDistDir = `${distDir}/${name}`

      if (!fs.existsSync(nextDistDir)) {
        fs.mkdirSync(nextDistDir)
      }

      retrieveAllMDs(
        {
          owner,
          repo,
          ref,
          path: `${path}/${name}`,
        },
        `${distDir}/${name}`,
        pipelines
      )
    } else {
      if (name.endsWith('.md')) {
        writeContent(download_url, `${distDir}/${name}`, pipelines)
      }
    }
  })
}

module.exports = {
  retrieveAllMDs,
}
