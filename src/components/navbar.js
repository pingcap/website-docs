import React, { useEffect, useState } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { useDispatch, useSelector } from 'react-redux'

// import { Button } from '@seagreenio/react-bulma'
import { FormattedMessage } from 'react-intl'
import IntlLink from '../components/IntlLink'
import SearchInput from './search/input'
import { setSearchValue } from '../state'

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
          <IntlLink className="navbar-item with-brand" to="/">
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
            <IntlLink to="/tidb/v4.0" className="navbar-item with-main-section">
              <FormattedMessage id="navbar.tidb" />
            </IntlLink>
            <IntlLink to="/tools/" className="navbar-item with-main-section">
              <FormattedMessage id="navbar.tools" />
            </IntlLink>
            {/* <IntlLink to="/cloud" className="navbar-item with-main-section">
              <FormattedMessage id="navbar.cloud" />
            </IntlLink>
            <IntlLink
              to="/developer-guide"
              className="navbar-item with-main-section has-no-border"
            >
              <FormattedMessage id="navbar.developerGuide" />
            </IntlLink> */}
            {/* <div className="navbar-item with-contact-us">
              <Button as="a" className="contact-us" color="primary" rounded>
                <FormattedMessage id="navbar.contactUs" />
              </Button>
            </div> */}
            <a
              href="mailto:info@pingcap.com"
              className="navbar-item with-main-section"
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
