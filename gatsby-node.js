const createDocs = require('./create-pages/doc')

exports.createPages = async ({ graphql, actions }) => {
  const { createPage, createRedirect } = actions

  createDocs({ graphql, createPage, createRedirect })
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
