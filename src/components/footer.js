import {
  Footer as BulmaFooter,
  Column,
  Columns,
  Container,
  Icon,
  Title,
} from '@seagreenio/react-bulma'
import { Link, useIntl } from 'gatsby-plugin-react-intl'
import { en, zh } from 'data/footer'
import { graphql, useStaticQuery } from 'gatsby'

import React from 'react'
import Socials from './socials'

const Footer = () => {
  const intl = useIntl()
  const { locale } = intl

  const { FooterLogoSVG } = useStaticQuery(graphql`
    query {
      FooterLogoSVG: file(relativePath: { eq: "pingcap-logo.svg" }) {
        publicURL
      }
    }
  `)
  const footerColumns = locale === 'zh' ? zh : en

  const handleSpreadItems = (e) => {
    const screenWidth = window.screen.width
    if (screenWidth > 768) {
      return
    }

    const title = e.currentTarget
    const spread = title.firstElementChild
    spread.classList.toggle('clicked')
    title.nextSibling.classList.toggle('displayed')
  }

  return (
    <BulmaFooter className="PingCAP-Footer">
      <Container>
        <Columns>
          {footerColumns.map((column) => (
            <Column key={column.name}>
              <Title size={6} onClick={handleSpreadItems}>
                {column.name}
                <span className="spread">
                  <Icon name="mdi mdi-plus" />
                </span>
              </Title>
              <ul className="items">
                {column.items.map((item) => (
                  <li key={item.name}>
                    {item.url.startsWith('/') ? (
                      <Link to={item.url}>{item.name}</Link>
                    ) : (
                      <a href={item.url} target="_blank" rel="noreferrer">
                        {item.name}
                      </a>
                    )}
                  </li>
                ))}
              </ul>
            </Column>
          ))}

          <Column>
            <Columns className="socials" multiline>
              <Socials className="column is-4" locale={locale} />
            </Columns>
          </Column>
        </Columns>

        <div className="annotations">
          <div className="copyright">
            ©{new Date().getFullYear()} PingCAP. All Rights Reserved.
          </div>
          <a href="https://pingcap.com" target="_blank" rel="noreferrer">
            <img className="logo" src={FooterLogoSVG.publicURL} alt="PingCAP" />
          </a>
        </div>
      </Container>
    </BulmaFooter>
  )
}

export default Footer
