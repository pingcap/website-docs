import { Important } from 'components/shortcodes'

import { Link, Trans } from 'gatsby-plugin-react-i18next'
import { PathConfig } from 'typing'
import { docs } from '../../../docs.json'

interface Props {
  name: string
  pathConfig: PathConfig
  availIn: string[]
}

export function DeprecationNotice({ name, pathConfig, availIn }: Props) {
  const docConfig = docs[pathConfig.repo] as {
    deprecated?: string[]
    stable: string
  }
  const show = docConfig.deprecated?.includes(pathConfig.version) ?? false

  if (!show) return null

  const stableDocLink = availIn.includes('stable')
    ? `/${pathConfig.repo}/stable/${name === '_index' ? '' : name}`
    : `/${pathConfig.repo}/stable`

  return (
    <>
      <Important>
        <p>
          <Trans
            i18nKey={`doc.deprecation.${pathConfig.repo}.firstContext`}
            values={{
              curDocVersion: pathConfig.version,
            }}
          />
        </p>
        <div>
          <Trans
            i18nKey={`doc.deprecation.${pathConfig.repo}.secondContext`}
            components={[<Link to={stableDocLink} />]}
            values={{
              stableVersion: docConfig.stable,
            }}
          />
        </div>
      </Important>
    </>
  )
}
