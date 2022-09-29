import * as React from "react";
import hljs from "highlight.js";
import ReactDOM from "react-dom";
import Box from "@mui/material/Box";

import CopyBtn from "components/Button/CopyBtn";

export function useHighlightCode() {
  const CodeBlock = (props: { html: string; content: string }) => {
    const { html, content } = props;
    return (
      <Box
        sx={{
          "& .code-content": {
            marginRight: "3rem",
            overflow: "auto",
          },
        }}
      >
        <div
          className="code-content"
          dangerouslySetInnerHTML={{ __html: html }}
        />
        <CopyBtn content={content} />
      </Box>
    );
  };

  React.useEffect(() => {
    const codeBlocks = document.querySelectorAll("pre > code");
    codeBlocks.forEach((codeBlock: any) => {
      if (codeBlock) {
        const eleClassName: string = codeBlock.className;
        if (eleClassName.includes("language-shell")) {
          codeBlock.className = `language-sh`;
        }
        hljs.highlightElement(codeBlock);
        const html = codeBlock.innerHTML;
        const content = codeBlock.textContent || "";
        const CodeBlockEle = <CodeBlock html={html} content={content} />;
        ReactDOM.render(CodeBlockEle, codeBlock);
      }
    });
  }, []);
}
