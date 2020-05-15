import { FormattedMessage } from 'react-intl'
import Message from './message'
import PropTypes from 'prop-types'
import React from 'react'
import WarningIcon from '@material-ui/icons/Warning'

const Warning = ({ children }) => (
  <Message
    type="warning"
    icon={<WarningIcon style={{ color: '#f15a24' }} />}
    title={<FormattedMessage id="shortcodes.warning" />}
  >
    {children}
  </Message>
)

Warning.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Warning
