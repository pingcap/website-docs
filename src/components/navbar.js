import React, { useEffect, useState } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { useDispatch, useSelector } from 'react-redux'

// import { Button } from '@seagreenio/react-bulma'
import { FormattedMessage } from 'react-intl'
import IntlLink from '../components/IntlLink'
import SearchInput from './search/input'
import { setSearchValue } from '../state'

const Navbar = (prop) => {
  const locale = prop.locale
  const { BrandSVG } = useStaticQuery(
    graphql`
      query {
        BrandSVG: file(relativePath: { eq: "pingcap-logo.svg" }) {
          publicURL
        }
      }
    `
  )

  const dispatch = useDispatch()

  const { docInfo, searchValue } = useSelector((state) => state)

  const [showBorder, setShowBorder] = useState(false)
  const [burgerActive, setBurgerActive] = useState(false)
  const handleSetBurgerActive = () => setBurgerActive(!burgerActive)

  const handleSetSearchValue = (value) => dispatch(setSearchValue(value))

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
          <IntlLink
            className="navbar-item with-brand"
            to="https://pingcap.com/"
            type="outBoundLink"
          >
            <img
              className="navbar-brand"
              src={BrandSVG.publicURL}
              alt="brand"
            />
          </IntlLink>

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
            <IntlLink
              to="/tidb/v4.0"
              className="navbar-item with-main-section"
              type="innerLink"
            >
              <FormattedMessage id="navbar.tidb" />
            </IntlLink>

            <IntlLink
              to="/tools/"
              className="navbar-item with-main-section"
              type="innerLink"
            >
              <FormattedMessage id="navbar.tools" />
            </IntlLink>
            {locale === 'en' && (
              <IntlLink
                to="/tidbcloud/beta"
                className="navbar-item with-main-section"
              >
                <FormattedMessage id="navbar.cloud" />
              </IntlLink>
            )}
            <a
              href="mailto:info@pingcap.com"
              className="navbar-item with-main-section"
              target="_blank"
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
