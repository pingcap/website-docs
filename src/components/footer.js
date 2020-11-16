import { Link, graphql, useStaticQuery } from 'gatsby'
import React, { useState } from 'react'

import AddIcon from '@material-ui/icons/Add'
import LanguageIcon from '@material-ui/icons/Language'
import Socials from './socials'
import IntlLink from '../components/IntlLink'
import { footerColumnsZh, footerColumnsEn } from '../data/footer'
import { useLocation } from '@reach/router'
import { useSelector } from 'react-redux'
import { FormattedMessage } from 'react-intl'

const Footer = React.memo((prop) => {
  const locale = prop.locale
  const langSwitchable = prop.langSwitchable
  const location = useLocation()
  const currentPathname = location.pathname
  const footerColumns = locale === 'zh' ? footerColumnsZh : footerColumnsEn

  const { FooterLogoSVG } = useStaticQuery(
    graphql`
      query {
        FooterLogoSVG: file(relativePath: { eq: "pingcap-logo.svg" }) {
          publicURL
        }
      }
    `
  )

  const { docInfo } = useSelector((state) => state)

  const handleSpreadItems = (e) => {
    const screenWidth = window.screen.width
    if (screenWidth > 768) {
      return
    }

    const title = e.currentTarget
    const spread = title.children[0]
    title.tabIndex = title.tabIndex === 0 ? 1 : 0
    spread.classList.toggle('clicked')
    title.nextSibling.classList.toggle('displayed')
  }

  const Lang = ({ align }) => {
    const [dropdownActive, setDropdownActive] = useState('')

    const handleMenuOpen = () => {
      if (dropdownActive) {
        setDropdownActive('')
      } else {
        setDropdownActive(' is-active')
      }
    }

    const switchToLang = (lang) => {
      let preLang
      let path
      switch (lang) {
        case 'zh':
          preLang = '/zh'
          path = '/' + currentPathname.split('/').slice(1).join('/')
          break

        case 'en':
          preLang = ''
          path = '/' + currentPathname.split('/').slice(2).join('/')
          break

        default:
          break
      }

      return langSwitchable
        ? preLang + path
        : docInfo.type === 'tidbcloud' || docInfo.type === 'dev-guide'
        ? preLang + '/tidb/stable/'
        : preLang + '/' + docInfo.type + '/' + docInfo.version
    }

    return (
      <div className={`dropdown is-${align} is-up lang${dropdownActive}`}>
        <div
          role="button"
          tabIndex={0}
          className="dropdown-trigger"
          onClick={handleMenuOpen}
          onKeyDown={handleMenuOpen}
        >
          <LanguageIcon /> Language
        </div>
        <div className="dropdown-menu">
          <div className="dropdown-content">
            <Link
              to={locale === 'en' ? currentPathname : switchToLang('en')}
              className="dropdown-item"
            >
              English
              {!langSwitchable && locale === 'zh' && (
                <span className="tooltiptext">
                  <FormattedMessage id="langSwitchTip" />
                </span>
              )}
            </Link>
            <Link
              to={locale === 'zh' ? currentPathname : switchToLang('zh')}
              className="dropdown-item"
            >
              简体中文
              {!langSwitchable && locale === 'en' && (
                <span className="tooltiptext">
                  <FormattedMessage
                    id={
                      docInfo.type === 'tidbcloud'
                        ? 'cloudLangSwitchTip'
                        : 'langSwitchTip'
                    }
                  />
                </span>
              )}
            </Link>
          </div>
        </div>
      </div>
    )
  }

  return (
    <footer className="footer PingCAP-Footer">
      <div className="container">
        <div className="columns">
          {footerColumns.map((column) => (
            <div key={column.name} className="column">
              <div
                role="button"
                tabIndex={0}
                className="title is-7"
                onClick={handleSpreadItems}
                onKeyDown={handleSpreadItems}
              >
                {column.name}
                <span className="spread">
                  <AddIcon />
                </span>
              </div>
              <ul className="items">
                {column.items.map((item) => (
                  <li key={item.name}>
                    <IntlLink to={item.link} type={item.linkType}>
                      {item.name}
                    </IntlLink>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="column with-socials">
            <div className="columns is-multiline socials-desktop">
              <Socials className="column is-3" locale={locale} />
            </div>
          </div>
        </div>

        <div className="annotations annotations-desktop">
          <Lang align="left" />
          <div className="copyright">
            ©{new Date().getFullYear()} PingCAP. All Rights Reserved.
          </div>
          <IntlLink to="https://pingcap.com/" type="outBoundLink">
            <img
              className="footer-logo"
              src={FooterLogoSVG.publicURL}
              alt="footer logo"
            />
          </IntlLink>
        </div>

        <div className="annotations annotations-mobile">
          <Lang align="left" />
          <div className="copyright">
            ©{new Date().getFullYear()} PingCAP. All Rights Reserved.
          </div>
        </div>
        <div className="socials-mobile">
          <Socials locale={locale} />
        </div>
      </div>
    </footer>
  )
})

export default Footer
