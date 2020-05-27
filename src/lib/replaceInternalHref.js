export default function replaceInternalHref(lang, type, version) {
  const aTags = document.querySelector('.doc-content').getElementsByTagName('a')
  const re = /\/?.*\.md/

  Array.from(aTags).forEach((a) => {
    const hrefText = a.getAttribute('href')

    if (re.test(hrefText)) {
      const hrefTextArr = hrefText.replace('.md', '').split('/')

      a.href = `/${lang}/${type}/${version}/${
        hrefTextArr[hrefTextArr.length - 1]
      }`
    }
  })
}
