import { Important } from './shortcodes'

import { FormattedMessage } from 'react-intl'
import { Link } from 'gatsby-plugin-react-intl'
import { deprecated } from 'lib/version'

interface Props {
  name: string
  docVersionStable: {
    doc: keyof typeof deprecated
    version: string
    stable: string
  }
  versions: string[]
}

export const DeprecationNotice = ({
  name,
  docVersionStable,
  versions,
}: Props) => {
  const { doc, version, stable: stableVersion } = docVersionStable

  const showNoitce = deprecated[doc].includes(version)
  const stableDocLink = versions.includes('stable')
    ? `/${doc}/stable/${name === '_index' ? '' : name}`
    : `/${doc}/stable`

  return (
    <>
      {showNoitce && (
        <Important>
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
        </Important>
      )}
    </>
  )
}
