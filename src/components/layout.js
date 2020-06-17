import React, { useEffect } from 'react'
import { defaultDocInfo, getDocInfo } from '../state'

import Footer from './footer'
import { IntlProvider } from 'react-intl'
import Navbar from './navbar'
import PropTypes from 'prop-types'
import flat from 'flat'
import langMap from '../intl'
import { useDispatch } from 'react-redux'

const Layout = ({ locale, children, forbidResetDocInfo = false }) => {
  const dispatch = useDispatch()

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
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  )

  return (
    <IntlProvider locale={locale} messages={flat(langMap[locale])}>
      <Navbar locale={locale} />
      <main>{children}</main>
      <Footer locale={locale} />
    </IntlProvider>
  )
}

Layout.propTypes = {
  locale: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
  forbidResetDocInfo: PropTypes.bool,
}

export default Layout
