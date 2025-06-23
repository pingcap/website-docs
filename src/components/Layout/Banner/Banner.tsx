import { Box, Divider, Stack, Typography } from "@mui/material";
import { Fragment } from "react";

export function Banner({
  url,
  textList,
  logo,
  bgColor,
}: {
  url: string;
  textList: string[];
  logo?: string;
  bgColor?: string;
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
        component="a"
        href={url}
        target="_blank"
        direction="row"
        justifyContent="center"
        alignItems="center"
        flexWrap="nowrap"
        spacing={2}
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
          color: "text.primary",
          height: "100%",
          px: 2,
          [theme.breakpoints.down("md")]: {
            px: 1,
          },
          ":hover span": {
            textDecoration: "underline",
          },
        })}
      >
        {textList.map((text, index) => (
          <Fragment key={index}>
            {!index ? (
              <Stack direction="row" alignItems="center" spacing={1}>
                {logo && <Box>{logo}</Box>}
                <Typography component="span" variant="body2" color="inherit">
                  {text}
                </Typography>
              </Stack>
            ) : (
              <Typography
                component="span"
                variant="body2"
                color="inherit"
                sx={(theme) => ({
                  display: "initial",
                  [theme.breakpoints.down("md")]: {
                    display: "none",
                  },
                })}
              >
                {text}
              </Typography>
            )}
          </Fragment>
        ))}
      </Stack>
    </Box>
  );
}
