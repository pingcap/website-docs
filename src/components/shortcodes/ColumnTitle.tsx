import { Title } from '@seagreenio/react-bulma'
import { FC } from 'react'

export const ColumnTitle: FC = ({ children }) => (
  <Title className="has-text-primary mb-3" size={5}>
    {children}
  </Title>
)
