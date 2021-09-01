import { Container, Section } from '@seagreenio/react-bulma'
import React, { useEffect } from 'react'
import { defaultDocInfo, setDocInfo } from '../state'

import Footer from './footer'
import Navbar from './navbar'
import PropTypes from 'prop-types'
import { globalHistory } from '@reach/router'
import { navigate } from 'gatsby'
import { useDispatch } from 'react-redux'

const Layout = ({ children }) => {
  const dispatch = useDispatch()

  const setGlobalForPluginsUse = () => {
    if (!window.DOCS_PINGCAP) {
      window.DOCS_PINGCAP = {
        globalHistory,
        navigate,
      }
    }
  }

  // useEffect(() => {
  //   if (autoResetDocInfo) {
  //     dispatch(
  //       setDocInfo({
  //         ...defaultDocInfo,
  //         ...{
  //           lang: locale,
  //         },
  //       })
  //     )
  //   }
  // }, [dispatch, autoResetDocInfo, locale])

  useEffect(setGlobalForPluginsUse, [])

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
