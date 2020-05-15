import '../../styles/components/message.scss'

import PropTypes from 'prop-types'
import React from 'react'

const Message = ({ type, icon, title, children }) => (
  <div className={`PingCAP-Message ${type}`}>
    <div className="top">
      <div className="message-icon">{icon}</div>
      <div className="message-title">{title}</div>
    </div>
    <div className="message-text">{children}</div>
  </div>
)

Message.propTypes = {
  type: PropTypes.string.isRequired,
  icon: PropTypes.element.isRequired,
  title: PropTypes.element.isRequired,
  children: PropTypes.node.isRequired,
}

export default Message
