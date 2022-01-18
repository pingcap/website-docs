import { column } from './nav-column.module.scss'

import { Column } from '@seagreenio/react-bulma'
import { FC } from 'react'

export const NavColumn: FC = ({ children }) => (
  <Column size={4} className={column}>
    {children}
  </Column>
)
