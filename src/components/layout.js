import 'styles/global.scss'

import Default from './layouts/default'
import Doc from './layouts/doc'
import PropTypes from 'prop-types'

const Layout = ({ children, pageContext }) => {
  if (pageContext.layout === 'doc') {
    return <Doc pageContext={pageContext}>{children}</Doc>
  }

  return <Default>{children}</Default>
}

Layout.propTypes = {
  children: PropTypes.oneOfType([PropTypes.node, PropTypes.func]),
}

export default Layout
