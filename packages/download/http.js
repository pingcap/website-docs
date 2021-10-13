import axios from 'axios'
import dotenv from 'dotenv'
import nPath from 'path'
import sig from 'signale'

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
