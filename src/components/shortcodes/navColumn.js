import '../../styles/components/navCloumns.scss'

import PropTypes from 'prop-types'
import React from 'react'

const NavColumn = ({ children }) => (
  <div className="column is-4">
      {children}
  </div>
)

NavColumn.propTypes = {
  children: PropTypes.node.isRequired,
}

export default NavColumn
