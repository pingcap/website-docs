import { generateHrefs, navigateInsideEventListener } from './utils'

const reAnchor = /[^-\w\u4E00-\u9FFF]*/g // with CJKLanguage
const sliceVersionMark = /span-classversion-mark|span$/g

export function unifyAnchor(url) {
  return url
    .replace(/\s/g, '-')
    .replace(reAnchor, '')
    .replace(sliceVersionMark, '')
    .toLowerCase()
}

export default function replaceInternalHref(
  lang,
  doc,
  version,
  simpletab = false
) {
  const aTags = document.querySelectorAll(
    `${simpletab ? '.PingCAP-simpleTab' : '.doc-content'} a`
  )

  Array.from(aTags).forEach(a => {
    let href = a.getAttribute('href')

    if (href.includes('.md')) {
      const [realHref, internalHref] = generateHrefs(href, lang, doc, version)

      a.href = realHref
      a.setAttribute('data-href', internalHref)
      a.addEventListener('click', navigateInsideEventListener)
    }

    if (a.classList.contains('anchor')) {
      a.href =
        '#' +
        decodeURIComponent(href)
          .replace(reAnchor, '')
          .replace(sliceVersionMark, '')
      a.parentElement.id = a.parentElement.id
        .replace(reAnchor, '')
        .replace(sliceVersionMark, '')
    }
  })

  if (!simpletab && window.location.hash) {
    window.location.href = window.location.hash
  }
}
