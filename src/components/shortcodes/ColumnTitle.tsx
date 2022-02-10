import { title } from './column-title.module.scss'
import { FC } from 'react'

export const ColumnTitle: FC = ({ children }) => (
  <h5 className={title}>{children}</h5>
)
