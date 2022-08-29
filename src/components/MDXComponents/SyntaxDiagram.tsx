import { Trans } from "gatsby-plugin-react-i18next";
import { ReactNode, useState } from "react";
import { MdOutlineAccountTree, MdCode } from "react-icons/md";

import { root, toolbar, container } from "./syntax-diagram.module.css";

export function SyntaxDiagram({
  children,
}: {
  children: [ReactNode, ReactNode];
}) {
  const [value, setValue] = useState(0);

  return (
    <div className={root}>
      <div
        className={`${toolbar} buttons are-small are-light has-addons is-right`}
      >
        <button className="button is-light" onClick={() => setValue(0)}>
          <span className="icon">
            <MdOutlineAccountTree />
          </span>
          <span>
            <Trans i18nKey="syntaxDiagram.syntaxDiagram" />
          </span>
        </button>
        <button className="button is-light" onClick={() => setValue(1)}>
          <span className="icon">
            <MdCode />
          </span>
          <span>
            <Trans i18nKey="syntaxDiagram.ebnf" />
          </span>
        </button>
      </div>
      <div hidden={value !== 0} className={container}>
        {children[0]}
      </div>
      <div hidden={value !== 1}>{children[1]}</div>
    </div>
  );
}
