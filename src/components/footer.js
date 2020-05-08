import { Link, graphql, useStaticQuery } from 'gatsby'

import AddIcon from '@material-ui/icons/Add'
import LanguageIcon from '@material-ui/icons/Language'
import React from 'react'
import Socials from './socials'
import { footerColumns } from '../data/footer'

const Footer = () => {
  const { FooterLogoSVG } = useStaticQuery(
    graphql`
      query {
        FooterLogoSVG: file(relativePath: { eq: "pingcap-logo.svg" }) {
          publicURL
        }
      }
    `
  )

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
                    <Link to="/" onTouchStart={() => {}}>
                      {item.name}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
          <div className="column with-socials">
            <img
              className="footer-logo"
              src={FooterLogoSVG.publicURL}
              alt="footer logo"
            />
            <div className="columns is-multiline socials-desktop">
              <Socials className="column is-4" type="follow" />
            </div>
            <div className="annotations annotations-desktop">
              <div className="lang">
                <LanguageIcon /> Language
              </div>
              <div className="copyright">
                ©{new Date().getFullYear()} PingCAP. All Rights Reserved.
              </div>
            </div>
          </div>
        </div>
        <div className="annotations annotations-mobile">
          <div className="lang">
            <LanguageIcon /> Language
          </div>
          <div className="copyright">
            ©{new Date().getFullYear()} PingCAP. All Rights Reserved.
          </div>
        </div>
        <div className="socials-mobile">
          <Socials type="follow" />
        </div>
      </div>
    </footer>
  )
}

export default Footer
