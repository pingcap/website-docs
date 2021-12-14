import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'
import { wrapPathWithLang } from 'lib/utils'

const Improve = ({ repoInfo, lang }) => {
  const { repo, ref, realPath } = repoInfo
  const path = wrapPathWithLang(repo, realPath, lang)

  return (
    <a
      className="doc-help-link improve"
      href={`https://github.com/${repo}/edit/${ref}/${path}`}
      target="_blank"
      rel="noreferrer"
    >
      <FormattedMessage id="doc.improve" />
    </a>
  )
}

Improve.propTypes = {
  repoInfo: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
}

export default Improve
