import { graphql, useStaticQuery } from 'gatsby'
import { Trans } from 'gatsby-plugin-react-i18next'
import { useLocation } from '@reach/router'

import { PathConfig } from 'typing'

import { getRepo } from '../../../gatsby/path'

interface Props {
  pathConfig: PathConfig
  filePath: string
}

export function FeedbackDoc({ pathConfig, filePath }: Props) {
  const { site } = useStaticQuery(graphql`
    query {
      site {
        siteMetadata {
          siteUrl
        }
      }
    }
  `)
  let { pathname } = useLocation()
  if (pathname.endsWith('/')) {
    pathname = pathname.slice(0, -1) // unify client and ssr
  }

  return (
    <a
      className="doc-help-link feedback"
      href={`https://github.com/${getRepo(
        pathConfig
      )}/issues/new?body=File:%20[/${pathConfig.branch}/${filePath}](${
        site.siteMetadata.siteUrl
      }${pathname})`}
      target="_blank"
      rel="noreferrer">
      <Trans i18nKey="doc.feedback" />
    </a>
  )
}
