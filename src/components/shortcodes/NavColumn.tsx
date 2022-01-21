import { column } from './nav-column.module.scss'

import { Column, Columns, withSpacing } from '@seagreenio/react-bulma'
import { FC } from 'react'

export const NavColumn: FC = ({ children }) => (
  <Column size={4} className={column}>
    {children}
  </Column>
)

const SpacingColumns = withSpacing(Columns)

export const NavColumns: FC = ({ children }) => (
  <SpacingColumns
    // @ts-ignore
    multiline
    mt={3}>
    {children}
  </SpacingColumns>
)
