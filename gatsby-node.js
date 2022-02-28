require('ts-node').register({ transpileOnly: true })

const path = require('path')

const { createDocs } = require('./gatsby/create-pages')
const { createExtraType } = require('./gatsby/create-types')

exports.createPages = async ({ graphql, actions }) => {
  await createDocs({ graphql, actions })
  actions.createPage({
    path: '/search',
    component: path.resolve(__dirname, './src/search/index.tsx'),
  })
  actions.createPage({
    path: '/404',
    component: path.resolve(__dirname, './src/404/index.tsx'),
  })
}

exports.createSchemaCustomization = createExtraType
