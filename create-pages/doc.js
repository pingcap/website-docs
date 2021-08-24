const path = require('path')
const fs = require('fs')
const {
  replacePath,
  genPathPrefix,
  genTOCPath,
  genDownloadPDFURL,
  genVersionChunks,
} = require('./utils')

const createDocs = async ({ graphql, createPage, createRedirect }) => {
  const docTemplate = path.resolve(`${__dirname}/../src/templates/doc.js`)

  const docsEn = await graphql(`
    query {
      allMdx(
        filter: {
          fields: { langCollection: { eq: "markdown-pages/en" } }
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
              relativePath
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
          fields: { langCollection: { eq: "markdown-pages/zh" } }
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
              relativePath
              base
            }
          }
        }
      }
    }
  `)

  // create pages for different language docs
  function _createDocs(docs, locale, pathPrefix = '') {
    const nodes = docs.data.allMdx.nodes

    // setup map for md versions
    nodes.map((node) => {
      const parent = node.parent
      const relativeDir = parent.relativeDirectory
      const base = parent.base
      const relativePath = parent.relativePath
      node.tocPath = genTOCPath(relativeDir)
      const _fullPath = `${replacePath(relativeDir, base)}`
      const fullPath = `${pathPrefix}${_fullPath}`
      node.path = fullPath
      const filePathInDiffLang = path.resolve(
        `${__dirname}/../markdown-pages/${
          locale === 'en' ? '/zh/' : '/en/'
        }${relativePath}`
      )
      node.langSwitchable = fs.existsSync(filePathInDiffLang) ? true : false
      const vChunks = genVersionChunks(_fullPath)
      node.version = vChunks[0]
      node.pathWithoutVersion = vChunks[1]
      node.downloadURL = `${genDownloadPDFURL(relativeDir, locale)}`
      node.pathPrefix = genPathPrefix(relativeDir, locale)
      return node
    })

    const versionsMap = nodes.reduce((map, { pathWithoutVersion, version }) => {
      const arr = map[pathWithoutVersion]
      if (arr) {
        arr.push(version)
      } else {
        map[pathWithoutVersion] = [version]
      }
      return map
    }, {})

    nodes.forEach((node) => {
      const {
        id,
        path,
        downloadURL,
        pathPrefix,
        tocPath,
        parent,
        langSwitchable,
      } = node
      createPage({
        path: path,
        component: docTemplate,
        context: {
          id,
          langCollection: node.fields.langCollection,
          relativeDir: parent.relativeDirectory,
          base: parent.base,
          tocPath,
          locale,
          pathPrefix,
          downloadURL,
          fullPath: path,
          versions: versionsMap[node.pathWithoutVersion],
          langSwitchable,
        },
      })

      // create redirect
      if (node.frontmatter.aliases) {
        const aliasesArr = node.frontmatter.aliases

        aliasesArr.forEach((alias) => {
          createRedirect({
            fromPath: `${alias}`,
            toPath: path,
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
