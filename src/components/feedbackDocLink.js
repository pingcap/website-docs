import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import { useLocation } from '@reach/router'
import { wrapPathWithLang } from '../lib/docHelper'

const FeedbackDocLink = ({ repoInfo, lang }) => {
  const { repo, pathWithoutVersion } = repoInfo
  const path = wrapPathWithLang(repo, pathWithoutVersion, lang) + '.md'

  const origin = 'https://docs.pingcap.com'
  const location = useLocation()
  const { pathname } = location

  return (
    <div className="doc-download feedback-doc">
      <a
        href={`https://github.com/${repo}/issues/new?body=File:%20[/${path}](${origin}${pathname})`}
        target="_blank"
        rel="noreferrer"
      >
        <FormattedMessage id="doc.feedbackDocLink" />
      </a>
    </div>
  )
}

FeedbackDocLink.propTypes = {
  repoInfo: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
}

export default FeedbackDocLink
