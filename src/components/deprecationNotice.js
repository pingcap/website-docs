import * as Shortcodes from '../components/shortcodes'

import { FormattedMessage } from 'react-intl'
import { Link } from 'gatsby-plugin-react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import { deprecated } from 'lib/version'

const DeprecationNotice = ({ name, docVersionStable, versions }) => {
  const { doc, version, stable: stableVersion } = docVersionStable

  const showNoitce = deprecated[doc].includes(version)
  const stableDocLink = versions.includes('stable')
    ? `/${doc}/stable/${name === '_index' ? '' : name}`
    : `/${doc}/stable`

  return (
    <>
      {showNoitce && (
        <Shortcodes.Important>
          <p>
            <FormattedMessage
              id={`doc.deprecation.${doc}.firstContext`}
              values={{
                curDocVersion: version,
              }}
            />
          </p>
          <div>
            <FormattedMessage
              id={`doc.deprecation.${doc}.secondContext`}
              values={{
                stableVersion,
                link: (
                  <Link to={stableDocLink}>
                    <FormattedMessage id={`doc.deprecation.${doc}.link`} />
                  </Link>
                ),
              }}
            />
          </div>
        </Shortcodes.Important>
      )}
    </>
  )
}

DeprecationNotice.propTypes = {
  name: PropTypes.string.isRequired,
  docVersionStable: PropTypes.object.isRequired,
  versions: PropTypes.array,
}

export default DeprecationNotice
