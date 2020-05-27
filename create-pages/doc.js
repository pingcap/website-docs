const path = require('path')
const {
  replacePath,
  genPathPrefix,
  genTOCPath,
  genDownloadPDFURL,
} = require('./utils')

const createDocs = async ({ graphql, createPage, createRedirect }) => {
  const docTemplate = path.resolve(`${__dirname}/../src/templates/doc.js`)

  const docsEn = await graphql(`
    query {
      allMdx(
        filter: {
          fields: { langCollection: { eq: "markdown-pages/contents/en" } }
          fileAbsolutePath: { regex: "/^(?!.*TOC).*$/" }
          frontmatter: { draft: { ne: true } }
        }
      ) {
        nodes {
          id
          fields {
            langCollection
          }
          frontmatter {
            aliases
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
          frontmatter: { draft: { ne: true } }
        }
      ) {
        nodes {
          id
          fields {
            langCollection
          }
          frontmatter {
            aliases
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
          relativeDir,
          base,
          tocPath,
          locale,
          downloadURL: `${genDownloadPDFURL(relativeDir, locale)}`,
          pathPrefix: genPathPrefix(relativeDir, locale),
        },
      })

      // create redirect
      if (node.frontmatter.aliases) {
        const aliasesArr = node.frontmatter.aliases

        aliasesArr.forEach((alias) => {
          createRedirect({
            fromPath: `${alias}`,
            toPath: `${pathPrefix}${replacePath(relativeDir, base)}`,
            isPermanent: true,
          })
        })
      }
    })
  }

  _createDocs(docsEn, 'en')
  _createDocs(docsZh, 'zh', '/zh')
}

module.exports = createDocs
