import { WrapText } from "@mui/icons-material";
import { Box, IconButton, Tooltip } from "@mui/material";
import CopyBtn from "components/Button/CopyBtn";
import hljs, { HighlightResult } from "highlight.js";
import {
  JSXElementConstructor,
  PropsWithChildren,
  ReactElement,
  useMemo,
  useState,
} from "react";

interface MdxCodeChildrenProps {
  children: string;
  mdxType: string;
  originalType: string;
  parentName: string;
  className?: string;
}

export const Pre: React.FC<PropsWithChildren> = ({ children }) => {
  const childrenProps = (
    children as ReactElement<
      MdxCodeChildrenProps,
      string | JSXElementConstructor<any>
    >
  ).props;
  if (childrenProps?.mdxType !== "code") {
    return <pre>{children}</pre>;
  }

  return (
    <pre>
      <CodeBlock {...childrenProps} />
    </pre>
  );
};

export const CodeBlock: React.FC<MdxCodeChildrenProps> = ({
  children,
  className = "",
}) => {
  const code = children.trim();
  let language = className.replace(/language-/, "");
  if (language === "shell") {
    language = "sh";
  }
  const hlResult = useMemo<HighlightResult>(() => {
    return hljs.highlight(children, {
      language: hljs.getLanguage(language) ? language : "plaintext",
      ignoreIllegals: true,
    });
  }, [children, language]);
  const [isWrapped, setIsWrapped] = useState(false);
  const CodeWrapButton = () => {
    return (
      <Tooltip title="Code Wrap">
        <IconButton
          size="small"
          aria-label="Toggle code wrap"
          onClick={() => setIsWrapped((v) => !v)}
          sx={{
            position: "absolute",
            top: " 0.625rem",
            right: "2.4rem",
            background: "transparent",
            border: "unset",
            color: isWrapped ? "#18816a" : undefined,
          }}
        >
          <WrapText fontSize="inherit" />
        </IconButton>
      </Tooltip>
    );
  };

  return (
    <code className={`hljs language-${hlResult.language}`}>
      <Box
        sx={{
          marginRight: "3rem",
          overflow: "auto",
          whiteSpace: isWrapped ? "pre-wrap" : undefined,
        }}
        dangerouslySetInnerHTML={{ __html: hlResult.value }}
      />
      <CodeWrapButton />
      <CopyBtn content={code} />
    </code>
  );
};
