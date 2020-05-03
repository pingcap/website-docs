const axios = require('axios').default

const GITHUB_AUTHORIZATION_TOKEN = process.env.GITHUB_AUTHORIZATION_TOKEN
const baseURL = 'https://api.github.com'
const defaultHeaders = {
  Accept: 'application/vnd.github.v3.raw+json',
}

const http = axios.create({
  baseURL,
  headers: GITHUB_AUTHORIZATION_TOKEN
    ? {
        ...defaultHeaders,
        Authorization: `token ${GITHUB_AUTHORIZATION_TOKEN}`,
      }
    : defaultHeaders,
})

module.exports = http
