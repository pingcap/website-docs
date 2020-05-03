const yargs = require('yargs')
const chalk = require('chalk')
const log = console.log

const argv = yargs.command(
  'download <repo> [path]',
  'specify which repo of docs you want to download'
).argv

const repo = argv.repo
const path = argv.path
