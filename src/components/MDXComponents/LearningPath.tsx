import { createContext, useContext } from "react";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";

import { useTheme } from "@mui/material";

import TiDBSelfManagedHeroGraphic from "media/imgs/tidb-self-managed-hero-graphic.svg";
import TiDBSelfManagedHeroGraphicBg from "media/imgs/tidb-self-managed-hero-graphic-bg.svg";
import TiDBCloudHeroGraphic from "media/imgs/tidb-cloud-hero-graphic.svg";
import TiDBCloudHeroGraphicBg from "media/imgs/tidb-cloud-hero-graphic-bg.svg";

const TiDBSelfManagementImg = () => {
  return (
    <Box sx={{ position: "relative", height: "100%" }}>
      <Box sx={{ position: "absolute", bottom: -10, right: 0 }}>
        <TiDBSelfManagedHeroGraphicBg />
      </Box>
      <Box sx={{ position: "absolute", bottom: -36, right: 110 }}>
        <TiDBSelfManagedHeroGraphic />
      </Box>
    </Box>
  );
};

const TiDBCloudImg = () => {
  return (
    <Box sx={{ position: "relative", height: "100%" }}>
      <Box sx={{ position: "absolute", bottom: -10, right: 0 }}>
        <TiDBCloudHeroGraphicBg />
      </Box>
      <Box sx={{ position: "absolute", bottom: -34, right: 156 }}>
        <TiDBCloudHeroGraphic />
      </Box>
    </Box>
  );
};

const LearningPathContext = createContext<"tidb-cloud" | "tidb" | "home">(
  "tidb-cloud"
);

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
        <LearningPathContext.Provider value={platform}>
          {children}
        </LearningPathContext.Provider>
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
  const platform = useContext(LearningPathContext);
  const theme = useTheme();
  const iconHashmap = {
    "tidb-cloud": {
      cloud1: "cloud-learning-mauve",
      cloud2: "cloud-billing-mauve",
      cloud3: "cloud-migrate-mauve",
      cloud4: "cloud-integrations-mauve",
      cloud5: "cloud-getstarted-mauve",
      cloud6: "cloud-monitor-mauve",
      cloud7: "cloud-manage-mauve",
      "cloud-dev": "cloud-reference-mauve",
      "tidb-cloud-tune": "cloud-tune-mauve",
      doc8: "cloud-developer-mauve",
      users: "cloud-security-mauve",
    },
    tidb: {
      cloud1: "oss-learning-blue",
      cloud3: "oss-migrate-blue",
      cloud5: "oss-getstarted-blue",
      cloud6: "oss-monitor-blue",
      "cloud-dev": "oss-reference-blue",
      "tidb-cloud-tune": "oss-tune-blue",
      doc7: "oss-tools-blue",
      doc8: "oss-developer-blue",
      deploy: "oss-deploy-blue",
      maintain: "oss-manage-blue",
    },
    "tidb-operator": {
      cloud1: "oss-learning-blue",
      cloud3: "oss-migrate-blue",
      cloud5: "oss-getstarted-blue",
      cloud6: "oss-monitor-blue",
      "cloud-dev": "oss-reference-blue",
      "tidb-cloud-tune": "oss-tune-blue",
      doc7: "oss-tools-blue",
      doc8: "oss-developer-blue",
      deploy: "oss-deploy-blue",
      maintain: "oss-manage-blue",
    },
    home: {
      cloud1: "cloud-learning-mauve",
      cloud2: "cloud-billing-mauve",
      cloud3: "cloud-migrate-mauve",
      cloud4: "cloud-integrations-mauve",
      cloud5: "cloud-getstarted-mauve",
      cloud6: "cloud-monitor-mauve",
      cloud7: "cloud-manage-mauve",
      "cloud-dev": "cloud-reference-mauve",
      "tidb-cloud-tune": "cloud-tune-mauve",
      doc8: "cloud-developer-mauve",
      users: "cloud-security-mauve",
    },
  };
  const iconName =
    iconHashmap?.[platform]?.[
      icon as keyof typeof iconHashmap[typeof platform]
    ] || (platform === "tidb" ? "oss-product-blue" : "cloud-product-mauve");

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
            display: {
              xs: "none",
              md: "block",
            },
            backgroundColor: "#e9eaee",
            top: 0,
            content: "''",
            height: "calc(50% - 2rem)",
            left: "3.5rem",
            position: "absolute",
            width: "1px",
          },

          "&:not(:last-child):after": {
            display: {
              xs: "none",
              md: "block",
            },
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
            gap: "2rem",
            height: "100%",
            padding: "0 2rem",
            display: {
              xs: "none",
              md: "flex",
            },

            "& p#learning-path-label": {
              margin: 0,
            },
          }}
        >
          <Typography
            component="img"
            src={require(`../../../images/docHome/${iconName}.svg`)?.default}
            sx={{
              width: "3rem",
              height: "3rem",
            }}
          />
          <Typography
            id="learning-path-label"
            sx={{ color: "carbon.900", width: "6rem", fontWeight: 700 }}
            fontSize="16px"
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
