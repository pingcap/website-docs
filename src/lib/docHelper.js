export function wrapPathWithLang(repo, path, lang) {
  if (repo === 'pingcap/docs-dm' || repo === 'pingcap/docs-tidb-operator') {
    return `${lang}/${path}`
  }

  return path
}
