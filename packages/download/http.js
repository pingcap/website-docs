import axios from 'axios'
import dotenv from 'dotenv'
import nPath, { resolve } from 'path'
import sig from 'signale'
import fs from 'fs'

dotenv.config()

const GITHUB_AUTHORIZATION_TOKEN = process.env.GITHUB_AUTHORIZATION_TOKEN
const baseURL = 'https://api.github.com'
const defaultHeaders = {
  Accept: 'application/vnd.github.v3+json',
}

export const http = axios.create({
  baseURL,
  headers: GITHUB_AUTHORIZATION_TOKEN
    ? {
        ...defaultHeaders,
        Authorization: `token ${GITHUB_AUTHORIZATION_TOKEN}`,
      }
    : defaultHeaders,
})

export function getContent(repo, ref, path) {
  const url = nPath.join(`/repos/${repo}/contents`, path)

  sig.start(`Get content(ref: ${ref}) from:`, url)

  return http.get(url, {
    params: {
      ref,
    },
  })
}

export function compare(repo, base, head) {
  const url = `/repos/${repo}/compare/${base}...${head}`

  sig.info(`Compare: ${base}...${head}`)

  return http.get(url)
}

export function downloadFile(reqUrl, fileName = '') {
  return axios({
    method: 'GET',
    url: reqUrl,
    responseType: 'stream',
    headers: GITHUB_AUTHORIZATION_TOKEN
      ? {
          ...defaultHeaders,
          Authorization: `token ${GITHUB_AUTHORIZATION_TOKEN}`,
        }
      : defaultHeaders,
  })
    .then(res => {
      if (res.status == 200) {
        fileName = fileName || reqUrl.split('/').pop()
        const dir = resolve(fileName)
        sig.start(`Download file(fileName: ${fileName}) reqUrl:${reqUrl}`)
        res.data.pipe(fs.createWriteStream(dir))
        // res.data.on('end', () => {
        //   sig.success('download completed')
        // })
        return new Promise((resolve, reject) => {
          res.data.on('end', () => {
            sig.success('download completed')
            resolve()
          })
        })
      } else {
        sig.error(`ERROR >> ${res.status}`)
      }
    })
    .catch(err => {
      sig.error('Error ', err)
    })
}

/**
 * Download latest github repo archive(zip) file by specified repo and branch.
 * @param {string} repo Github repo: pingcap/docs
 * @param {string} ref branch name: master, release-6.0
 * @param {string} fileName output zip file name
 * @returns Promise
 */
export function getArchiveFile(repo, ref, fileName) {
  const url = `https://api.github.com/repos/${repo}/zipball/${ref}`
  sig.start(`Get content(ref: ${ref}) from:`, url)
  return downloadFile(url, fileName)
}
