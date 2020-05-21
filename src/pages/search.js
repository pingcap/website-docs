import Layout from '../components/layout'
import React, { useState, useEffect } from 'react'
import SEO from '../components/seo'
import '../styles/templates/search.scss'
// import docsTypeVersions from '../data/docs-type-version'
// import SearchResult from '../components/searchResult'
// import algoliasearch from 'algoliasearch'
// import Loading from '../components/loading'
// import { FormattedMessage } from 'react-intl'

const Search = ({ pageContext: { locale } }) => {
  // const params = new URLSearchParams(window.location.search)
  // const initialType = params.get('type') || 'All'
  // const initialVersion = params.get('version') || 'v4.0'
  // const initialRelatedVersions = (initialType) => {
  //   switch (initialType) {
  //     case 'tidb':
  //       return ['v4.0', 'dev', 'v3.1', 'v3.0', 'v2.1']
  //     case 'tidb-operator':
  //       return ['v1.1', 'dev', 'v1.0']
  //     case 'tidb-data-migration':
  //       return ['v1.0', 'dev']
  //     default:
  //       return ['v4.0', 'dev', 'v3.1', 'v3.0', 'v2.1', 'v1.1', 'v1.0']
  //   }
  // }
  // const lang = window.location.href.includes('zh') ? 'zh' : 'en'
  // const query = params.get('q')
  // const [selectedType, setSelectedType] = useState(initialType)
  // const [seletedVersion, setSelectedVersion] = useState(initialVersion)
  // const [relatedVersions, setRelatedVersions] = useState(initialRelatedVersions(initialType))
  // const [results, setResults] = useState(null)
  // const [isLoading, setIsLoading] = useState(true)

  // const docsTypeChange = (type, versions) => {
  //   setSelectedType(type.toLowerCase().replace(/\s/g, '-'))
  //   setRelatedVersions(versions)
  //   setSelectedVersion(versions[0])
  // }

  // const versionChange = (version) => {
  //   setSelectedVersion(version)
  // }

  // function initSearch(lang, version, type, query) {
  //   const client = algoliasearch(
  //     '5KATFRAPFH',
  //     'dd9578a6d402b9ad3a874d19ab5dafb4'
  //   )
  //   const index = client.initIndex(lang + '-' + version)
  //   let newHitArray = []
  //   const docsType =
  //     type === 'all' ? '' : type.toLowerCase().replace(/\s/g, '-')

  //   index
  //     .search(query, {
  //       hitsPerPage: 300,
  //       facetFilters: ['docs_type:' + docsType, 'version:' + version]
  //     })
  //     .then(({ hits }) => {

  //       // selects the first result of each category and puts into the new hit array
  //       newHitArray = hits.filter((hit) => {

  //           // unifies anchor style
  //           const lastLvl = Object.values(hit.hierarchy)
  //             .filter((value) => value != null)
  //             .pop()
  //           hit['url'] = hit.url.replace(
  //             /#.*$/g,
  //             '#' +
  //               lastLvl
  //                 .replace(/\s+/g, '-')
  //                 .replace(/[^-\w\u4E00-\u9FFF]*/g, '')
  //                 .toLowerCase()
  //           )
  //           return hit
  //       })

  //       setResults(newHitArray)
  //       setIsLoading(false)
  //     })
  // }

  // useEffect(() => {
  //   const queryString = `?type=${selectedType}&version=${seletedVersion}&q=${query}`
  //   window.history.pushState('', '', queryString)
  //   if (query) {
  //     initSearch(lang, seletedVersion, selectedType, query)
  //   }
  //   setResults(null)
  //   setIsLoading(true)
  // }, [selectedType, relatedVersions, seletedVersion, query, lang])

  return (
    <Layout locale={locale}>
      <SEO title="Docs search" />
      {/* <div className="section container Docs-search">
        <div className="filter-field">
          <div className="filter columns">
            <div className="label column is-1"><FormattedMessage id="search.type" /></div>
            <div className="type-list column">
              {docsTypeVersions.map((type) => (
                <div key={type.name}>
                  {type.name === 'Tools' ? (
                    <div
                      className={`item${
                        selectedType === 'tidb-operator' ||
                        selectedType === 'tidb-data-migration'
                          ? ' active'
                          : ''
                      }`}
                    >
                      Tools
                      <div className="tools-dropdown">
                        {type.items.map((t) => (
                          <div
                            key={t.name}
                            className="dropdown-item"
                            onClick={() => docsTypeChange(t.name, t.versions)}
                          >
                            {t.name}
                          </div>
                        ))}
                      </div>
                    </div>
                  ) : (
                    <div
                      className={`item${
                        selectedType === type.name.toLowerCase() ? ' active' : ''
                      }`}
                      onClick={() => docsTypeChange(type.name, type.versions)}
                    >
                      {type.name}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
          <div className="filter columns">
            <div className="label column is-1"><FormattedMessage id="search.version" /></div>
            <div className="type-list column">
              {relatedVersions &&
                relatedVersions.map((v) => (
                  <span
                    key={v}
                    className={`item${seletedVersion === v ? ' active' : ''}`}
                    onClick={() => versionChange(v)}
                  >
                    {v}
                  </span>
                ))}
            </div>
          </div>
        </div>
        <SearchResult results={results} />
        <Loading isLoading={isLoading}/>
      </div> */}
    </Layout>
  )
}

export default Search
