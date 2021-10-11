import { Container, Section } from '@seagreenio/react-bulma'
import React, { useEffect } from 'react'

import Footer from 'components/footer'
import Navbar from 'components/navbar'
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
  children: PropTypes.node.isRequired,
}

export default Layout
