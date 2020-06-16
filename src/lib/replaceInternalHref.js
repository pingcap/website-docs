export default function replaceInternalHref(lang, type, version) {
  const aTags = document.querySelector('.doc-content').getElementsByTagName('a')
  const re = /\/?.*\.md/
  const reAnchor = /[^#-\w\u4E00-\u9FFF]*/g

  Array.from(aTags).forEach((a) => {
    const hrefText = a.getAttribute('href')

    if (re.test(hrefText)) {
      const hrefTextArr = hrefText.replace('.md', '').split('/')

      a.href =
        lang === 'zh'
          ? `/${lang}/${type}/${version}/${hrefTextArr[hrefTextArr.length - 1]}`
          : `/${type}/${version}/${hrefTextArr[hrefTextArr.length - 1]}`
    }

    if (a.classList.contains('anchor')) {
      a.href = decodeURIComponent(a.getAttribute('href')).replace(reAnchor, '')
      a.parentElement.id = a.parentElement.id.replace(reAnchor, '')
    }
  })
}
