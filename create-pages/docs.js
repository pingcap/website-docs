const path = require('path')
const replacePath = require('./utils').replacePath
const tocDir = require('./utils').tocDir

const createDocs = async ({ graphql, createPage }) => {
  const docsTemplate = path.resolve(`${__dirname}/../src/templates/doc.js`)

  const docsEn = await graphql(`
    query {
      allMdx(
        filter: {
          fields: {
            langCollection: { eq: "markdown-pages/contents/en" }
            base: { base: { ne: "TOC.md" } }
          }
        }
      ) {
        edges {
          node {
            id
            fields {
              relativePath
              base {
                base
              }
              langCollection
            }
          }
        }
      }
    }
  `)

  const docsZh = await graphql(`
    query {
      allMdx(
        filter: {
          fields: {
            langCollection: { eq: "markdown-pages/contents/zh" }
            base: { base: { ne: "TOC.md" } }
          }
        }
      ) {
        edges {
          node {
            id
            fields {
              relativePath
              base {
                base
              }
              langCollection
            }
          }
        }
      }
    }
  `)

  // create pages for different language docs
  docsEn.data.allMdx.edges.forEach(({ node }) => {
    createPage({
      path: `/${replacePath(node.fields.relativePath, node.fields.base.base)}`,
      component: docsTemplate,
      context: {
        id: node.id,
        relativePath: `${tocDir(node.fields.relativePath)}`,
        langCollection: node.fields.langCollection,
      },
    })
  })

  docsZh.data.allMdx.edges.forEach(({ node }) => {
    createPage({
      path: `/zh/${replacePath(
        node.fields.relativePath,
        node.fields.base.base
      )}`,
      component: docsTemplate,
      context: {
        id: node.id,
        relativePath: `${tocDir(node.fields.relativePath)}`,
        langCollection: node.fields.langCollection,
      },
    })
  })
}

module.exports = createDocs
