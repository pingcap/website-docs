import * as React from "react";
import { Link, Trans } from "gatsby-plugin-react-i18next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2
import { useTheme } from "@mui/material/styles";

import { getBannerByType } from "utils";
import LinkComponent from "components/Link";
import SearchInput from "components/Search";

export function DocHomeContainer(props: {
  title: string;
  subTitle?: string;
  children?: any;
  platform: "home" | "tidb" | "tidb-cloud";
}) {
  const { title, subTitle = "", children = [], platform = "home" } = props;

  const [searchValue, setSearchValue] = React.useState("");

  const theme = useTheme();

  const BannerComponent = getBannerByType(platform);

  const getHeadings = (
    items: any
  ): { label: string; anchor: string; id: string }[] => {
    if (items?.length) {
      return items.map((item: any) => ({
        label: item?.props?.label || "",
        anchor: item?.props?.anchor || "",
        id: item?.props?.id || "",
      }));
    }
    return [
      {
        label: items?.props?.label || "",
        anchor: items?.props?.anchor || "",
        id: items?.props?.id || "",
      },
    ];
  };

  const headingsMemo = React.useMemo(() => {
    return getHeadings(children);
  }, [children]);

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
          <SearchInput
            disableResponsive
            docInfo={{ type: "tidb", version: "stable" }}
          />
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
            }}
          />
        </Box>
      </Stack>
      {/* <Stack id="doc-home-container" sx={{ padding: "2rem 0" }}>
        {children}
      </Stack> */}
      <Grid2 container>
        <Grid2 xs={12} md={10}>
          <Box>{children}</Box>
        </Grid2>
        <Grid2
          xs={0}
          md={2}
          sx={{
            display: { xs: "none", md: "block" },

            scrollbarGutter: "stable",
            height: "100%",
            maxHeight: "calc(100vh - 6.25rem)",
            overflowY: "auto",
            padding: "1rem",
            position: "sticky",
            top: "6.25rem",

            "& ul#toc-ul": {
              padding: 0,
              margin: 0,
            },
          }}
        >
          <Typography
            component="div"
            sx={{
              paddingLeft: "0.5rem",
              color: theme.palette.website.m5,
              fontSize: "13px",
              lineHeight: "1.25rem",
              paddingBottom: "1rem",
            }}
          >
            <Trans i18nKey="doc.toc" />
          </Typography>
          <Box
            component="ul"
            id="toc-ul"
            sx={{
              listStyle: "none",
            }}
          >
            {headingsMemo.map((i) => (
              <Box
                key={i.id}
                component="li"
                sx={{
                  "& a#toc-link": {
                    color: theme.palette.website.m5,
                    "&:hover": {
                      textDecoration: "none",
                    },
                  },
                }}
              >
                <Typography
                  component="a"
                  id="toc-link"
                  href={`#${i.anchor}`}
                  sx={{
                    display: "flex",
                    textDecoration: "none",
                    fontSize: "13px",
                    lineHeight: "1.25rem",
                    borderLeft: `1px solid transparent`,
                    paddingLeft: `0.5rem`,
                    paddingTop: "0.25rem",
                    paddingBottom: "0.25rem",
                    "&:hover": {
                      color: theme.palette.website.f3,
                      borderLeft: `1px solid ${theme.palette.website.f3}`,
                    },
                  }}
                >
                  {i.label}
                </Typography>
              </Box>
            ))}
          </Box>
          {/* <ul>
            {headingsMemo.map((i) => (
              <li key={i.id}>
                <a href={`#${i.anchor}`}>{i.label}</a>
              </li>
            ))}
          </ul> */}
        </Grid2>
      </Grid2>
    </>
  );
}

export function DocHomeSection(props: {
  children?: any;
  label: string;
  anchor: string;
  id: string;
}) {
  const { children, label, id } = props;
  return (
    <Box
      sx={{
        borderBottom: "1px solid #f4f4f4",
        display: "flex",
        flexDirection: "column",
        gap: "2.5rem",
        paddingBottom: "2.5rem",
        paddingTop: "2.5rem",

        "& h2": {
          borderBottom: "unset",
          fontSize: "2rem",
          margin: 0,
          padding: 0,
        },

        "> a": {
          backgroundColor: "#3d3fea",
          borderColor: "transparent",
          color: "#fff",
          textDecoration: "none",
          width: "fit-content",
          cursor: "pointer",
          justifyContent: "center",
          padding: "calc(0.5em - 1px) 1em",
          textAlign: "center",
          whiteSpace: "nowrap",
          alignItems: "center",
          border: "1px solid transparent",
          borderRadius: "4px",
          boxShadow: "none",
          display: "inline-flex",
          fontSize: "1rem",
          lineHeight: "1.5",
          position: "relative",
          verticalAlign: "top",
          "&:hover": {
            textDecoration: "none",
          },
        },
      }}
    >
      <Typography
        component="h2"
        variant="h2"
        id={id}
        sx={{
          color: "#24292f",
        }}
      >
        {label}
      </Typography>
      {children}
    </Box>
  );
}

export function DocHomeCardContainer(props: any) {
  const { children } = props;
  return (
    <Box
      sx={{
        width: "100%",
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(224px, 30%))",
        gap: "1.5rem",
        justifyContent: "start",

        "& a#card": {
          backgroundColor: "#f6f6f6",
          "&:hover": {
            textDecoration: "none",
          },
        },
      }}
    >
      {children}
    </Box>
  );
}

export function DocHomeCard(props: any) {
  const { children, href = "", icon = "cloud1", label } = props;

  return (
    <>
      <Box
        id="card"
        component="a"
        href={href}
        sx={{
          backgroundColor: "#f6f6f6",
          boxShadow: "none",
          padding: "2rem",
          transition: ".5s",
          border: "1px solid #e9eaee",
          borderRadius: "0.25rem",

          "&:hover": {
            boxShadow:
              "0 0.5em 1em -0.125em hsl(0deg 0% 4% / 10%), 0 0 0 1px hsl(0deg 0% 4% / 2%)",
          },
        }}
      >
        <Box
          id="card-content"
          sx={{
            color: "#4a4a4a",

            "& img#card-content-img": {
              backgroundColor: "transparent",
            },
          }}
        >
          <Typography
            component="img"
            id="card-content-img"
            src={require(`../../../images/docHome/${icon}.svg`)?.default}
            sx={{
              height: "3rem",
              width: "fit-content",
              margin: 0,
              backgroundColor: "transparent",
            }}
          />
          <Typography component="h3" variant="h3" sx={{ color: "#4a4a4a" }}>
            {label}
          </Typography>
          {children}
        </Box>
      </Box>
    </>
  );
}
