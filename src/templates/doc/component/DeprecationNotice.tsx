import { Important } from 'components/shortcodes'

import { Link, Trans } from 'gatsby-plugin-react-i18next'
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

export function DeprecationNotice({
  name,
  docVersionStable: { doc, version, stable: stableVersion },
  versions,
}: Props) {
  const showNoitce = deprecated[doc].includes(version)
  const stableDocLink = versions.includes('stable')
    ? `/${doc}/stable/${name === '_index' ? '' : name}`
    : `/${doc}/stable`

  return (
    <>
      {showNoitce && (
        <Important>
          <p>
            <Trans
              i18nKey={`doc.deprecation.${doc}.firstContext`}
              values={{
                curDocVersion: version,
              }}
            />
          </p>
          <div>
            <Trans
              i18nKey={`doc.deprecation.${doc}.secondContext`}
              components={[<Link to={stableDocLink} />]}
              values={{
                stableVersion,
              }}
            />
          </div>
        </Important>
      )}
    </>
  )
}
