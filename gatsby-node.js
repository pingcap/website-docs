require('ts-node').register({ transpileOnly: true })

const { createDocs } = require('./gatsby/create-pages')

exports.createPages = async ({ graphql, actions }) => {
  await createDocs({ graphql, actions })
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
