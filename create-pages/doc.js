const path = require('path')
const fs = require('fs')
const {
  getStable,
  renameVersionByDoc,
  replacePath,
  genTOCSlug,
  genPDFDownloadURL,
  getRepo,
} = require('./utils')
const flatten = require('flat')

const messages = {
  en: flatten(require('../src/intl/en.json')),
  zh: flatten(require('../src/intl/zh.json')),
}

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

  const nodes = docs.data.allMdx.nodes.map(node => {
    // e.g. => zh/tidb-data-migration/master/benchmark-v1.0-ga => tidb-data-migration/master/benchmark-v1.0-ga
    const slug = node.slug.split('/').slice(1).join('/')
    const { sourceInstanceName: topFolder, relativePath, name } = node.parent
    const [lang, ...pathWithoutLang] = relativePath.split('/') // [en|zh, pure path]
    const [doc, version] = pathWithoutLang

    node.repo = getRepo(doc, lang)
    node.ref = version
    node.lang = lang
    node.version = renameVersionByDoc(doc, version)
    node.docVersionStable = JSON.stringify({
      doc,
      version: node.version,
      stable: getStable(doc),
    })
    node.path = replacePath(slug, name, lang)

    const filePathInDiffLang = path.resolve(
      __dirname,
      `..${topFolder}/${lang === 'en' ? 'zh' : 'en'}/${pathWithoutLang.join(
        '/'
      )}`
    )
    node.langSwitchable = fs.existsSync(filePathInDiffLang)

    node.tocSlug = genTOCSlug(node.slug)
    node.downloadURL = genPDFDownloadURL(slug, lang)

    // e.g. => tidb-data-migration/master/benchmark-v1.0-ga => benchmark-v1.0-ga
    node.pathWithoutVersion = slug.split('/').slice(2).join('/')

    return node
  })

  const versionsMap = nodes.reduce(
    (acc, { lang, version, pathWithoutVersion }) => {
      const arr = acc[lang][pathWithoutVersion]

      if (arr) {
        arr.push(version)
      } else {
        acc[lang][pathWithoutVersion] = [version]
      }

      return acc
    },
    {
      en: {},
      zh: {},
    }
  )

  nodes.forEach(node => {
    const {
      id,
      parent,
      repo,
      ref,
      lang,
      docVersionStable,
      path,
      langSwitchable,
      tocSlug,
      downloadURL,
      pathWithoutVersion,
    } = node

    createPage({
      path,
      component: template,
      context: {
        layout: 'doc',
        id,
        name: parent.name,
        repo,
        ref,
        lang,
        // gatsby-plugin-react-intl
        intl: {
          language: lang,
          messages: messages[lang],
          routed: true,
          defaultLanguage: 'en',
          ignoredPaths: [],
        },
        docVersionStable,
        langSwitchable,
        tocSlug,
        downloadURL,
        pathWithoutVersion,
        versions: versionsMap[lang][node.pathWithoutVersion],
      },
    })

    // create redirects
    if (node.frontmatter.aliases) {
      node.frontmatter.aliases.forEach(fromPath => {
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
