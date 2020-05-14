const path = require('path')
const { replacePath, genPathPrefix, genTOCPath } = require('./utils')

const createDocs = async ({ graphql, createPage }) => {
  const docTemplate = path.resolve(`${__dirname}/../src/templates/doc.js`)

  const docsEn = await graphql(`
    query {
      allMdx(
        filter: {
          fields: { langCollection: { eq: "markdown-pages/contents/en" } }
          fileAbsolutePath: { regex: "/^(?!.*TOC).*$/" }
        }
      ) {
        nodes {
          id
          fields {
            langCollection
          }
          parent {
            ... on File {
              relativeDirectory
              base
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
          fields: { langCollection: { eq: "markdown-pages/contents/zh" } }
          fileAbsolutePath: { regex: "/^(?!.*TOC).*$/" }
        }
      ) {
        nodes {
          id
          fields {
            langCollection
          }
          parent {
            ... on File {
              relativeDirectory
              base
            }
          }
        }
      }
    }
  `)

  // create pages for different language docs
  function _createDocs(docs, locale, pathPrefix = '') {
    docs.data.allMdx.nodes.forEach((node) => {
      const parent = node.parent
      const relativeDir = parent.relativeDirectory
      const base = parent.base
      const tocPath = genTOCPath(relativeDir)

      createPage({
        path: `${pathPrefix}${replacePath(relativeDir, base)}`,
        component: docTemplate,
        context: {
          id: node.id,
          langCollection: node.fields.langCollection,
          tocPath,
          locale,
          pathPrefix: genPathPrefix(relativeDir, locale),
        },
      })
    })
  }

  _createDocs(docsEn, 'en')
  _createDocs(docsZh, 'zh', '/zh')
}

module.exports = createDocs
