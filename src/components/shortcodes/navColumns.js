import PropTypes from 'prop-types'
import React from 'react'

const NavColumns = ({ children }) => (
  <div className="PingCAP-Nav-Columns columns is-multiline">{children}</div>
)

NavColumns.propTypes = {
  children: PropTypes.node.isRequired,
}

export default NavColumns
