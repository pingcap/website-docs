import PropTypes from 'prop-types'
import { FormattedMessage } from 'react-intl'
import React from 'react'
import AccountTreeRoundedIcon from '@material-ui/icons/AccountTreeRounded'
import CodeIcon from '@material-ui/icons/Code'
import '../../styles/components/syntaxDiagram.scss'

const SyntaxDiagram = ({ children }) => {
  const [value, setValue] = React.useState(0)

  return (
    <div className="PingCAP-Doc-syntax-diagram-root">
      <div className="PingCAP-Doc-syntax-diagram-toolbar buttons are-small are-light has-addons is-right">
        <button className="button is-light" onClick={() => setValue(0)}>
          <span className="icon">
            <AccountTreeRoundedIcon fontSize="small" />
          </span>
          <span>
            <FormattedMessage id="syntaxDiagram.syntaxDiagram" />
          </span>
        </button>
        <button className="button is-light" onClick={() => setValue(1)}>
          <span className="icon">
            <CodeIcon fontSize="small" />
          </span>
          <span>
            <FormattedMessage id="syntaxDiagram.ebnf" />
          </span>
        </button>
      </div>
      <div
        hidden={value !== 0}
        className="PingCAP-Doc-syntax-diagram-container"
      >
        {children[0]}
      </div>
      <div hidden={value !== 1}>{children[1]}</div>
    </div>
  )
}

SyntaxDiagram.propTypes = {
  children: PropTypes.node.isRequired,
}

export default SyntaxDiagram
