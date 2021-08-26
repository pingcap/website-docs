const path = require('path')
const fs = require('fs')
const { replacePath, genTOCPath, genPDFDownloadURL } = require('./utils')

const createDocs = async ({ graphql, createPage, createRedirect }) => {
  const template = path.resolve(__dirname, '../src/templates/doc.js')

  const docs = await graphql(`
    {
      allMdx(
        filter: {
          fileAbsolutePath: { regex: "/^(?!.*TOC).*$/" }
          frontmatter: { draft: { ne: true } }
        }
      ) {
        nodes {
          id
          frontmatter {
            aliases
          }
          slug
          parent {
            ... on File {
              sourceInstanceName
              relativePath
              name
            }
          }
        }
      }
    }
  `)

  const nodes = docs.data.allMdx.nodes.map((node) => {
    const { slug } = node
    const { sourceInstanceName, relativePath, name } = node.parent
    const [topFolder, lang] = sourceInstanceName.split('/') // [markdown-pages, en|zh]

    node.path = replacePath(slug, name, lang)

    const filePathInDiffLang = path.resolve(
      __dirname,
      '..'`${topFolder}/${lang === 'en' ? 'zh' : 'en'}/${relativePath}`
    )
    node.langSwitchable = fs.existsSync(filePathInDiffLang)

    const chunks = slug.split('/').slice(1)
    node.version = chunks[0]
    node.pathWithoutVersion = chunks.slice(1).join('/')

    node.pathPrefix = node.path.split('/').slice(0, -1).join('/')
    node.tocPath = genTOCPath(slug)
    node.downloadURL = genPDFDownloadURL(slug, lang)

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
      parent,
      path,
      langSwitchable,
      pathPrefix,
      tocPath,
      downloadURL,
    } = node

    createPage({
      path,
      component: template,
      context: {
        id,
        langCollection: parent.sourceInstanceName,
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

    // create redirects
    if (node.frontmatter.aliases) {
      node.frontmatter.aliases.forEach((fromPath) => {
        createRedirect({
          fromPath,
          toPath: path,
          isPermanent: true,
        })
      })
    }
  })
}

module.exports = createDocs
