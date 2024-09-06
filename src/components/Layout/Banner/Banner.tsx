import { Box, Divider, Stack, Typography } from "@mui/material";
import { useI18next } from "gatsby-plugin-react-i18next";
import { Fragment } from "react";

const useBannerEvents = (
  textKeys: string[],
  linkKey: string,
  prefix: string = ""
) => {
  const { t } = useI18next();
  const validTextKeys = prefix
    ? textKeys.map((k) => `${prefix}.${k}`)
    : textKeys;

  const urlKey = prefix ? `${prefix}.${linkKey}` : linkKey;
  const url = t(urlKey);
  const textList = validTextKeys.map((k) => t(k));
  const logo = (
    <Box
      component="img"
      alt="TiDB"
      src={require("media/logo/tidb-logo.svg")?.default}
      sx={{
        width: "1.25rem",
        height: "1.25rem",
      }}
    />
  );
  const bgImgSrc =
    "https://static.pingcap.com/files/2023/11/15190759/20231116-105219.png";

  return {
    bgImgSrc,
    url,
    logo,
    textList,
  };
};

export function Banner() {
  const { bgImgSrc, url, logo, textList } = useBannerEvents(
    ["title", "date", "intro"],
    "link",
    "banner.docDash2024"
  );

  return (
    <Box
      sx={{
        flexShrink: 0,
        height: "2rem",
        backgroundColor: "#15005B",
        backgroundImage: `url(${bgImgSrc})`,
        backgroundPosition: "bottom left",
        backgroundSize: "400px auto",
        backgroundRepeat: "no-repeat",
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
          color: "website.m1",
          height: "100%",
          px: 2,
          [theme.breakpoints.down("md")]: {
            px: 1,
          },
        })}
      >
        {textList.map((text, index) => (
          <Fragment key={index}>
            {!index ? (
              <Stack direction="row" alignItems="center" spacing={2}>
                {logo}
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
