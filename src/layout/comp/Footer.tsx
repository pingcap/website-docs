import {
  annotations,
  clicked,
  column,
  copyright,
  displayed,
  footer,
  items,
  logo,
  title,
  spread as spreadStyle,
  socials,
} from './footer.module.scss'

import {
  Footer as BulmaFooter,
  Column,
  Columns,
  Container,
  Title,
} from '@seagreenio/react-bulma'
import { Link, useI18next } from 'gatsby-plugin-react-i18next'
import { useState } from 'react'
import { graphql, useStaticQuery } from 'gatsby'
import { MdAdd } from 'react-icons/md'

import { en, zh, ja } from './footer.data'
import { Socials } from './Socials'
import clsx from 'clsx'
import { Locale } from 'typing'

export function Footer() {
  const { language } = useI18next()
  const [spread, setSpread] = useState<number | undefined>(undefined)

  const { FooterLogoSVG } = useStaticQuery(graphql`
    query {
      FooterLogoSVG: file(relativePath: { eq: "pingcap-logo.svg" }) {
        publicURL
      }
    }
  `)
  const getFooterData = (lang: string) => {
    let result = en
    switch (lang) {
      case 'zh':
        result = zh
        break
      case 'ja':
        result = ja
        break
      default:
        break
    }
    return result
  }
  const footerColumns = getFooterData(language)

  const handleSpreadItems = (index: number) => () => {
    const screenWidth = window.screen.width
    if (screenWidth > 768) {
      return
    }

    setSpread(spread === index ? undefined : index)
  }

  return (
    <BulmaFooter className={footer}>
      <Container>
        <Columns>
          {footerColumns.map((column, index) => (
            <Column key={column.name}>
              <Title
                className={title}
                size={6}
                onClick={handleSpreadItems(index)}>
                {column.name}
                <span
                  className={clsx(spreadStyle, index === spread && clicked)}>
                  <MdAdd />
                </span>
              </Title>
              <ul className={clsx(items, index === spread && displayed)}>
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
            {/* <Columns className={socials} multiline>
              <Socials
                className={clsx('column is-4', column)}
                locale={language as Locale}
              />
            </Columns> */}
            <div className={socials}>
              <Socials
                // className={clsx('column is-4', column)}
                locale={language as Locale}
              />
            </div>
          </Column>
        </Columns>

        <div className={annotations}>
          <div className={copyright}>
            ©{new Date().getFullYear()} PingCAP. All Rights Reserved.
          </div>
          <a href="https://pingcap.com" target="_blank" rel="noreferrer">
            <img className={logo} src={FooterLogoSVG.publicURL} alt="PingCAP" />
          </a>
        </div>
      </Container>
    </BulmaFooter>
  )
}
