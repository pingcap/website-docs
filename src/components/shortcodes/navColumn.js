import * as styles from './navColumn.module.scss'

import { Column } from '@seagreenio/react-bulma'
import React from 'react'

const NavColumn = ({ children }) => (
  <Column size={4} className={styles.column}>
    {children}
  </Column>
)

export default NavColumn
