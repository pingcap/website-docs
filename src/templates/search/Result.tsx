import { Trans } from 'gatsby-plugin-react-i18next'

import {
  counts,
  item,
  noResult,
  searchResult,
  resultList,
  title,
  url,
  content,
  tips,
} from './result.module.scss'

interface Props {
  results: Record<string, any>[]
  searched: boolean
}

export const SearchResult = ({ results, searched }: Props) => (
  <div className={searchResult}>
    <p className={counts}>
      <Trans
        i18nKey="search.resultTips.counts"
        values={{ counts: results.length }}
      />
    </p>
    <div className={resultList}>
      {results.length > 0 &&
        results.map(r => (
          <div key={r.objectID} className={item}>
            {r._highlightResult && r._highlightResult.hierarchy && (
              <>
                <a href={r.url}>
                  <div
                    className={title}
                    dangerouslySetInnerHTML={{
                      __html: r._highlightResult.hierarchy.lvl0.value,
                    }}
                  />
                </a>
                {r._highlightResult.url ? (
                  <a href={r.url}>
                    <div
                      className={url}
                      dangerouslySetInnerHTML={{
                        __html: r._highlightResult.url.value,
                      }}></div>
                  </a>
                ) : (
                  <a href={r.url}>
                    <div className={url}>{r.url}</div>
                  </a>
                )}

                <div
                  className={content}
                  dangerouslySetInnerHTML={{
                    __html:
                      r._highlightResult.content.value.length > 500
                        ? r._snippetResult.content.value
                        : r._highlightResult.content.value,
                  }}></div>
              </>
            )}
          </div>
        ))}
    </div>

    <div className={noResult}>
      {searched && results.length === 0 && (
        <>
          <p>
            <Trans i18nKey="search.resultTips.title" />
          </p>
          <ul className={tips}>
            <li>
              <Trans i18nKey="search.resultTips.content1" />
            </li>
            <li>
              <Trans i18nKey="search.resultTips.content2" />
            </li>
          </ul>
        </>
      )}
    </div>
  </div>
)
