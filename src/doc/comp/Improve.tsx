import { Trans } from 'gatsby-plugin-react-i18next'
import { PathConfig } from 'typing'

import { getRepo } from '../../../gatsby/path'

interface Props {
  pathConfig: PathConfig
  filePath: string
}

export function Improve({ pathConfig, filePath }: Props) {
  return (
    <a
      className="doc-help-link improve"
      href={`https://github.com/${getRepo(pathConfig)}/edit/${
        pathConfig.branch
      }/${filePath}`}
      target="_blank"
      rel="noreferrer">
      <Trans i18nKey="doc.improve" />
    </a>
  )
}
