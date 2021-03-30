const fs = require('fs')
const sig = require('signale')
const http = require('./http')
const axios = require('axios').default
const toReadableStream = require('to-readable-stream')
const { shouldIgnorePath } = require('./utils')

function getContents(owner, repo, ref, path = '') {
  const url = `/repos/${owner}/${repo}/contents${
    path.startsWith('/') ? path : `/${path}`
  }`

  sig.info(`getContents URL: ${url}, ref: ${ref}`)

  return http.get(url, {
    params: {
      ref,
    },
  })
}

function getCommitInfo(owner, repo, base, head) {
  const url = `/repos/${owner}/${repo}/compare/${base}...${head}`

  sig.info(`getCommitInfo URL: ${url}`)

  return http.get(url)
}

async function writeContent(url, distPath, pipelines = []) {
  const writeStream = fs.createWriteStream(distPath)
  writeStream.on('close', () => sig.success(`Downloaded: ${url}`))

  let readableStream = toReadableStream((await http.get(url)).data)
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

    if (shouldIgnorePath(name)) {
      return
    }

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

function generateDistPath(lang, repo, ref, path) {
  let filePathWitoutLang = path
  let filename = '/' + filePathWitoutLang.slice(-1)[0]
  let repoDirPath = `${__dirname}/contents/${lang}/${repo}/${ref}`

  if (filePathWitoutLang.length > 1) {
    filePathWitoutLang.splice(-1, 1)
    const subDir = '/' + filePathWitoutLang.join('/')
    repoDirPath = repoDirPath + subDir

    if (!fs.existsSync(repoDirPath)) {
      fs.mkdirSync(repoDirPath, { recursive: true })
    }
  }

  return repoDirPath + filename
}

async function handleSync(metaInfo, pipelines = []) {
  const { owner, repo, ref, base, head } = metaInfo
  if (base && head) {
    const { files } = (await getCommitInfo(owner, repo, base, head)).data

    files.forEach((file) => {
      const { filename, status, contents_url, previous_filename } = file
      if (shouldIgnorePath(filename)) {
        return
      }

      let downloadToPath,
        renamedFilePath,
        renamedFilePathArrWithoutLang,
        lang,
        finalRepo

      let downloadToPathArrWithoutLang = filename.split('/')

      switch (repo) {
        case 'docs-dm':
        case 'docs-tidb-operator':
          downloadToPathArrWithoutLang = downloadToPathArrWithoutLang.slice(1)
          lang = filename.substring(0, 2)
          finalRepo = repo

          break

        case 'dbaas-docs':
          finalRepo = 'docs-dbaas'
          lang = 'en'
          break

        case 'docs':
          finalRepo = 'docs-tidb'
          lang = 'en'
          break

        case 'docs-cn':
          lang = 'zh'
          finalRepo = 'docs-tidb'
          break

        case 'dev-guide':
          downloadToPathArrWithoutLang = downloadToPathArrWithoutLang.slice(1)
          lang = filename.substring(0, 2)
          finalRepo = 'docs-dev-guide'
          break

        default:
          break
      }

      downloadToPath = generateDistPath(
        lang,
        finalRepo,
        ref,
        downloadToPathArrWithoutLang
      )

      switch (status) {
        case 'added':
        case 'modified':
          writeContent(contents_url, downloadToPath, pipelines)

          break
        case 'removed':
          fs.unlink(downloadToPath, (err) => {
            if (err) {
              sig.error(`Fail to unlink ${downloadToPath}: ${err}`)
            } else {
              sig.success(`Deleted: ${downloadToPath}`)
            }
          })

          break
        case 'renamed':
          renamedFilePathArrWithoutLang = previous_filename.split('/')
          if (
            repo === 'docs-tidb-operator' ||
            repo === 'docs-dm' ||
            repo === 'dev-guide'
          ) {
            renamedFilePathArrWithoutLang = renamedFilePathArrWithoutLang.slice(
              1
            )
          }
          renamedFilePath = generateDistPath(
            lang,
            finalRepo,
            ref,
            renamedFilePathArrWithoutLang
          )
          writeContent(contents_url, downloadToPath, pipelines)
          fs.unlink(renamedFilePath, (err) => {
            if (err) {
              sig.error(`Fail to unlink ${renamedFilePath}: ${err}`)
            } else {
              sig.success(`Deleted: ${renamedFilePath}`)
            }
          })

          break
        default:
          break
      }
    })
  }
}

module.exports = {
  writeContent,
  retrieveAllMDs,
  handleSync,
}
