import data from '../../docs.json'

const docs = data['docs']

/**
 * Convert version to custom name.
 *
 * Copy from create-pages/renameVersion.
 *
 * @param {string} version
 * @param {string} stable
 * @return {string}
 */
function convertVersionName(version, stable) {
  switch (version) {
    case 'master':
      return 'dev'
    case stable:
      return 'stable'
    default:
      return version.replace('release-', 'v')
  }
}

export const tidbStable = docs['tidb']['stable']
export const dmStable = docs['tidb-data-migration']['stable']
export const operatorStable = docs['tidb-in-kubernetes']['stable']

export const tidb = docs['tidb']['languages']['en']['versions'].map(d =>
  convertVersionName(d, tidbStable)
)
export const dm = docs['tidb-data-migration']['languages']['en'][
  'versions'
].map(d => convertVersionName(d, dmStable))
export const operator = docs['tidb-in-kubernetes']['languages']['en'][
  'versions'
].map(d => convertVersionName(d, operatorStable))
export const cloud = ['public-preview']
export const appdev =
  docs['appdev']['languages']['en']['versions'].map(convertVersionName)

export const deprecated = {
  tidb: docs['tidb']['deprecated'],
  'tidb-data-migration': docs['tidb-data-migration']['deprecated'],
  'tidb-in-kubernetes': docs['tidb-in-kubernetes']['deprecated'],
}
