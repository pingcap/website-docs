import { navigate } from 'gatsby-plugin-react-intl'

export function wrapPathWithLang(repo, path, lang) {
  if (
    repo === 'pingcap/docs-dm' ||
    repo === 'pingcap/docs-tidb-operator' ||
    repo === 'pingcap/docs-appdev'
  ) {
    return `${lang}/${path}`
  }

  return path
}

export function navigateInsideEventListener(e) {
  if (
    // ref: https://github.com/gatsbyjs/gatsby/blob/master/packages/gatsby-link/src/index.js
    e.button === 0 && // ignore right clicks
    !e.defaultPrevented && // onClick prevented default
    !e.metaKey && // ignore clicks with modifier keys...
    !e.altKey &&
    !e.ctrlKey &&
    !e.shiftKey
  ) {
    e.preventDefault()

    navigate(e.target.getAttribute('href'))

    return true
  }

  return false
}
