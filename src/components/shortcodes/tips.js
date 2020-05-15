import AttachmentIcon from '@material-ui/icons/Attachment'
import { FormattedMessage } from 'react-intl'
import Message from './message'
import PropTypes from 'prop-types'
import React from 'react'

const Tips = ({ children }) => (
  <Message
    type="tips"
    icon={<AttachmentIcon style={{ color: '#a9d359' }} />}
    title={<FormattedMessage id="shortcodes.tips" />}
  >
    {children}
  </Message>
)

Tips.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Tips
