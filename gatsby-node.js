/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

const createDocs = require('./create-pages/doc')
const createIntlPages = require('./create-pages/intl')
const createSearchPage = require('./create-pages/search')

exports.onCreateNode = ({ node, actions, getNode }) => {
  const { createNodeField } = actions

  if (node.internal.type === 'Mdx') {
    const fileNode = getNode(node.parent)

    createNodeField({
      node,
      name: 'langCollection',
      value: fileNode.sourceInstanceName,
    })

    createNodeField({
      node,
      name: 'relativePath',
      value: fileNode.relativePath,
    })
  }
}

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  createDocs({ graphql, createPage })
  createSearchPage({ createPage })
}

exports.onCreatePage = ({ page, actions }) => {
  createIntlPages({ page, actions })
}
