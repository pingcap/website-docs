import { navigate, withPrefix } from 'gatsby'

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

/**
 * Generate a array with the real and internal href, which is usually used for non-js/js routing.
 *
 * @export
 * @param {string} href
 * @param {string} lang
 * @param {string} doc
 * @param {string} version
 * @return {[string, string, string]}
 */
export function generateHrefs(href, lang, doc, version) {
  let result = href

  const hrefArray = href.split('/')
  const name = hrefArray[hrefArray.length - 1]
  result = name.replace('.md', '')
  result = [lang, doc, version, result].join('/')

  return [withPrefix(result), '/' + result, name]
}

/**
 * If the user clicks on the link with the left click, then use internal router to navigate.
 *
 * @export
 * @param {KeyboardEvent} e
 * @return {boolean}
 */
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

    navigate(e.target.getAttribute('data-href'))

    return true
  }

  return false
}
