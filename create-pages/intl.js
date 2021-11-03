const defaultLang = 'en'
const langMapKeys = ['zh']
const dev404Page = '/dev-404-page'

const identity = (x) => x

const createIntlPages = ({ page, actions }) => {
  const pagePath = page.path

  if (
    langMapKeys.map((lang) => pagePath.startsWith(lang)).some(identity) ||
    pagePath.startsWith(dev404Page)
  ) {
    return
  }

  const { createPage, deletePage } = actions

  deletePage(page)
  createPage({
    ...page,
    context: {
      ...page.context,
      locale: defaultLang,
    },
  })

  langMapKeys.forEach((lang) =>
    createPage({
      ...page,
      path: `/${lang}${pagePath}`,
      context: {
        ...page.context,
        locale: lang,
      },
    })
  )

  if (pagePath === '/search/') {
    createPage({
      ...page,
      path: `/ja${pagePath}`,
      context: {
        ...page.context,
        locale: 'ja',
      },
    })
  }
}

module.exports = createIntlPages
