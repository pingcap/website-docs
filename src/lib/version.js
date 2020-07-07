export const docsTiDBVersion = {
  master: 'dev',
  'release-4.0': 'stable',
  'release-3.1': 'v3.1',
  'release-3.0': 'v3.0',
  'release-2.1': 'v2.1',
}

export const tidbStableVersion = 'v4.0'

export const dmStableVersion = 'v1.0'

export const operatorStableVersion = 'v1.1'

export const docsTiDBOperatorVersion = {
  master: 'dev',
  'release-1.1': 'stable',
  'release-1.0': 'v1.0',
}

export const docsDMVersion = {
  master: 'dev',
  'release-1.0': 'stable',
}

export const docsCloudVersion = {
  master: 'beta'
}

export function convertDocAndRef([doc, ref]) {
  let stableVersion = ''
  const result = [doc, ref, stableVersion]

  switch (doc) {
    case 'docs-tidb':
      result[0] = 'tidb'
      result[1] = docsTiDBVersion[ref]
      result[2] = tidbStableVersion

      break
    case 'docs-tidb-operator':
      result[0] = 'tidb-in-kubernetes'
      result[1] = docsTiDBOperatorVersion[ref]
      result[2] = dmStableVersion

      break
    case 'docs-dm':
      result[0] = 'tidb-data-migration'
      result[1] = docsDMVersion[ref]
      result[2] = operatorStableVersion

      break
    case 'docs-dbaas':
      result[0] = 'tidbcloud'
      result[1] = docsCloudVersion[ref]
      result[2] = ''
      
      break
    default:
      break
  }

  return result
}
