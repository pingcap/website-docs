import { Box, Divider, Stack, Typography } from "@mui/material";

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
        minHeight: "1.5rem",
        backgroundColor: bgColor || "var(--tiui-palette-peacock-100)",
        // backgroundImage: `url(${bgImgSrc})`,
        backgroundPosition: "bottom left",
        backgroundSize: "400px auto",
        backgroundRepeat: "no-repeat",
        paddingTop: "0.5rem",
        paddingBottom: "0.5rem",
      }}
    >
      <Stack
        component={url ? "a" : "div"}
        href={url}
        target={url ? "_blank" : undefined}
        direction="row"
        justifyContent="center"
        alignItems="center"
        flexWrap="nowrap"
        spacing={0.5}
        divider={
          <Divider
            orientation="vertical"
            variant="middle"
            flexItem
            sx={(theme) => ({
              display: "initial",
              [theme.breakpoints.down("md")]: {
                display: "none",
              },
              borderColor: "website.m1",
              borderRightWidth: 1.5,
              height: "0.875rem",
              alignSelf: "auto",
            })}
          />
        }
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
          <Box sx={{ display: "flex", alignItems: "center" }}>{logo}</Box>
        )}
        {textList.map((text, index) =>
          typeof text === "string" ? (
            <Typography
              key={index}
              component="span"
              variant="body2"
              color="inherit"
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
