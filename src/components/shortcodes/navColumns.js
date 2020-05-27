import { FormattedMessage } from 'react-intl'
import Message from './message'
import PropTypes from 'prop-types'
import React from 'react'
import WarningIcon from '@material-ui/icons/Warning'

const NavColumns = ({ children }) => (
  <div className="PingCAP-Nav-Columns columns is-multiline">
      {children}
  </div>
)

NavColumns.propTypes = {
  children: PropTypes.node.isRequired,
}

export default NavColumns
