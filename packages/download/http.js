import axios from 'axios'
import nPath from 'path'
import sig from 'signale'

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

export function getContent(repo, ref, path = '') {
  const url = nPath.resolve(`/repos/${repo}/contents`, path)

  sig.start(`Get content(ref: ${ref}) from:`, url)

  return http.get(url, {
    params: {
      ref,
    },
  })
}
