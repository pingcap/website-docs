import { graphql, useStaticQuery } from 'gatsby'

import { FormattedMessage } from 'react-intl'
import { useLocation } from '@reach/router'
import { wrapPathWithLang } from 'lib/utils'

interface Props {
  repoInfo: any
  lang: string
}

export function FeedbackDoc({ repoInfo, lang }: Props) {
  const { repo, ref, realPath } = repoInfo
  const path = wrapPathWithLang(repo, realPath, lang)

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
      href={`https://github.com/${repo}/issues/new?body=File:%20[/${ref}/${path}](${site.siteMetadata.siteUrl}${pathname})`}
      target="_blank"
      rel="noreferrer">
      <FormattedMessage id="doc.feedback" />
    </a>
  )
}
