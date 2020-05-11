import Footer from './footer'
import { IntlProvider } from 'react-intl'
import Navbar from './navbar'
import PropTypes from 'prop-types'
import React from 'react'
import langMap from '../intl'
import flat from 'flat'

const Layout = ({ locale, children }) => (
  <IntlProvider locale={locale} messages={flat(langMap[locale])}>
    <Navbar />
    <main>{children}</main>
    <Footer />
  </IntlProvider>
)

Layout.propTypes = {
  locale: PropTypes.string.isRequired,
  children: PropTypes.node.isRequired,
}

export default Layout
