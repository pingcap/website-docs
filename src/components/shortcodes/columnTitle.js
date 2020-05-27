import PropTypes from 'prop-types'
import React from 'react'

const ColumnTitle = ({ children }) => (
  <div className="column-title">{children}</div>
)

ColumnTitle.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ColumnTitle
