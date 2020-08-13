import PropTypes from 'prop-types'
import React from 'react'
import { FormattedMessage } from 'react-intl'

const ImproveDocLink = ({ repoInfo, base }) => {
  const { owner, repo, ref, pathPrefix } = repoInfo || {}

  return (
    <div className="doc-download improve-doc">
      <a
        href={`https://github.com/${owner}/${repo}/edit/${ref}/${pathPrefix}${base}`}
        className="improve-doc"
        target="_blank"
        rel="noreferrer"
      >
        <FormattedMessage id="doc.improveDocLink" />
      </a>
    </div>
  )
}

ImproveDocLink.propTypes = {
  repoInfo: PropTypes.object.isRequired,
  base: PropTypes.string.isRequired,
}

export default ImproveDocLink
