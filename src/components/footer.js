import {
  Footer as BulmaFooter,
  Column,
  Columns,
  Icon,
} from '@seagreenio/react-bulma'
import { Link, useIntl } from 'gatsby-plugin-react-intl'
import { footerColumnsEn, footerColumnsZh } from 'data/footer'
import { graphql, useStaticQuery } from 'gatsby'

import React from 'react'
import Socials from './socials'

const Footer = () => {
  const intl = useIntl()
  const { locale } = intl

  const { FooterLogoSVG } = useStaticQuery(
    graphql`
      query {
        FooterLogoSVG: file(relativePath: { eq: "pingcap-logo.svg" }) {
          publicURL
        }
      }
    `
  )
  const footerColumns = locale === 'zh' ? footerColumnsZh : footerColumnsEn

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

  return (
    <BulmaFooter className="PingCAP-Footer">
      <div className="container">
        <div className="columns">
          {footerColumns.map((column) => (
            <div key={column.name} className="column">
              <div
                role="button"
                tabIndex={0}
                className="title is-6"
                onClick={handleSpreadItems}
                onKeyDown={handleSpreadItems}
              >
                {column.name}
                <span className="spread">
                  <Icon name="mdi mdi-plus" />
                </span>
              </div>
              <ul className="items">
                {column.items.map((item) => (
                  <li key={item.name}>
                    {item.type === 'internal' ? (
                      <Link to={item.link}>{item.name}</Link>
                    ) : (
                      <a href={item.link} target="_blank" rel="noreferrer">
                        {item.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <Column>
            <Columns className="socials-desktop" multiline>
              <Socials className="column is-4" locale={locale} />
            </Columns>
          </Column>
        </div>

        <div className="annotations annotations-desktop">
          <div className="copyright">
            ©{new Date().getFullYear()} PingCAP. All Rights Reserved.
          </div>
          <a href="https://pingcap.com" target="_blank" rel="noreferrer">
            <img
              className="footer-logo"
              src={FooterLogoSVG.publicURL}
              alt="footer logo"
            />
          </a>
        </div>

        <div className="annotations annotations-mobile">
          <div className="copyright">
            ©{new Date().getFullYear()} PingCAP. All Rights Reserved.
          </div>
        </div>
        <div className="socials-mobile">
          <Socials locale={locale} />
        </div>
      </div>
    </BulmaFooter>
  )
}

export default Footer
