const fs = require('fs')
const chalk = require('chalk')
const log = console.log
const http = require('./http')
const axios = require('axios').default
const toReadableStream = require('to-readable-stream')

function getContents(owner, repo, ref, path = '') {
  return http.get(`/repos/${owner}/${repo}/contents/${path}`, {
    params: {
      ref,
    },
  })
}

async function writeContent(url, distPath, pipelines = []) {
  const writeStream = fs.createWriteStream(distPath)
  writeStream.on('close', () => {
    log(chalk.blue(`Downloaded: `) + url)
  })

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
      retrieveAllMDs(
        {
          owner,
          repo,
          ref,
          path: `${path}/${name}`,
        },
        `${distDir}/${path}`,
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
