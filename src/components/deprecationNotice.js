import React from 'react'
import * as Shortcodes from '../components/shortcodes'
import { FormattedMessage } from 'react-intl'
import IntlLink from '../components/IntlLink'
import { convertDocAndRef } from '../lib/version'

const deprecatedDocsVersions = {
  tidb: ['v2.1', 'v3.0', 'v3.1'],
  'tidb-data-migration': ['v1.0'],
  'tidb-in-kubernetes': ['v1.0'],
}

const DeprecationNotice = ({ relativeDir, versions, base }) => {
  const docRefArray = convertDocAndRef(relativeDir.split('/'))
  const docType = docRefArray[0]
  const docVersion = docRefArray[1]
  const docStableVersion = docRefArray[2]
  const baseName = base.replace('.md', '')
  const showNoitce = deprecatedDocsVersions[docType].includes(docVersion)
  const stableDocLink = versions.includes('stable')
    ? `/${docType}/stable/${baseName === '_index' ? '' : baseName}`
    : `/${docType}/stable`

  return (
    <>
      {showNoitce && (
        <Shortcodes.Important>
          <p>
            <FormattedMessage
              id={`doc.deprecation.${docType}.firstContext`}
              values={{
                curDocVersion: `${docVersion}`,
              }}
            />
          </p>
          <div>
            <FormattedMessage
              id={`doc.deprecation.${docType}.secondContext`}
              values={{
                stableVersion: `${docStableVersion}`,
                link: (
                  <IntlLink type="innerLink" to={stableDocLink}>
                    <FormattedMessage id={`doc.deprecation.${docType}.link`} />
                  </IntlLink>
                ),
              }}
            />
          </div>
        </Shortcodes.Important>
      )}
    </>
  )
}

export default DeprecationNotice
