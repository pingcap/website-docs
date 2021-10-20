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
