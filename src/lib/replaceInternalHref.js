const reAnchor = /[^-\w\u4E00-\u9FFF]*/g // with CJKLanguage

export function unifyAnchor(item) {
  return item
    .replace(/\s/g, '-')
    .replace(reAnchor, '')
    .replace(/span-classversion-mark|span$/g, '')
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

  const sliceVersionMark = /span-classversion-mark|span$/g

  Array.from(aTags).forEach(a => {
    const href = a.getAttribute('href')

    if (href.includes('.md')) {
      a.href = `${
        lang === 'zh' ? `/${lang}` : ''
      }/${doc}/${version}/${href.replace('.md', '')}`
    }

    if (a.classList.contains('anchor')) {
      a.href = decodeURIComponent(href)
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
