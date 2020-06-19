import AttachmentIcon from '@material-ui/icons/Attachment'
import { FormattedMessage } from 'react-intl'
import Message from './message'
import PropTypes from 'prop-types'
import React from 'react'

const Tip = ({ children }) => (
  <Message
    type="tip"
    icon={<AttachmentIcon style={{ color: '#a9d359' }} />}
    title={<FormattedMessage id="shortcodes.tip" />}
  >
    {children}
  </Message>
)

Tip.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Tip
