import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'

const FeedbackDocLink = ({ repoInfo, base }) => {
  const { repo, pathPrefix } = repoInfo || {}
  const pageUrl = window.location.href
  return (
    <a
      href={`https://github.com/pingcap/${repo}/issues/new?body=File:%20[/${pathPrefix}${base}](${pageUrl})`}
      className="improve-doc"
      target="_blank"
      rel="noreferrer"
    >
      {/* {{ partial "svgs/request-docs-changes-icon.svg" (dict "fill" "#142848" "width" 14 "height" 14 ) }} */}
      <FormattedMessage id="doc.feedbackDocLink" />
    </a>
  )
}

FeedbackDocLink.propTypes = {
  repoInfo: PropTypes.object.isRequired,
  base: PropTypes.string.isRequired,
}

export default FeedbackDocLink
