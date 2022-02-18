import { useEffect, useState } from 'react'

import { Trans } from 'gatsby-plugin-react-i18next'
import axios from 'axios'
import { wrapPathWithLang } from 'lib/utils'
import { commitInfo } from './git-commit.module.scss'

interface Props {
  repoInfo: Record<string, any>
  lang: string
  title: string
}

export function GitCommitInfo({ repoInfo, lang, title }: Props) {
  const { repo, ref, realPath } = repoInfo
  const path = wrapPathWithLang(repo, realPath, lang)

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
    <div className={commitInfo}>
      {latestCommit && (
        <>
          <a
            href={`https://github.com/${repo}/blob/${ref}/${path}`}
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
