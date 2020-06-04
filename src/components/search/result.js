import { FormattedMessage } from 'react-intl'
import PropTypes from 'prop-types'
import React from 'react'

const Result = ({ results, searched }) => {
  console.log('results', results)
  return (
    <div className="search-result">
      <p className="counts">
        <FormattedMessage
          id="search.resultTips.counts"
          values={{ counts: results.length }}
        />
      </p>
      <div className="results">
        {results.length > 0 &&
          results.map((r) => (
            <div key={r.objectID} className="item">
              <a href={r.url}>
                <div className="title is-5">{r.hierarchy.lvl0}</div>
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
        {searched && results.length === 0 && (
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

Result.propTypes = {
  results: PropTypes.arrayOf(PropTypes.object).isRequired,
}

export default Result
