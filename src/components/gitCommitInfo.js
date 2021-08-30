import React, { useEffect, useState } from 'react'

import { FormattedMessage } from 'react-intl'
import IntlLink from '../components/IntlLink'
import PropTypes from 'prop-types'
import axios from 'axios'
import { wrapPathWithLang } from '../lib/docHelper'

const GitCommitInfo = ({ repoInfo, lang, title }) => {
  const { repo, ref, pathWithoutVersion } = repoInfo
  const path = wrapPathWithLang(repo, pathWithoutVersion, lang) + '.md'

  const [latestCommit, setLatestCommit] = useState(null)

  useEffect(() => {
    async function fetchLatestCommit() {
      try {
        const res = (
          await axios.get(`https://api.github.com/repos/${repo}/commits`, {
            params: {
              sha: ref,
              path,
              per_page: 1,
            },
          })
        ).data[0]

        setLatestCommit(res)
      } catch (err) {
        // TODO: perform error handling
      }
    }

    fetchLatestCommit()
  }, [repo, ref, path])

  return (
    <div className="commit-info">
      {latestCommit && (
        <>
          <IntlLink
            type="outBoundLink"
            to={`https://github.com/${repo}/blob/${ref}/${path}`}
          >
            {title}
          </IntlLink>{' '}
          <FormattedMessage id="latestCommit" />{' '}
          {latestCommit.commit.author.date}:{' '}
          <IntlLink type="outBoundLink" to={latestCommit.html_url}>
            {latestCommit.commit.message.split('\n')[0]}
          </IntlLink>
        </>
      )}
    </div>
  )
}

GitCommitInfo.propTypes = {
  repoInfo: PropTypes.object.isRequired,
  lang: PropTypes.string.isRequired,
  title: PropTypes.string.isRequired,
}

export default GitCommitInfo
