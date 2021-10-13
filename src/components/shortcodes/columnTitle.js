import React from 'react'
import { Title } from '@seagreenio/react-bulma'

const ColumnTitle = ({ children }) => (
  <Title className="has-text-primary mb-3" size={5}>
    {children}
  </Title>
)

export default ColumnTitle
