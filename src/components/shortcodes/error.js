import AttachmentIcon from '@material-ui/icons/Attachment'
import { FormattedMessage } from 'react-intl'
import Message from './message'
import PropTypes from 'prop-types'
import React from 'react'

const Error = ({ children }) => (
  <Message
    type="error"
    icon={<AttachmentIcon style={{ color: '#ff4f5e' }} />}
    title={<FormattedMessage id="shortcodes.error" />}
  >
    {children}
  </Message>
)

Error.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Error
