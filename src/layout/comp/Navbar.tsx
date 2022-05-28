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
  Button,
} from '@seagreenio/react-bulma'
import { Link, Trans, useI18next } from 'gatsby-plugin-react-i18next'
import { useEffect, useState } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { useDispatch, useSelector } from 'react-redux'

import { Progress } from '@seagreenio/react-bulma'
import { SearchInput } from './Input'
import clsx from 'clsx'
import { setSearchValue } from 'state'
import { Locale } from 'typing'
import {
  show,
  progress,
  navbarBurger,
  hasBorder,
  logo,
  main,
  langSwitch,
  langItem,
  disabled,
  tryTidbCloudBtn,
} from './navbar.module.scss'

interface Props {
  locale: Locale[]
}

export function Navbar({ locale }: Props) {
  const { BrandSVG } = useStaticQuery(graphql`
    query {
      BrandSVG: file(relativePath: { eq: "pingcap-logo.svg" }) {
        publicURL
      }
    }
  `)

  const { language, changeLanguage } = useI18next()

  const dispatch = useDispatch()
  const { docInfo, searchValue } = useSelector(state => state) as any

  const enDisabled = !locale.includes(Locale.en)
  const zhDisabled = !locale.includes(Locale.zh)

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
      className={showBorder && hasBorder}
      fixed="top"
      transparent>
      <Container>
        <NavbarBrand>
          <NavbarItem as="a" href="https://pingcap.com" target="_blank">
            <img className={logo} src={BrandSVG.publicURL} alt="PingCAP" />
          </NavbarItem>

          <NavbarBurger
            className={navbarBurger}
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
              className={main}
              to="/tidb/stable">
              <Trans i18nKey="navbar.tidb" />
            </NavbarItem>
            {language === 'en' && (
              <NavbarItem
                // @ts-ignore
                as={Link}
                className={main}
                to="/tidbcloud/">
                <Trans i18nKey="navbar.cloud" />
              </NavbarItem>
            )}
            <NavbarItem
              // @ts-ignore
              as={Link}
              className={main}
              to="/appdev/dev">
              <Trans i18nKey="navbar.appdev" />
            </NavbarItem>
            <NavbarItem
              className={main}
              href={
                language === 'en'
                  ? 'https://en.pingcap.com/download'
                  : 'https://pingcap.com/zh/product#SelectProduct'
              }>
              <Trans i18nKey="navbar.download" />
            </NavbarItem>
            <NavbarItem
              className={main}
              href={
                language === 'en'
                  ? 'https://en.pingcap.com/contact-us/'
                  : 'https://pingcap.com/zh/contact/'
              }>
              <Trans i18nKey="navbar.contactUs" />
            </NavbarItem>
          </NavbarStart>

          <NavbarEnd>
            <NavbarItem as="div" dropdown hoverable>
              <NavbarLink className={langSwitch}>
                <Trans i18nKey="lang.title" />
              </NavbarLink>

              <NavbarDropdown boxed>
                <NavbarItem
                  className={clsx(langItem, enDisabled && disabled)}
                  onClick={() => !enDisabled && changeLanguage('en')}>
                  {enDisabled ? (
                    <Trans i18nKey="lang.cannotswitch" />
                  ) : (
                    <Trans i18nKey="lang.en" />
                  )}
                </NavbarItem>

                <NavbarItem
                  className={clsx(langItem, zhDisabled && disabled)}
                  onClick={() => !zhDisabled && changeLanguage('zh')}>
                  {zhDisabled ? (
                    <Trans
                      i18nKey={
                        docInfo.type === 'tidbcloud'
                          ? 'lang.cannotswitchtocloud'
                          : 'lang.cannotswitch'
                      }
                    />
                  ) : (
                    <Trans i18nKey="lang.zh" />
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

            {language === 'en' && (
              <>
                <NavbarItem
                  className={main}
                  href={`https://tidbcloud.com/signin`}
                  referrerPolicy="no-referrer-when-downgrade"
                  target="_blank">
                  Sign In
                </NavbarItem>
                <NavbarItem as="div">
                  <a
                    href="https://tidbcloud.com/signup?_ga=2.92391197.1421016400.1651713063-598142147.1627626898"
                    className={clsx('button', tryTidbCloudBtn)}
                    // https://developer.chrome.com/blog/referrer-policy-new-chrome-default/
                    referrerPolicy="no-referrer-when-downgrade"
                    target="_blank">
                    Try Free
                  </a>
                </NavbarItem>
              </>
            )}
          </NavbarEnd>
        </NavbarMenu>
      </Container>

      <Progress
        className={clsx(progress, showBorder && show)}
        color="primary"
        value={0}
        max={100}
      />
    </BulmaNavbar>
  )
}
