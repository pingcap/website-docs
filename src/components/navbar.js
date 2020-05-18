import React, { useEffect, useState } from 'react'
import { graphql, useStaticQuery } from 'gatsby'

import { Button } from '@seagreenio/react-bulma'
import { FormattedMessage, injectIntl } from 'react-intl'
import IntlLink from '../components/IntlLink'

const Navbar = ({ intl }) => {
  const { BrandSVG } = useStaticQuery(
    graphql`
      query {
        BrandSVG: file(relativePath: { eq: "pingcap-logo.svg" }) {
          publicURL
        }
      }
    `
  )

  const [showBorder, setShowBorder] = useState(false)
  const [burgerActive, setBurgerActive] = useState(false)
  const handleSetBurgerActive = () => setBurgerActive(!burgerActive)
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

  useEffect(() => {
    const scrollListener = () => {
      const winScrollTop = document.documentElement.scrollTop

      setShowBorder(winScrollTop > 0)
    }

    window.addEventListener('scroll', scrollListener)

    return () => window.removeEventListener('scroll', scrollListener)
  }, [])

  return (
    <nav
      className={`navbar is-fixed-top PingCAP-Navbar${
        showBorder ? ' has-border-and-shadow' : ''
      }`}
      role="navigation"
    >
      <div className="container">
        <div className="navbar-brand">
          <IntlLink className="navbar-item with-brand" to="/">
            <img
              className="navbar-brand"
              src={BrandSVG.publicURL}
              alt="brand"
            />
          </IntlLink>

          <button
            className={`navbar-burger${burgerActive ? ' is-active' : ''}`}
            aria-label="menu"
            aria-expanded="false"
            onClick={handleSetBurgerActive}
          >
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
            <span aria-hidden="true"></span>
          </button>
        </div>
        <div className={`navbar-menu${burgerActive ? ' is-active' : ''}`}>
          <div className="navbar-end">
            <IntlLink
              to="/tidb"
              className="navbar-item with-main-section"
              onTouchStart={() => {}}
            >
              <FormattedMessage id="navbar.tidb" />
            </IntlLink>
            <IntlLink
              to="/tools"
              className="navbar-item with-main-section"
              onTouchStart={() => {}}
            >
              <FormattedMessage id="navbar.tools" />
            </IntlLink>
            <IntlLink
              to="/cloud"
              className="navbar-item with-main-section"
              onTouchStart={() => {}}
            >
              <FormattedMessage id="navbar.cloud" />
            </IntlLink>
            <IntlLink
              to="/developer-guide"
              className="navbar-item with-main-section has-no-border"
              onTouchStart={() => {}}
            >
              <FormattedMessage id="navbar.developerGuide" />
            </IntlLink>
            <div className="navbar-item with-contact-us">
              <Button as="a" className="contact-us" color="primary" rounded>
                <FormattedMessage id="navbar.contactUs" />
              </Button>
            </div>
            <form
              className="navbar-item with-search-input"
              method="post"
              action={`/${lang}search?type=${docsType}&version=${version}&q=${searchQuery}`}
            >
              <input
                className="search-input"
                type="search"
                placeholder={placeholder}
                onChange={searchQueryChanged}
              />
            </form>
          </div>
        </div>
      </div>
    </nav>
  )
}

export default injectIntl(Navbar)
