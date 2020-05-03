import PropTypes from 'prop-types'
import React from 'react'

const Layout = ({ children }) => (
  <>
    <main>{children}</main>
  </>
)

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
