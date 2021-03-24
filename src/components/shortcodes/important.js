import NotificationImportantIcon from '@material-ui/icons/NotificationImportant';
import { FormattedMessage } from 'react-intl'
import Message from './message'
import PropTypes from 'prop-types'
import React from 'react'

const Important = ({ children }) => (
  <Message
    type="important"
    icon={<NotificationImportantIcon style={{ color: '#f8c200' }} />}
    title={<FormattedMessage id="shortcodes.important" />}
  >
    {children}
  </Message>
)

Important.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Important
