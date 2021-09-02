import { FormattedMessage } from 'gatsby-plugin-react-intl'
import { Icon } from '@seagreenio/react-bulma'
import Message from './message'
import PropTypes from 'prop-types'
import React from 'react'

const Warning = ({ children }) => (
  <Message
    type="warning"
    icon={<Icon name="mdi mdi-alert" />}
    title={<FormattedMessage id="shortcodes.warning" />}
  >
    {children}
  </Message>
)

Warning.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Warning
