import * as React from "react";
import copy from "copy-to-clipboard";

import IconButton from "@mui/material/IconButton";
import ContentCopyIcon from "@mui/icons-material/ContentCopy";
import CheckIcon from "@mui/icons-material/Check";
import Tooltip from "@mui/material/Tooltip";

export default function CopyBtn(props: {
  content: string;
  className?: string;
}) {
  const [isCopied, setIscopied] = React.useState(false);

  const handleButtonsContent = (event: React.MouseEvent<HTMLButtonElement>) => {
    if (isCopied) {
      return false;
    }
    setIscopied(true);
    setTimeout(() => {
      setIscopied(false);
    }, 2000);
    return true;
  };

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    const shouldCopy = handleButtonsContent(event);
    shouldCopy && copy(props.content);
  };

  return (
    <>
      <Tooltip title={isCopied ? "Copied!" : "Copy"}>
        <IconButton
          size="small"
          aria-label="copy"
          onClick={handleClick}
          sx={{
            position: "absolute",
            top: " 0.625rem",
            right: "0.625rem",
            background: "transparent",
            border: "unset",
          }}
          className={props.className}
        >
          {isCopied ? (
            <CheckIcon fontSize="inherit" />
          ) : (
            <ContentCopyIcon fontSize="inherit" />
          )}
        </IconButton>
      </Tooltip>
    </>
  );
}
