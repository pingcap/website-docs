export const docsTiDBOperatorVersion = {
  master: 'dev',
  'release-1.0': 'v1.0',
  'release-1.1': 'v1.1',
}

export const docsDMVersion = {
  master: 'dev',
  'release-1.0': 'v1.0',
}

export function convertDocAndRef([doc, ref]) {
  const result = [doc, ref]

  switch (doc) {
    case 'docs-tidb-operator':
      result[0] = 'tidb-in-kubernetes'
      result[1] = docsTiDBOperatorVersion[ref]

      break
    case 'docs-dm':
      result[0] = 'tidb-data-migration'
      result[1] = docsDMVersion[ref]

      break
    default:
      break
  }

  return result
}
