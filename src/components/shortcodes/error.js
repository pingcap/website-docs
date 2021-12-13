import { FormattedMessage } from 'gatsby-plugin-react-intl'
import { Icon } from '@seagreenio/react-bulma'
import Message from './message'
import PropTypes from 'prop-types'
import React from 'react'

const Error = ({ children }) => (
  <Message
    type="error"
    icon={<Icon name="mdi mdi-close-circle" />}
    title={<FormattedMessage id="shortcodes.error" />}
  >
    {children}
  </Message>
)

Error.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Error
