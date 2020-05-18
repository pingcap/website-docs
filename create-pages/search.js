const path = require('path')

const createSearchPage = ({ createPage }) => {
  const searchTemplate = path.resolve(`${__dirname}/../src/templates/search.js`)

  function _createSearchPage(locale, pathPrefix = '') {
    createPage({
      path: `${pathPrefix}/search`,
      component: searchTemplate,
      context: {
        locale
      },
    })
  }

  _createSearchPage('en')
  _createSearchPage('zh', '/zh')
}

module.exports = createSearchPage
