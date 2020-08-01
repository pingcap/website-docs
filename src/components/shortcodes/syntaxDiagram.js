import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import { Button, ButtonGroup, Grid } from '@material-ui/core'
import AccountTreeRoundedIcon from '@material-ui/icons/AccountTreeRounded'
import CodeIcon from '@material-ui/icons/Code'
import '../../styles/components/syntaxDiagram.scss'

const SyntaxDiagram = ({ children }) => {
  const [value, setValue] = React.useState(0)

  return (
    <Grid
      container
      spacing={0}
      direction="column"
      wrap="nowrap"
      className="PingCAP-Doc-syntax-diagram-root"
    >
      <Grid item className="PingCAP-Doc-syntax-diagram-toolbar">
        <ButtonGroup size="small" variant="text">
          <Button
            startIcon={<AccountTreeRoundedIcon />}
            onClick={() => setValue(0)}
          >
            <FormattedMessage id="syntaxDiagram.syntaxDiagram" />
          </Button>
          <Button startIcon={<CodeIcon />} onClick={() => setValue(1)}>
            <FormattedMessage id="syntaxDiagram.ebnf" />
          </Button>
        </ButtonGroup>
      </Grid>
      <Grid
        item
        hidden={value !== 0}
        className="PingCAP-Doc-syntax-diagram-container"
      >
        {children[0]}
      </Grid>
      <Grid item hidden={value !== 1}>
        {children[1]}
      </Grid>
    </Grid>
  )
}

SyntaxDiagram.propTypes = {
  children: PropTypes.node.isRequired,
}

export default SyntaxDiagram
