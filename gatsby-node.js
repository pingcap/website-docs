/**
 * Implement Gatsby's Node APIs in this file.
 *
 * See: https://www.gatsbyjs.org/docs/node-apis/
 */

// You can delete this file if you're not using it

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

    // a base attribute inside base filed
    createNodeField({
      node,
      name: 'base',
      value: fileNode.base,
    })
  }
}

const createDocs = require('./create-pages/docs')

exports.createPages = async ({ actions, graphql }) => {
  const { createPage } = actions

  createDocs({ graphql, createPage })
}

const createIntlPages = require('./create-pages/intl')

exports.onCreatePage = ({ page, actions }) => {
  createIntlPages({ page, actions })
}
