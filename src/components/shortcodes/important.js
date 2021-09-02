import { FormattedMessage } from 'gatsby-plugin-react-intl'
import { Icon } from '@seagreenio/react-bulma'
import Message from './message'
import PropTypes from 'prop-types'
import React from 'react'

const Important = ({ children }) => (
  <Message
    type="important"
    icon={<Icon name="mdi mdi-bell" />}
    title={<FormattedMessage id="shortcodes.important" />}
  >
    {children}
  </Message>
)

Important.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Important
