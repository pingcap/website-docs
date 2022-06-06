#!/usr/bin/env node

import { clean, download, gen, sync, filterCloud } from './index.js'

import { hideBin } from 'yargs/helpers'
import sig from 'signale'
import yargs from 'yargs'

const argv = yargs(hideBin(process.argv))
  .command(
    ['download <repo> [path] [ref]', 'dl <repo> [path] [ref]'],
    'specify which repo of docs you want to download',
    yargs => {
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
  .command(['clean <path>', 'cl <path>'], 'use rimraf to delete', yargs =>
    yargs.positional('path', {
      type: 'string',
    })
  )
  .command(
    'sync <repo> [ref] <base> <head>',
    'Synchronize doc changes between base and head',
    yargs => {
      yargs.positional('ref', {
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
    yargs => {
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
  .command(
    'cloud <repo> [path] [ref]',
    'filter cloud files by toc-cloud.md',
    yargs => {
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
        .positional('lang', {
          desc: 'Specify the lang of the repo',
          type: 'string',
          default: 'en',
        })
    }
  )
  .options({
    destination: {
      alias: 'dest',
      desc: 'The root directory where documents are stored',
      type: 'string',
      default: 'markdown-pages',
    },
    config: {
      desc: 'Specify the config',
      type: 'string',
      default: 'docs.json',
    },
    debug: {
      alias: 'd',
      desc: 'Print debug information at runtime',
      type: 'boolean',
      default: false,
    },
    'dry-run': {
      type: 'boolean',
      desc: 'Dry run mode does not download docs',
      default: false,
    },
  })
  .alias('help', 'h')
  .wrap(120).argv

if (argv.debug) {
  sig.debug('Argv:', argv)
}
switch (argv._[0]) {
  case 'download':
  case 'dl':
    download(argv)

    break
  case 'clean':
  case 'cl':
    clean(argv.path, {}, err => {
      if (err) {
        throw err
      }
    })

    break
  case 'sync':
    sync(argv)

    break
  case 'generate':
  case 'gen':
    gen(argv)

    break
  case 'cloud':
    filterCloud(argv)
    break
}
