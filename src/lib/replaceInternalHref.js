export function unifyAnchor(item) {
  return item
    .replace(/\s/g, '-')
    .replace(/[^-\w\u4E00-\u9FFF]*/g, '') // GitHub Specific
    .replace(/span-classversion-mark|span$/g, '') // Same as above
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

  const re = /\/?.*\.md/
  const reAnchor = /[^#-\w\u4E00-\u9FFF]*/g
  const absPathRegx = /https?:\/\/(www\.)?[-a-zA-Z0-9@:%._+~#=]{2,256}/
  const sliceVersionMark = /span-classversion-mark|span$/g

  Array.from(aTags).forEach(a => {
    const hrefText = a.getAttribute('href')

    if (!absPathRegx.test(hrefText) && re.test(hrefText)) {
      const hrefTextArr = hrefText.replace('.md', '').split('/')

      a.href = `${lang === 'zh' ? `/${lang}` : ''}/${doc}/${version}/${
        hrefTextArr[hrefTextArr.length - 1]
      }`
    }

    if (a.classList.contains('anchor')) {
      a.href = decodeURIComponent(a.getAttribute('href'))
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
