import * as styles from './footer.module.scss'

import {
  Footer as BulmaFooter,
  Column,
  Columns,
  Container,
  Icon,
  Title,
} from '@seagreenio/react-bulma'
import { Link, useIntl } from 'gatsby-plugin-react-intl'
import React, { useState } from 'react'
import { en, zh } from 'data/footer'
import { graphql, useStaticQuery } from 'gatsby'

import Socials from './socials'
import clsx from 'clsx'

const Footer = () => {
  const { locale } = useIntl()
  const [spread, setSpread] = useState(-1)

  const { FooterLogoSVG } = useStaticQuery(graphql`
    query {
      FooterLogoSVG: file(relativePath: { eq: "pingcap-logo.svg" }) {
        publicURL
      }
    }
  `)
  const footerColumns = locale === 'zh' ? zh : en

  const handleSpreadItems = index => () => {
    const screenWidth = window.screen.width
    if (screenWidth > 768) {
      return
    }

    setSpread(spread === index ? -1 : index)
  }

  return (
    <BulmaFooter className={styles.footer}>
      <Container>
        <Columns>
          {footerColumns.map((column, index) => (
            <Column key={column.name}>
              <Title
                className={styles.title}
                size={6}
                onClick={handleSpreadItems(index)}
              >
                {column.name}
                <span
                  className={clsx(
                    styles.spread,
                    index === spread && styles.clicked
                  )}
                >
                  <Icon name="mdi mdi-plus" />
                </span>
              </Title>
              <ul
                className={clsx(
                  styles.items,
                  index === spread && styles.displayed
                )}
              >
                {column.items.map(item => (
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
            <Columns className={styles.socials} multiline>
              <Socials
                className={clsx('column is-4', styles.column)}
                locale={locale}
              />
            </Columns>
          </Column>
        </Columns>

        <div className={styles.annotations}>
          <div className={styles.copyright}>
            ©{new Date().getFullYear()} PingCAP. All Rights Reserved.
          </div>
          <a href="https://pingcap.com" target="_blank" rel="noreferrer">
            <img
              className={styles.logo}
              src={FooterLogoSVG.publicURL}
              alt="PingCAP"
            />
          </a>
        </div>
      </Container>
    </BulmaFooter>
  )
}

export default Footer
