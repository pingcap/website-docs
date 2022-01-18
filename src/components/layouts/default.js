import { Container, Section } from '@seagreenio/react-bulma'
import { useEffect } from 'react'

import { Footer } from './comp/Footer'
import { Navbar } from 'components/layouts/comp/Navbar'
import PropTypes from 'prop-types'
import { globalHistory } from '@reach/router'
import { navigate } from 'gatsby'

const Layout = ({ children }) => {
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
      <Navbar />
      <Section as="main">
        <Container>{children}</Container>
      </Section>
      <Footer />
    </>
  )
}

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
}

export default Layout
