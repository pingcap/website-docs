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

  useEffect(() => {
    const documentElement = document.documentElement

    const scrollListener = () => {
      const progressEl = document.querySelector('progress')
      if (!progressEl) {
        return
      }

      const scrollHeight = documentElement.scrollHeight
      const clientHeight = documentElement.clientHeight
      const scrollTop = documentElement.scrollTop

      const height = scrollHeight - clientHeight
      const progress = ((scrollTop / height) * 100).toFixed()

      progressEl.value = progress

      if (scrollTop > 0) {
        progressEl.classList.add('show')
      } else {
        progressEl.classList.remove('show')
      }
    }

    window.addEventListener('scroll', scrollListener)

    return () => window.removeEventListener('scroll', scrollListener)
  }, [])

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
