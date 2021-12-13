import { FormattedMessage } from 'gatsby-plugin-react-intl'
import { Icon } from '@seagreenio/react-bulma'
import Message from './message'
import PropTypes from 'prop-types'
import React from 'react'

const Tip = ({ children }) => (
  <Message
    type="tip"
    icon={<Icon name="mdi mdi-paperclip" />}
    title={<FormattedMessage id="shortcodes.tip" />}
  >
    {children}
  </Message>
)

Tip.propTypes = {
  children: PropTypes.node.isRequired,
}

export default Tip
