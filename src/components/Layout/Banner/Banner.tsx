import { Box, Divider, Stack, Typography } from "@mui/material";
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
        height: HEADER_HEIGHT.BANNER,
        backgroundColor: bgColor || "var(--tiui-palette-peacock-100)",
        // backgroundImage: `url(${bgImgSrc})`,
        backgroundPosition: "bottom left",
        backgroundSize: "400px auto",
        backgroundRepeat: "no-repeat",
      }}
    >
      <Stack
        component={url ? "a" : "div"}
        href={url}
        target={url ? "_blank" : undefined}
        direction="row"
        justifyContent="center"
        alignItems="center"
        flexWrap="wrap"
        sx={(theme) => ({
          textDecoration: "none",
          color: textColor || "text.primary",
          height: "100%",
          px: 2,
          [theme.breakpoints.down("md")]: {
            px: 1,
          },
          ":hover span": {
            textDecoration: url ? "underline" : "none",
          },
        })}
      >
        {logo && (
          <Box sx={{ display: "flex", alignItems: "center", pr: "8px" }}>
            {logo}
          </Box>
        )}
        {textList.map((text, index) =>
          typeof text === "string" ? (
            <Typography
              key={index}
              component="span"
              variant="body2"
              color="inherit"
              sx={{ whiteSpace: "pre" }}
            >
              {text}
            </Typography>
          ) : (
            text
          )
        )}
      </Stack>
    </Box>
  );
}
