import * as React from "react";
import { Box, Typography } from "@mui/material";
import { HEADER_HEIGHT } from "shared/headerHeight";

export function Banner({
  url,
  textList,
  logo,
  bgColor,
  textColor,
}: {
  url?: string;
  textList: (string | React.ReactNode)[];
  logo?: React.ReactNode;
  bgColor?: string;
  textColor?: string;
}) {
  return (
    <Box
      sx={{
        flexShrink: 0,
        minHeight: HEADER_HEIGHT.BANNER_MIN,
        backgroundColor: bgColor || "var(--tiui-palette-peacock-100)",
        // backgroundImage: `url(${bgImgSrc})`,
        backgroundPosition: "bottom left",
        backgroundSize: "400px auto",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Box
        component={url ? "a" : "div"}
        href={url}
        target={url ? "_blank" : undefined}
        sx={{
          textDecoration: "none",
          color: textColor || "text.primary",
          display: "block",
          textAlign: "center",
          fontSize: "14px",
          lineHeight: "24px",
          overflowWrap: "anywhere",
          py: 1,
          px: 2,
          ":hover span": {
            textDecoration: url ? "underline" : "none",
          },
        }}
      >
        {logo && (
          <Box
            component="span"
            sx={{
              display: "inline-flex",
              verticalAlign: "middle",
              alignItems: "center",
              pr: "8px",
            }}
          >
            {logo}
          </Box>
        )}
        {textList.map((text, index) =>
          typeof text === "string" ? (
            <Typography
              key={`banner-text-${index}`}
              component="span"
              variant="body2"
              color="inherit"
              sx={{ whiteSpace: "normal" }}
            >
              {text}
            </Typography>
          ) : (
            <React.Fragment key={`banner-node-${index}`}>{text}</React.Fragment>
          )
        )}
      </Box>
    </Box>
  );
}
