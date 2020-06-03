// import { Link } from 'gatsby'
import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'

const ImproveDocLink = ({ repoInfo, base }) => {
  const { repo, ref, pathPrefix } = repoInfo || {}

  return (
    <a
      href={`https://github.com/pingcap/${repo}/edit/${ref}/${pathPrefix}${base}`}
      className="improve-doc"
      target="_blank"
      rel="noreferrer"
    >
      {/* {{ partial "svgs/icon-edit.svg" (dict "fill" "#142848" "width" 14 "height" 14 ) }} */}
      <FormattedMessage id="doc.improveDocLink" />
    </a>
  )
}

ImproveDocLink.propTypes = {
  repoInfo: PropTypes.object.isRequired,
  base: PropTypes.string.isRequired,
}

export default ImproveDocLink
