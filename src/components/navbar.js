import React, { useEffect, useState } from 'react'
import { graphql, useStaticQuery } from 'gatsby'

import { Button } from '@seagreenio/react-bulma'
import { FormattedMessage } from 'react-intl'
import IntlLink from '../components/IntlLink'

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

  const [showBorder, setShowBorder] = useState(false)
  const [burgerActive, setBurgerActive] = useState(false)
  const handleSetBurgerActive = () => setBurgerActive(!burgerActive)

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
          </div>
        </div>
      </div>
    </nav>
  )
}

export default Navbar
