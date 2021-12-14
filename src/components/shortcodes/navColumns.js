import { Columns, withSpacing } from '@seagreenio/react-bulma'

import React from 'react'

const SpacingColumns = withSpacing(Columns)

const NavColumns = ({ children }) => (
  <SpacingColumns multiline mt={3}>
    {children}
  </SpacingColumns>
)

export default NavColumns
