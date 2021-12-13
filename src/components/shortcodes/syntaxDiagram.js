import 'styles/components/syntaxDiagram.scss'

import { FormattedMessage } from 'gatsby-plugin-react-intl'
import { Icon } from '@seagreenio/react-bulma'
import PropTypes from 'prop-types'
import React from 'react'

const SyntaxDiagram = ({ children }) => {
  const [value, setValue] = React.useState(0)

  return (
    <div className="PingCAP-Doc-syntax-diagram-root">
      <div className="PingCAP-Doc-syntax-diagram-toolbar buttons are-small are-light has-addons is-right">
        <button className="button is-light" onClick={() => setValue(0)}>
          <span className="icon">
            <Icon name="mdi mdi-file-tree" />
          </span>
          <span>
            <FormattedMessage id="syntaxDiagram.syntaxDiagram" />
          </span>
        </button>
        <button className="button is-light" onClick={() => setValue(1)}>
          <span className="icon">
            <Icon name="mdi mdi-code-tags" />
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
