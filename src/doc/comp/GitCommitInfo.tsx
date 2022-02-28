import { useEffect, useMemo, useState } from 'react'

import { Trans } from 'gatsby-plugin-react-i18next'
import axios from 'axios'
import { commitInfo } from './git-commit.module.scss'
import { PathConfig } from 'typing'
import { getRepo } from '../../../gatsby/path'

interface Props {
  pathConfig: PathConfig
  title: string
  filePath: string
}

export function GitCommitInfo({ pathConfig, title, filePath }: Props) {
  const [latestCommit, setLatestCommit] = useState(null as any)
  const repo = useMemo(() => getRepo(pathConfig), [pathConfig])

  useEffect(() => {
    async function fetchLatestCommit() {
      try {
        const res = (
          await axios.get(`https://api.github.com/repos/${repo}/commits`, {
            params: {
              sha: pathConfig.branch,
              path: filePath,
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
  }, [pathConfig, filePath])

  return (
    <div className={commitInfo}>
      {latestCommit && (
        <>
          <a
            href={`https://github.com/${repo}/blob/${pathConfig.branch}/${filePath}`}
            target="_blank"
            rel="noreferrer">
            {title}
          </a>
          <Trans>doc.latestCommit</Trans>
          {latestCommit.commit.author.date}:
          <a href={latestCommit.html_url} target="_blank" rel="noreferrer">
            {latestCommit.commit.message.split('\n')[0]}
          </a>
        </>
      )}
    </div>
  )
}
