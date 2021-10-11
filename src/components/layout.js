import Default from './layouts/default'
import Doc from './layouts/doc'
import PropTypes from 'prop-types'
import React from 'react'

const Layout = ({ children, pageContext }) => {
  if (pageContext.layout === 'doc') {
    return <Doc pageContext={pageContext}>{children}</Doc>
  }

  return <Default>{children}</Default>
}

Layout.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Layout
