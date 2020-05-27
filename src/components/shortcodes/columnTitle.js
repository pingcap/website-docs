import { FormattedMessage } from 'react-intl'
import Message from './message'
import PropTypes from 'prop-types'
import React from 'react'
import WarningIcon from '@material-ui/icons/Warning'

const ColumnTitle = ({ children }) => (
  <div className="column-title">
      {children}
  </div>
)

ColumnTitle.propTypes = {
  children: PropTypes.node.isRequired,
}

export default ColumnTitle
