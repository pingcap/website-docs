#!/usr/bin/env node

import { exec } from 'child_process'
import fs from 'fs'
import { genContentFromOutline } from './generator.js'
import { hideBin } from 'yargs/helpers'
import nPath from 'path'
import { retrieveAllMDs } from './utils.js'
import sig from 'signale'
import yargs from 'yargs'

const argv = yargs(hideBin(process.argv))
  .command(
    'download <repo> [path] [ref]',
    'specify which repo of docs you want to download',
    (yargs) => {
      yargs
        .positional('path', {
          desc: 'Specify the subpath of the repo',
          type: 'string',
        })
        .positional('ref', {
          desc: 'Specify the branch of the repo',
          type: 'string',
          default: 'master',
        })
    }
  )
  .command(
    [
      'generate <repo> [ref] <from> [output]',
      'gen <repo> [ref] <from> [output]',
    ],
    'generate content from a outline',
    (yargs) => {
      yargs
        .positional('ref', {
          desc: 'Specify the branch of the repo',
          type: 'string',
          default: 'master',
        })
        .positional('output', {
          desc: 'Specify the output name',
          type: 'string',
        })
    }
  )
  .options({
    destination: {
      alias: 'dest',
      desc: 'The root directory where documents are stored',
      type: 'string',
      default: 'contents',
    },
    debug: {
      alias: 'd',
      desc: 'Print debug information at runtime',
      type: 'boolean',
      default: false,
    },
  })
  .help()
  .alias('help', 'h').argv

if (argv.debug) {
  sig.debug('Argv:', argv)
}
switch (argv._[0]) {
  case 'download':
    download(argv)

    break
  case 'generate':
  case 'gen':
    gen(argv)

    break
}

function download(argv) {
  const { repo, path, ref, destination } = argv
  const dest = nPath.resolve(destination)

  switch (repo) {
    case 'pingcap/docs':
    case 'pingcap/docs-cn':
      retrieveAllMDs(
        {
          repo,
          path,
          ref,
        },
        nPath.resolve(
          dest,
          `${repo.endsWith('-cn') ? 'zh' : 'en'}/docs-tidb/${ref}`
        )
      )

      break
  }
}

function gen(argv) {
  const { repo, ref, from, to } = argv
  const repoDest = `${nPath.dirname(from)}/${repo}`

  if (!fs.existsSync(repoDest)) {
    sig.start('Clone', repoDest, '...')

    exec(
      `git clone https://github.com/${repo}.git ${repoDest} --branch ${ref} --depth 1`,
      () => {
        genContentFromOutline(repo, from, to)
      }
    )
  } else {
    genContentFromOutline(repo, from, to)
  }
}
