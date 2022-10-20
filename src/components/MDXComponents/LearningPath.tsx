import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { getBannerByType } from "utils";

export function LearningPathContainer(props: {
  title: string;
  subTitle?: string;
  children?: any;
  platform: "home" | "tidb" | "tidb-cloud";
}) {
  const { children, title, subTitle, platform = "tidb" } = props;

  const BannerComponent = getBannerByType(platform);

  return (
    <>
      <Stack
        id="title-group"
        direction="row"
        sx={{
          background: "#252525",
          justifyContent: "space-between",
          flexDirection: {
            xs: "column-reverse",
            md: "row",
          },
        }}
      >
        <Stack
          id="title-left"
          sx={{
            gap: "2.5rem",
            justifyContent: "center",
            maxWidth: {
              xs: "100%",
              md: "50%",
            },
            width: "auto",
            padding: {
              xs: "0rem 1rem 2rem 1rem",
              md: "2.5rem 0 2.5rem 2.5rem",
            },

            "& h1#banner-title": {
              borderBottom: "0",
              color: "#fff",
              fontSize: "42px",
              fontWeight: "700",
              margin: "0",
              padding: "0",
            },

            "& div#banner-subtitle": {
              color: "#fff",
            },
          }}
        >
          <Typography component="h1" variant="h1" id="banner-title" sx={{}}>
            {title}
          </Typography>
          <Typography component="div" variant="body1" id="banner-subtitle">
            {subTitle}
          </Typography>
        </Stack>
        <Box
          id="title-right"
          sx={{
            padding: "1rem",
            width: "50%",
            margin: {
              xs: "0 auto",
              md: "0",
            },
          }}
        >
          <BannerComponent
            sx={{
              width: "100%",
              height: "100%",
              maxHeight: "200px",
            }}
          />
        </Box>
      </Stack>
      <Stack id="learning-path-container" sx={{ padding: "2rem 0" }}>
        {children}
      </Stack>
    </>
  );
}

export function LearningPath(props: {
  children?: any;
  label: string;
  icon: string;
}) {
  const { children, label, icon } = props;
  return (
    <>
      <Stack
        direction="row"
        sx={{
          alignItems: "center",
          height: "auto",
          padding: "0.5rem 0",
          position: "relative",

          "& div#learning-path-right p": {
            margin: "0",
            "& a": {
              color: "#24292f",
            },
            "& a:hover": {
              color: "#0a85c2",
            },
          },

          "&:not(:first-of-type):before": {
            backgroundColor: "#e9eaee",
            top: 0,
            content: "''",
            height: "calc(50% - 2rem)",
            left: "3.5rem",
            position: "absolute",
            width: "1px",
          },

          "&:not(:last-child):after": {
            backgroundColor: "#e9eaee",
            bottom: 0,
            content: "''",
            height: "calc(50% - 2rem)",
            left: "3.5rem",
            position: "absolute",
            width: "1px",
          },
        }}
      >
        <Stack
          direction="row"
          sx={{
            alignItems: "center",
            gap: {
              xs: 0,
              md: "2rem",
            },
            height: "100%",
            padding: { xs: 0, md: "0 2rem" },

            "& p#learning-path-label": {
              margin: 0,
            },
          }}
        >
          <Typography
            component="img"
            src={require(`../../../images/docHome/${icon}.svg`)?.default}
            sx={{
              width: "3rem",
              height: "3rem",
            }}
          />
          <Typography
            id="learning-path-label"
            sx={{ color: "#000", width: "6rem" }}
          >
            {label}
          </Typography>
        </Stack>
        <Box
          id="learning-path-right"
          sx={{
            backgroundColor: "#f6f6f6",
            boxShadow: "none",
            height: "auto",
            // minHeight: "5rem",
            padding: "2rem",
            transition: ".5s",
            border: "1px solid #e9eaee",
            borderRadius: "0.25rem",
            maxWidth: "100%",

            display: "flex",
            alignItems: "center",
            flex: "1 1",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            rowGap: "1rem",

            "&:hover": {
              boxShadow:
                "0 0.5em 1em -0.125em hsl(0deg 0% 4% / 10%), 0 0 0 1px hsl(0deg 0% 4% / 2%)",
            },

            "& > p": {
              flex: { xs: "50% 1", md: "0 0 33%" },
            },
          }}
        >
          {children}
        </Box>
      </Stack>
    </>
  );
}
