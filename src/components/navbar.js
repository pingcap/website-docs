import { FormattedMessage, Link, useIntl } from 'gatsby-plugin-react-intl'
import React, { useEffect, useState } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { useDispatch, useSelector } from 'react-redux'

import SearchInput from './search/input'
import { setSearchValue } from '../state'
import { useLocation } from '@reach/router'

const Navbar = () => {
  const { BrandSVG } = useStaticQuery(
    graphql`
      query {
        BrandSVG: file(relativePath: { eq: "pingcap-logo.svg" }) {
          publicURL
        }
      }
    `
  )

  const intl = useIntl()
  const { locale } = intl

  const location = useLocation()
  console.log(location.pathname)

  const dispatch = useDispatch()
  const { docInfo, searchValue } = useSelector((state) => state)

  const [activeNav, setActiveNav] = useState(null)
  const [showBorder, setShowBorder] = useState(false)
  const [burgerActive, setBurgerActive] = useState(false)
  const handleSetBurgerActive = () => setBurgerActive(!burgerActive)

  const handleSetSearchValue = (value) => dispatch(setSearchValue(value))

  // useEffect(() => {
  //   const nav =
  //     locale === 'zh'
  //       ? location.pathname.split('/')[2]
  //       : location.pathname.split('/')[1]

  //   setActiveNav(nav)
  // }, [locale, location.pathname])

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
          <img className="navbar-item" src={BrandSVG.publicURL} alt="brand" />

          <div className="navbar-item search-input-mobile">
            <SearchInput
              docInfo={docInfo}
              searchValue={searchValue}
              setSearchValue={handleSetSearchValue}
            />
          </div>

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
            <Link
              to="/tidb/stable"
              className={`navbar-item with-main-section ${
                activeNav === 'tidb' && !burgerActive ? 'is-active' : ''
              }`}
            >
              <FormattedMessage id="navbar.tidb" />
            </Link>

            <Link
              to="/tools"
              className={`navbar-item with-main-section ${
                (activeNav === 'tools' ||
                  activeNav === 'tidb-data-migration' ||
                  activeNav === 'tidb-in-kubernetes') &&
                !burgerActive
                  ? 'is-active'
                  : ''
              }`}
            >
              <FormattedMessage id="navbar.tools" />
            </Link>
            {locale === 'en' && (
              <Link
                to="/tidbcloud/public-preview"
                className={`navbar-item with-main-section ${
                  activeNav === 'tidbcloud' && !burgerActive ? 'is-active' : ''
                }`}
              >
                <FormattedMessage id="navbar.cloud" />
              </Link>
            )}
            {locale === 'zh' && (
              <Link
                to="/dev-guide/dev"
                className={`navbar-item with-main-section ${
                  activeNav === 'dev-guide' && !burgerActive ? 'is-active' : ''
                }`}
              >
                <FormattedMessage id="navbar.devGuide" />
              </Link>
            )}
            <a
              href={
                locale === 'zh'
                  ? 'https://pingcap.com/about-cn'
                  : 'https://pingcap.com/contact-us'
              }
              className="navbar-item with-main-section"
              target="_blank"
              rel="noreferrer"
            >
              <FormattedMessage id="navbar.contactUs" />
            </a>
          </div>
        </div>

        <div className="navbar-item search-input-pc">
          <SearchInput
            docInfo={docInfo}
            searchValue={searchValue}
            setSearchValue={handleSetSearchValue}
          />
        </div>
      </div>
    </nav>
  )
}

export default Navbar
