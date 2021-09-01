import React, { useEffect, useState } from 'react'

import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import axios from 'axios'
import { wrapPathWithLang } from 'lib/docHelper'

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
          <a
            href={`https://github.com/${repo}/blob/${ref}/${path}`}
            target="_blank"
            rel="noreferrer"
          >
            {title}
          </a>{' '}
          <FormattedMessage id="doc.latestCommit" />{' '}
          {latestCommit.commit.author.date}:{' '}
          <a href={latestCommit.html_url} target="_blank" rel="noreferrer">
            {latestCommit.commit.message.split('\n')[0]}
          </a>
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
