import FlagIcon from '@material-ui/icons/Flag'
import { FormattedMessage } from 'react-intl'
import Message from './message'
import PropTypes from 'prop-types'
import React from 'react'

const Note = ({ children }) => (
  <Message
    type="note"
    icon={<FlagIcon style={{ color: '#10a6fa' }} />}
    title={<FormattedMessage id="shortcodes.note" />}
  >
    {children}
  </Message>
)

Note.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Note
