import { FormattedMessage } from 'gatsby-plugin-react-intl'
import { Icon } from '@seagreenio/react-bulma'
import Message from './message'
import PropTypes from 'prop-types'
import React from 'react'

const Note = ({ children }) => (
  <Message
    type="note"
    icon={<Icon name="mdi mdi-flag" />}
    title={<FormattedMessage id="shortcodes.note" />}
  >
    {children}
  </Message>
)

Note.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Note
