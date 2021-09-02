import {
  Navbar as BulmaNavbar,
  Container,
  NavbarBrand,
  NavbarBurger,
  NavbarDropdown,
  NavbarEnd,
  NavbarItem,
  NavbarLink,
  NavbarMenu,
  NavbarStart,
} from '@seagreenio/react-bulma'
import {
  FormattedMessage,
  Link,
  changeLocale,
  useIntl,
} from 'gatsby-plugin-react-intl'
import React, { useEffect, useState } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { useDispatch, useSelector } from 'react-redux'

import SearchInput from './search/input'
import { setSearchValue } from 'state'

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

  const dispatch = useDispatch()
  const { docInfo, langSwitchable, searchValue } = useSelector((state) => state)

  const [showBorder, setShowBorder] = useState(false)
  const [burgerActive, setBurgerActive] = useState(false)

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
    <BulmaNavbar
      as="nav"
      className={`PingCAP-Navbar${showBorder ? ' has-border-and-shadow' : ''}`}
      fixed="top"
      transparent
    >
      <Container>
        <NavbarBrand>
          <NavbarItem>
            <img className="logo" src={BrandSVG.publicURL} alt="PingCAP" />
          </NavbarItem>

          <NavbarBurger
            role="button"
            aria-label="menu"
            aria-expanded={burgerActive}
            active={burgerActive}
            onClick={() => setBurgerActive(!burgerActive)}
          />
        </NavbarBrand>
        <NavbarMenu active={burgerActive}>
          <NavbarStart>
            <NavbarItem as={Link} className="main" to="/tidb/stable">
              <FormattedMessage id="navbar.tidb" />
            </NavbarItem>

            <NavbarItem as={Link} className="main" to="/tools">
              <FormattedMessage id="navbar.tools" />
            </NavbarItem>

            {locale === 'en' && (
              <NavbarItem
                as={Link}
                className="main"
                to="/tidbcloud/public-preview"
              >
                <FormattedMessage id="navbar.cloud" />
              </NavbarItem>
            )}

            {locale === 'zh' && (
              <NavbarItem as={Link} className="main" to="/dev-guide/dev">
                <FormattedMessage id="navbar.devGuide" />
              </NavbarItem>
            )}
          </NavbarStart>

          <NavbarEnd>
            <NavbarItem
              className="main"
              href={
                locale === 'en'
                  ? 'https://pingcap.com/contact-us'
                  : 'https://pingcap.com/zh/about-us'
              }
              target="_blank"
              rel="noreferrer"
            >
              <FormattedMessage id="navbar.contactUs" />
            </NavbarItem>

            <NavbarItem as="div" className="lang-switch" dropdown hoverable>
              <NavbarLink>
                <FormattedMessage id="lang.title" />
              </NavbarLink>

              <NavbarDropdown boxed>
                <NavbarItem onClick={() => changeLocale('en')}>
                  {!langSwitchable && locale === 'zh' ? (
                    <FormattedMessage id="lang.cannotswitch" />
                  ) : (
                    <FormattedMessage id="lang.en" />
                  )}
                </NavbarItem>
                <NavbarItem onClick={() => changeLocale('zh')}>
                  {!langSwitchable && locale === 'en' ? (
                    <FormattedMessage
                      id={
                        docInfo.type === 'tidbcloud'
                          ? 'lang.cannotswitchtocloud'
                          : 'lang.cannotswitch'
                      }
                    />
                  ) : (
                    <FormattedMessage id="lang.zh" />
                  )}
                </NavbarItem>
              </NavbarDropdown>
            </NavbarItem>

            <NavbarItem as="div" className="search-input">
              <SearchInput
                docInfo={docInfo}
                searchValue={searchValue}
                setSearchValue={handleSetSearchValue}
              />
            </NavbarItem>
          </NavbarEnd>
        </NavbarMenu>
      </Container>
    </BulmaNavbar>
  )
}

export default Navbar
