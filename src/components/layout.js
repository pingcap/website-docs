import React, { useEffect } from 'react'
import { defaultDocInfo, getDocInfo } from '../state'

import Footer from './footer'
import { IntlProvider } from 'react-intl'
import Navbar from './navbar'
import PropTypes from 'prop-types'
import flat from 'flat'
import { globalHistory } from '@reach/router'
import langMap from '../intl'
import { navigate } from 'gatsby-link'
import { useDispatch } from 'react-redux'

const Layout = ({
  locale,
  children,
  forbidResetDocInfo = false,
  langSwitchable,
}) => {
  const dispatch = useDispatch()

  const setGlobalForPluginsUse = () => {
    window.DOCS_PINGCAP = {
      globalHistory,
      navigate,
    }
  }

  useEffect(
    () => {
      if (!forbidResetDocInfo) {
        dispatch(
          getDocInfo({
            ...defaultDocInfo,
            ...{
              lang: locale,
            },
          })
        )
      }

      setGlobalForPluginsUse()
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <IntlProvider locale={locale} messages={flat(langMap[locale])}>
      <Navbar locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} langSwitchable={langSwitchable} />
    </IntlProvider>
  )
}

Layout.propTypes = {
  locale: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  forbidResetDocInfo: PropTypes.bool,
}

export default Layout
