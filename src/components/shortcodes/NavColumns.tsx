import { Columns, withSpacing } from '@seagreenio/react-bulma'
import { FC } from 'react'

const SpacingColumns = withSpacing(Columns)

export const NavColumns: FC = ({ children }) => (
  <SpacingColumns
    // @ts-ignore
    multiline
    mt={3}>
    {children}
  </SpacingColumns>
)
