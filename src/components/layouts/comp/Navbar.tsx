import * as styles from './navbar.module.scss'

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
  NavbarItemProps,
} from '@seagreenio/react-bulma'
import {
  FormattedMessage,
  Link,
  changeLocale,
  useIntl,
} from 'gatsby-plugin-react-intl'
import { FC, useEffect, useState } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { useDispatch, useSelector } from 'react-redux'

import { Progress } from '@seagreenio/react-bulma'
import { SearchInput } from '../../search/Input'
import clsx from 'clsx'
import { setSearchValue } from 'state'

export function Navbar() {
  const { BrandSVG } = useStaticQuery(graphql`
    query {
      BrandSVG: file(relativePath: { eq: "pingcap-logo.svg" }) {
        publicURL
      }
    }
  `)

  const intl = useIntl()
  const { locale } = intl

  const dispatch = useDispatch()
  const { docInfo, langSwitchable, searchValue } = useSelector(
    state => state
  ) as any

  const enDisabled = !langSwitchable && locale === 'zh'
  const zhDisabled = !langSwitchable && locale === 'en'

  const [showBorder, setShowBorder] = useState(false)
  const [burgerActive, setBurgerActive] = useState(false)

  const handleSetSearchValue = (value: string) =>
    dispatch(setSearchValue(value))

  useEffect(() => {
    const documentElement = document.documentElement

    const scrollListener = () => {
      const progressEl = document.querySelector('progress')
      if (!progressEl) {
        return
      }

      const scrollHeight = documentElement.scrollHeight
      const clientHeight = documentElement.clientHeight
      const scrollTop = documentElement.scrollTop
      const scrolled = scrollTop > 0

      const height = scrollHeight - clientHeight
      if (height === 0) {
        return
      }
      const progress = Number(((scrollTop / height) * 100).toFixed())

      progressEl.value = progress

      setShowBorder(scrolled)
    }

    window.addEventListener('scroll', scrollListener)

    return () => window.removeEventListener('scroll', scrollListener)
  }, [])

  return (
    <BulmaNavbar
      as="nav"
      className={showBorder && styles.hasBorder}
      fixed="top"
      transparent>
      <Container>
        <NavbarBrand>
          <NavbarItem as="a" href="https://pingcap.com" target="_blank">
            <img
              className={styles.logo}
              src={BrandSVG.publicURL}
              alt="PingCAP"
            />
          </NavbarItem>

          <NavbarBurger
            className={styles.navbarBurger}
            aria-label="menu"
            aria-expanded={burgerActive}
            active={burgerActive}
            onClick={() => setBurgerActive(!burgerActive)}
          />
        </NavbarBrand>
        <NavbarMenu active={burgerActive}>
          <NavbarStart>
            <NavbarItem
              // @ts-ignore
              as={Link}
              className={styles.main}
              to="/tidb/stable">
              <FormattedMessage id="navbar.tidb" />
            </NavbarItem>
            {/* <NavbarItem as={Link} className={styles.main} to="/tools">
              <FormattedMessage id="navbar.tools" />
            </NavbarItem> */}
            {locale === 'en' && (
              <NavbarItem
                // @ts-ignore
                as={Link}
                className={styles.main}
                to="/tidbcloud/public-preview">
                <FormattedMessage id="navbar.cloud" />
              </NavbarItem>
            )}
            <NavbarItem
              // @ts-ignore
              as={Link}
              className={styles.main}
              to="/appdev/dev">
              <FormattedMessage id="navbar.appdev" />
            </NavbarItem>
            <NavbarItem
              className={styles.main}
              href={
                locale === 'en'
                  ? 'https://en.pingcap.com/download'
                  : 'https://pingcap.com/zh/product#SelectProduct'
              }>
              <FormattedMessage id="navbar.download" />
            </NavbarItem>
            <NavbarItem
              className={styles.main}
              href={
                locale === 'en'
                  ? 'https://en.pingcap.com/contact-us/'
                  : 'https://pingcap.com/zh/contact/'
              }>
              <FormattedMessage id="navbar.contactUs" />
            </NavbarItem>
          </NavbarStart>

          <NavbarEnd>
            <NavbarItem as="div" dropdown hoverable>
              <NavbarLink className={styles.langSwitch}>
                <FormattedMessage id="lang.title" />
              </NavbarLink>

              <NavbarDropdown boxed>
                <NavbarItem
                  className={clsx(
                    styles.langItem,
                    enDisabled && styles.disabled
                  )}
                  onClick={() => !enDisabled && changeLocale('en')}>
                  {enDisabled ? (
                    <FormattedMessage id="lang.cannotswitch" />
                  ) : (
                    <FormattedMessage id="lang.en" />
                  )}
                </NavbarItem>

                <NavbarItem
                  className={clsx(
                    styles.langItem,
                    zhDisabled && styles.disabled
                  )}
                  onClick={() => !zhDisabled && changeLocale('zh')}>
                  {zhDisabled ? (
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

      <Progress
        className={clsx(styles.progress, showBorder && styles.show)}
        color="primary"
        value={0}
        max={100}
      />
    </BulmaNavbar>
  )
}
