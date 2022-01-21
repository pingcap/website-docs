import {
  message,
  warning,
  error,
  important,
  note,
  tip,
  messageTitle,
  messageIcon,
} from './message.module.scss'

import { FC, ReactNode } from 'react'
import {
  MdAttachment,
  MdFlag,
  MdNotifications,
  MdOutlineWarning,
} from 'react-icons/md'
import { FormattedMessage } from 'gatsby-plugin-react-intl'

type MessageType = 'warning' | 'error' | 'important' | 'note' | 'tip'

interface Props {
  type: MessageType
  icon: ReactNode
  title: ReactNode
}

const MessageClass: Record<MessageType, string> = {
  warning,
  error,
  important,
  note,
  tip,
}

const Message: FC<Props> = ({ type, icon, title, children }) => (
  <div className={`${message} ${MessageClass[type]}`}>
    <div className={messageTitle}>
      <span className={messageIcon}>{icon}</span>
      <span>{title}</span>
    </div>
    <div>{children}</div>
  </div>
)

export const Important: FC = ({ children }) => (
  <Message
    type="important"
    icon={<MdNotifications />}
    title={<FormattedMessage id="shortcodes.important" />}>
    {children}
  </Message>
)

export const Warning: FC = ({ children }) => (
  <Message
    type="warning"
    icon={<MdOutlineWarning />}
    title={<FormattedMessage id="shortcodes.warning" />}>
    {children}
  </Message>
)

export const Note: FC = ({ children }) => (
  <Message
    type="note"
    icon={<MdFlag />}
    title={<FormattedMessage id="shortcodes.note" />}>
    {children}
  </Message>
)

export const Tip: FC = ({ children }) => (
  <Message
    type="tip"
    icon={<MdAttachment />}
    title={<FormattedMessage id="shortcodes.tip" />}>
    {children}
  </Message>
)
