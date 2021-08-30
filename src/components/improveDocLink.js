import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import { wrapPathWithLang } from '../lib/docHelper'

const ImproveDocLink = ({ repoInfo, lang }) => {
  const { repo, ref, pathWithoutVersion } = repoInfo
  const path = wrapPathWithLang(repo, pathWithoutVersion, lang) + '.md'

  return (
    <div className="doc-download improve-doc">
      <a
        href={`https://github.com/${repo}/edit/${ref}/${path}`}
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
  lang: PropTypes.string.isRequired,
}

export default ImproveDocLink
