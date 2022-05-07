import { Container, Section } from '@seagreenio/react-bulma'
import { PropsWithChildren, useEffect } from 'react'

import { Footer } from './comp/Footer'
import { Navbar } from 'layout/comp/Navbar'
import { globalHistory } from '@reach/router'
import { navigate } from 'gatsby'
import 'styles/global.scss'
import { Locale } from 'typing'

declare global {
  interface Window {
    DOCS_PINGCAP: any
  }
}

interface Props {
  locale?: Locale[]
}

export function Layout({
  children,
  locale = [Locale.en, Locale.zh, Locale.ja],
}: PropsWithChildren<Props>) {
  useEffect(() => {
    if (!window.DOCS_PINGCAP) {
      window.DOCS_PINGCAP = {
        globalHistory,
        navigate,
      }
    }
  }, [])

  return (
    <>
      <Navbar locale={locale} />
      <Section as="main">
        <Container>{children}</Container>
      </Section>
      <Footer />
    </>
  )
}
