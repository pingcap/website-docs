import { Important } from 'components/shortcodes'

import { Link, Trans } from 'gatsby-plugin-react-i18next'
import { PathConfig } from 'typing'
import { docs } from '../../../docs.json'

interface Props {
  name: string
  pathConfig: PathConfig
  availIn: string[]
}

export function CustomNotice({ name, pathConfig, availIn }: Props) {
  const docConfig = docs[pathConfig.repo] as {
    deprecated?: string[]
    stable: string
    dmr?: string[]
  }

  const isDeprecated =
    docConfig.deprecated?.includes(pathConfig.version || '') ?? false
  const isDmr = docConfig.dmr?.includes(pathConfig.version || '') ?? false

  const stableDocLink = availIn.includes('stable')
    ? `/${pathConfig.repo}/stable/${name === '_index' ? '' : name}`
    : `/${pathConfig.repo}/stable`

  const dmrDesc =
    pathConfig.locale === 'zh'
      ? `/tidb/v6.0/versioning`
      : `/tidb/v6.0/versioning`

  if (isDeprecated) {
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
  } else if (isDmr) {
    return (
      <>
        <Important>
          <p>
            <Trans
              i18nKey={`doc.dmr.${pathConfig.repo}.firstContext`}
              components={[<Link to={dmrDesc} />]}
              values={{
                curDocVersion: pathConfig.version,
              }}
            />
          </p>
          <div>
            <Trans
              i18nKey={`doc.dmr.${pathConfig.repo}.secondContext`}
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

  return null
}

export const MachineTranslationNotice = ({ name, pathConfig }: Props) => {
  const targetEnUrl =
    pathConfig.repo === 'tidbcloud'
      ? `/tidbcloud`
      : `/${pathConfig.repo}/stable/${name === '_index' ? '' : name}`
  return (
    <Important>
      <Trans
        i18nKey={`lang.machineTransNotice`}
        components={[<Link language="en" to={targetEnUrl} />]}
      />
    </Important>
  )
}
