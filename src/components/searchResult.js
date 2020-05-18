import React from 'react'
import { FormattedMessage } from 'react-intl'

const SearchResult = (props) => {
  const results = props.results

  return (
    <div className="search-result">
      <p className="counts">共 {results ? results.length : 0} 条搜索结果…</p>
      <div className="results">
        
        {results &&
          results.length > 0 &&
          results.map((r) => (
            <div className="item" key={r.objectID}>
              <a href={r.url}>
                <div className="title">{r.hierarchy.lvl0}</div>
              </a>
              <a href={r.url}>
                <div className="url">{r.url}</div>
              </a>
              <div
                className="content"
                dangerouslySetInnerHTML={{
                  __html:
                    r._highlightResult.content.value.length > 500
                      ? r._snippetResult.content.value
                      : r._highlightResult.content.value,
                }}
              ></div>
            </div>
          ))}
      </div>
      <div className="no-result">
        {results && results.length === 0 && (
          <>
            <p>
              <FormattedMessage id="search.resultTips.title" />
            </p>
            <ul className="tips">
              <li>
                <FormattedMessage id="search.resultTips.content1" />
              </li>
              <li>
                <FormattedMessage id="search.resultTips.content2" />
              </li>
            </ul>
          </>
        )}
      </div>
    </div>
  )
}

export default SearchResult
