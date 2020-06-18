export const docsTiDBVersion = {
  master: 'dev',
  'release-4.0': 'v4.0',
  'release-3.1': 'v3.1',
  'release-3.0': 'v3.0',
  'release-2.1': 'v2.1',
}

export const docsTiDBOperatorVersion = {
  master: 'dev',
  'release-1.1': 'v1.1',
  'release-1.0': 'v1.0',
}

export const docsDMVersion = {
  master: 'dev',
  'release-1.0': 'v1.0',
}

export const docsCloudVersion = {
  master: 'beta'
}

export function convertDocAndRef([doc, ref]) {
  const result = [doc, ref]

  switch (doc) {
    case 'docs-tidb':
      result[0] = 'tidb'
      result[1] = docsTiDBVersion[ref]

      break
    case 'docs-tidb-operator':
      result[0] = 'tidb-in-kubernetes'
      result[1] = docsTiDBOperatorVersion[ref]

      break
    case 'docs-dm':
      result[0] = 'tidb-data-migration'
      result[1] = docsDMVersion[ref]

      break
    case 'docs-dbaas':
      result[0] = 'tidbcloud'
      result[1] = docsCloudVersion[ref]
      
      break
    default:
      break
  }

  return result
}
