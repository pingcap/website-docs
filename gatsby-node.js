require('ts-node').register({ transpileOnly: true })

const path = require('path')

const { createDocs } = require('./gatsby/create-pages')
const { mdxAstToToc } = require('./gatsby/toc')
const { generateConfig } = require('./gatsby/path')

exports.createPages = async ({ graphql, actions }) => {
  await createDocs({ graphql, actions })
  actions.createPage({
    path: '/search',
    component: path.resolve(__dirname, './src/search/index.tsx'),
  })
  actions.createPage({
    path: '/404',
    component: path.resolve(__dirname, './src/404/index.tsx'),
  })
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes, createFieldExtension } = actions

  const typeDefs = `
    """
    Markdown Node
    """
    type Mdx implements Node @dontInfer {
      frontmatter: Frontmatter
    }

    """
    Markdown Frontmatter
    """
    type Frontmatter {
      title: String!
      summary: String
      aliases: [String!]
      draft: Boolean
    }
  `

  createTypes(typeDefs)

  createFieldExtension({
    name: 'navigation',
    extend(_) {
      return {
        async resolve(mdxNode, args, context, info) {
          const types = info.schema.getType('Mdx').getFields()
          const slug = await types['slug'].resolve(mdxNode, args, context, {
            fieldName: 'slug',
          })

          const mdxAST = await types['mdxAST'].resolve(mdxNode, args, context, {
            fieldName: 'mdxAST',
          })

          if (!slug.endsWith('TOC')) return []
          const config = generateConfig(slug)
          const res = mdxAstToToc(
            mdxAST.children.find(node => node.type === 'list').children,
            config
          )
          return res
        },
      }
    },
  })
  createTypes(`
    type Mdx implements Node {
      navigation: JSON! @navigation
    }
  `)
}
