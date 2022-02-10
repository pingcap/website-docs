import { column, columns } from './nav-column.module.scss'

import { FC } from 'react'

export const NavColumn: FC = ({ children }) => (
  <div className={column}>{children}</div>
)

export const NavColumns: FC = ({ children }) => (
  <div className={columns}>{children}</div>
)
