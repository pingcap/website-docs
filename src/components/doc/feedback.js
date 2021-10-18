import { graphql, useStaticQuery } from 'gatsby'

import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import { useLocation } from '@reach/router'
import { wrapPathWithLang } from 'lib/docHelper'

const FeedbackDocLink = ({ repoInfo, lang }) => {
  const { repo, ref, pathWithoutVersion } = repoInfo
  const path = wrapPathWithLang(repo, pathWithoutVersion, lang) + '.md'

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
      rel="noreferrer"
    >
      <FormattedMessage id="doc.feedback" />
    </a>
  )
}

FeedbackDocLink.propTypes = {
  repoInfo: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
}

export default FeedbackDocLink
