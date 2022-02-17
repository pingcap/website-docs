import { Container, Section } from '@seagreenio/react-bulma'
import { PropsWithChildren, useEffect } from 'react'

import { Footer } from './comp/Footer'
import { Navbar } from 'layout/comp/Navbar'
import { globalHistory } from '@reach/router'
import { navigate } from 'gatsby'
import 'styles/global.scss'

declare global {
  interface Window {
    DOCS_PINGCAP: any
  }
}

interface Props {
  langSwitchable?: boolean
}

export function Layout({
  children,
  langSwitchable = true,
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
      <Navbar langSwitchable={langSwitchable} />
      <Section as="main">
        <Container>{children}</Container>
      </Section>
      <Footer />
    </>
  )
}
