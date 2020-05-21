import React, { useState, useEffect } from 'react'
import {injectIntl } from 'react-intl'

const SearchInput = ({ intl }) => {
    const placeholder = intl.formatMessage({ id: 'navbar.searchDocs' })
    const versionRegx = /v\d.\d|dev/
    const [version, setVersion] = useState(null)
    const [docsType, setDocsType] = useState(null)
    const [lang, setLang] = useState(null)
    const [searchQuery, setSearchQuery] = useState(null)

    function getParams() {
        const searchQuery = new URLSearchParams(window.location.search)
        let _version = searchQuery.get('version') || ''
        let _docsType = searchQuery.get('type') || ''
        const params = window.location.pathname
        const paramsArr = params.split('/')
        let _lang = paramsArr[1] === 'zh' ? 'zh/' : ''
    
        if (!_version || !_docsType) {
          _version = params.match(versionRegx) ? params.match(versionRegx)[0] : ''
          switch (_lang) {
            case 'zh/':
              _docsType = paramsArr[2]
              break
            default:
              _docsType = paramsArr[1]
              break
          }
        }
    
        if (_docsType === 'tidb-in-kubernetes') {
          _docsType = 'tidb-operator'
        }
    
        setVersion(_version)
        setDocsType(_docsType)
        setLang(_lang)
      }
    
      function searchQueryChanged(e) {
        setSearchQuery(e.target.value)
      }
    
      useEffect(() => {
        getParams()
      }, [searchQuery])

    return (
        <form
              className="with-search-input"
              method="post"
              action={`/${lang}search?type=${docsType}&version=${version}&q=${searchQuery}`}
            >
              <input
                className="search-input"
                type="search"
                name="search"
                placeholder={placeholder}
                onChange={searchQueryChanged}
              />
            </form>
    )
}

export default injectIntl(SearchInput)
