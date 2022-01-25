import { FormattedMessage } from 'gatsby-plugin-react-intl'
import { ReactNode, useState } from 'react'
import { MdOutlineAccountTree, MdCode } from 'react-icons/md'

import { root, toolbar, container } from './syntax-diagram.module.scss'

export const SyntaxDiagram = ({
  children,
}: {
  children: [ReactNode, ReactNode]
}) => {
  const [value, setValue] = useState(0)

  return (
    <div className={root}>
      <div
        className={`${toolbar} buttons are-small are-light has-addons is-right`}>
        <button className="button is-light" onClick={() => setValue(0)}>
          <span className="icon">
            <MdOutlineAccountTree />
          </span>
          <span>
            <FormattedMessage id="syntaxDiagram.syntaxDiagram" />
          </span>
        </button>
        <button className="button is-light" onClick={() => setValue(1)}>
          <span className="icon">
            <MdCode />
          </span>
          <span>
            <FormattedMessage id="syntaxDiagram.ebnf" />
          </span>
        </button>
      </div>
      <div hidden={value !== 0} className={container}>
        {children[0]}
      </div>
      <div hidden={value !== 1}>{children[1]}</div>
    </div>
  )
}
