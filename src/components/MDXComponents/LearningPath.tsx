import * as React from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useTheme } from "@mui/material";

import TiDBSelfManagementLogo from "media/imgs/tidb-self-management-logo.svg";
import TiDBSelfManagementBg from "media/imgs/tidb-self-management-bg.svg";
import TiDBCloudLogo from "media/imgs/tidb-cloud-logo.svg";
import TiDBCloudBg from "media/imgs/tidb-cloud-bg.svg";

const TiDBSelfManagementImg = () => {
  return (
    <Box sx={{ position: "relative", height: "100%" }}>
      <Box sx={{ position: "absolute", bottom: -10, right: 0 }}>
        <TiDBSelfManagementBg />
      </Box>
      <Box sx={{ position: "absolute", bottom: -36, right: 110 }}>
        <TiDBSelfManagementLogo />
      </Box>
    </Box>
  );
};

const TiDBCloudImg = () => {
  return (
    <Box sx={{ position: "relative", height: "100%" }}>
      <Box sx={{ position: "absolute", bottom: -10, right: 0 }}>
        <TiDBCloudBg />
      </Box>
      <Box sx={{ position: "absolute", bottom: -34, right: 156 }}>
        <TiDBCloudLogo />
      </Box>
    </Box>
  );
};

export function LearningPathContainer(props: {
  title: string;
  subTitle?: string;
  children?: any;
  platform: "home" | "tidb" | "tidb-cloud";
}) {
  const { children, title, subTitle, platform = "tidb" } = props;

  const bannerImg =
    platform === "tidb" ? <TiDBSelfManagementImg /> : <TiDBCloudImg />;

  return (
    <>
      <Stack
        id="title-group"
        direction="row"
        bgcolor="carbon.900"
        sx={{
          justifyContent: "space-between",
          flexDirection: {
            xs: "column",
            md: "row",
          },
        }}
      >
        <Stack
          id="title-left"
          sx={{
            gap: "32px",
            justifyContent: "center",
            height: "230px",
            boxSizing: "border-box",
            maxWidth: {
              xs: "100%",
              md: "60%",
            },
            width: "auto",
            padding: "36px",

            "& h1#banner-title": {
              borderBottom: "0",
              color: "carbon.50",
              fontSize: "42px",
              fontWeight: "700",
              margin: "0",
              padding: "0",
            },

            "& div#banner-subtitle": {
              color: "carbon.50",
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
            height: "230px",
            width: "100%",
            boxSizing: "border-box",
            margin: {
              xs: "0 auto",
              md: "0",
            },
          }}
        >
          {bannerImg}
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
  const theme = useTheme();
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
              color: theme.palette.secondary.main,
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
            sx={{ color: "carbon.900", width: "6rem", fontWeight: 700 }}
          >
            {label}
          </Typography>
        </Stack>
        <Box
          id="learning-path-right"
          sx={{
            backgroundColor: theme.palette.carbon[200],
            height: "auto",
            // minHeight: "5rem",
            padding: "2rem",
            transition: ".5s",
            border: `1px solid ${theme.palette.carbon[400]}`,
            maxWidth: "100%",

            display: "flex",
            alignItems: "center",
            flex: "1 1",
            flexWrap: "wrap",
            justifyContent: "flex-start",
            rowGap: "1rem",

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
