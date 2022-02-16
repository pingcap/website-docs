require('ts-node').register({ transpileOnly: true })

const path = require('path')

const { createDocs } = require('./gatsby/create-pages')

exports.createPages = async ({ graphql, actions }) => {
  await createDocs({ graphql, actions })
  actions.createPage({
    path: '/search',
    component: path.resolve(__dirname, './src/templates/search/index.tsx'),
  })
  actions.createPage({
    path: '/404',
    component: path.resolve(__dirname, './src/templates/404/index.tsx'),
  })
}

exports.createSchemaCustomization = ({ actions }) => {
  const { createTypes } = actions

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
}
