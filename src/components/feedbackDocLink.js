import PropTypes from 'prop-types'
import React from 'react'
import { useLocation } from '@reach/router'
import { FormattedMessage } from 'react-intl'

const FeedbackDocLink = ({ repoInfo, base }) => {
  const { repo, pathPrefix } = repoInfo || {}
  const location = useLocation()
  const origin = 'https://docs.pingcap.com'
  const pageURL = location.pathname

  return (
    <div className="doc-download feedback-doc">
      <a
        href={`https://github.com/pingcap/${repo}/issues/new?body=File:%20[/${pathPrefix}${base}](${origin}${pageURL})`}
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
  base: PropTypes.string.isRequired,
}

export default FeedbackDocLink
