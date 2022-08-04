import { resolve } from 'path'

import type { CreatePagesArgs } from 'gatsby'
import sig from 'signale'

import { Locale, Repo } from '../src/typing'
import {
  generateConfig,
  generateUrl,
  generateNav,
  generateDocHomeUrl,
} from './path'

export const createDocs = async ({
  actions: { createPage, createRedirect },
  graphql,
}: CreatePagesArgs) => {
  const template = resolve(__dirname, '../src/doc/index.tsx')

  const docs = await graphql<PageQueryData>(`
    {
      allMdx(
        filter: {
          fileAbsolutePath: { regex: "/^(?!.*TOC).*$/" }
          frontmatter: { draft: { ne: true } }
        }
      ) {
        nodes {
          id
          frontmatter {
            aliases
          }
          slug
          parent {
            ... on File {
              relativePath
            }
          }
        }
      }
    }
  `)

  if (docs.errors) {
    sig.error(docs.errors)
  }

  const nodes = docs.data!.allMdx.nodes.map(node => {
    const { config, name, filePath } = generateConfig(node.slug)
    return { ...node, pathConfig: config, name, filePath }
  })

  const versionRecord = nodes.reduce(
    (acc, { pathConfig, name }) => {
      if (acc[pathConfig.locale][pathConfig.repo] == null) {
        acc[pathConfig.locale][pathConfig.repo] = {}
      }

      if (acc[pathConfig.locale][pathConfig.repo][name] == null) {
        acc[pathConfig.locale][pathConfig.repo][name] = []
      }

      acc[pathConfig.locale][pathConfig.repo][name].push(pathConfig.version)

      return acc
    },
    {
      en: {} as Record<Repo, Record<string, (string | null)[]>>,
      zh: {} as Record<Repo, Record<string, (string | null)[]>>,
      ja: {} as Record<Repo, Record<string, (string | null)[]>>,
    }
  )

  nodes.forEach(node => {
    const { id, name, pathConfig, filePath } = node

    const path = generateUrl(name, pathConfig)
    const navUrl = generateNav(pathConfig)

    const locale = [Locale.en, Locale.zh, Locale.ja]
      .map(l =>
        versionRecord[l][pathConfig.repo]?.[name]?.includes(pathConfig.version)
          ? l
          : undefined
      )
      .filter(Boolean)

    createPage({
      path,
      component: template,
      context: {
        id,
        name,
        pathConfig,
        // use for edit in github
        filePath,
        navUrl,
        availIn: {
          locale,
          version: versionRecord[pathConfig.locale][pathConfig.repo][name],
        },
      },
    })

    // create redirects
    if (node.frontmatter.aliases) {
      node.frontmatter.aliases.forEach(fromPath => {
        createRedirect({
          fromPath,
          toPath: path,
          isPermanent: true,
        })
      })
    }
  })
}

export const createCloudAPIReference = async ({
  actions: { createPage, createRedirect },
  graphql,
}: CreatePagesArgs) => {
  const template = resolve(__dirname, '../src/apiReference/index.tsx')
  createPage({
    path: `/tidbcloud/api/v1`,
    component: template,
    context: {},
  })
}

interface PageQueryData {
  allMdx: {
    nodes: {
      id: string
      frontmatter: { aliases: string[] }
      slug: string
    }[]
  }
}

export const createDocHome = async ({
  actions: { createPage, createRedirect },
  graphql,
}: CreatePagesArgs) => {
  const template = resolve(__dirname, '../src/doc/index.tsx')

  const docs = await graphql<PageQueryData>(`
    {
      allMdx(
        filter: {
          fileAbsolutePath: { regex: "/tidb/master/_docHome.md$/" }
          frontmatter: { draft: { ne: true } }
        }
      ) {
        nodes {
          id
          frontmatter {
            aliases
          }
          slug
          parent {
            ... on File {
              relativePath
            }
          }
        }
      }
    }
  `)

  if (docs.errors) {
    sig.error(docs.errors)
  }

  const nodes = docs.data!.allMdx.nodes.map(node => {
    const { config, name, filePath } = generateConfig(node.slug)
    return { ...node, pathConfig: config, name, filePath }
  })

  nodes.forEach(node => {
    const { id, name, pathConfig, filePath, slug } = node
    const path = generateDocHomeUrl(name, pathConfig)
    const navUrl = generateNav(pathConfig)

    const locale = [Locale.en, Locale.zh]

    createPage({
      path,
      component: template,
      context: {
        id,
        name,
        pathConfig,
        // use for edit in github
        filePath,
        navUrl,
        availIn: {
          locale,
          version: [],
        },
      },
    })
  })
}
