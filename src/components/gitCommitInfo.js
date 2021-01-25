import React, { useState, useEffect } from 'react'
import { FormattedMessage } from 'react-intl'
import IntlLink from '../components/IntlLink'
import axios from 'axios'

const GitCommitInfo = ({ repoInfo, base, title }) => {
  const { owner, repo, ref, pathPrefix } = repoInfo || {}
  const [latestCommit, setLatestCommit] = useState(null)

  useEffect(() => {
    async function fetchLatestCommit() {
      try {
        const res = (
          await axios.get(
            `https://api.github.com/repos/${owner}/${repo}/commits?sha=${ref}&path=${pathPrefix}${base}`
          )
        ).data[0]
        setLatestCommit(res)
      } catch (e) {
        console.log('Fail to fetch lasted commit')
        return
      }
    }

    fetchLatestCommit()
  }, [owner, repo, ref, pathPrefix, base])

  return (
    <div className="commit-info">
      {latestCommit && (
        <>
          <IntlLink
            to={`https://github.com/${owner}/${repo}/blob/${ref}/${pathPrefix}${base}`}
            type="outBoundLink"
          >
            {title}
          </IntlLink>{' '}
          <FormattedMessage id="latestCommit" />{' '}
          {latestCommit.commit.author.date}:{' '}
          <IntlLink to={latestCommit.html_url} type="outBoundLink">
            {latestCommit.commit.message.split('\n')[0]}
          </IntlLink>
        </>
      )}
    </div>
  )
}

export default GitCommitInfo
