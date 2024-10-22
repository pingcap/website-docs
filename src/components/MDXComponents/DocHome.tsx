import * as React from "react";
import { Trans } from "gatsby-plugin-react-i18next";
import { Button } from "@mui/material";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2
import { useTheme } from "@mui/material/styles";

import HomeHeroGraphic from "media/imgs/home-hero-graphic.svg";
import { Link } from "gatsby";

interface DocHomeContainerProps {
  title: string;
  subTitle?: string;
  platform: "home" | "tidb" | "tidb-cloud";
  archive?: boolean;
  ctaLabel?: string;
  ctaLink?: string;
}

export function DocHomeContainer(
  props: React.PropsWithChildren<DocHomeContainerProps>
) {
  const {
    title,
    subTitle = "",
    platform = "home",
    archive = false,
    ctaLabel = "Get Started",
    ctaLink = "",
    children = [],
  } = props;

  const theme = useTheme();

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
          padding: "1.5rem 0 4rem",
          justifyContent: "space-between",
          flexDirection: {
            xs: "column-reverse",
            md: "row",
          },
        }}
      >
        <Stack
          id="title-left"
          alignItems="flex-start"
          sx={{
            gap: "2rem",
            maxWidth: {
              xs: "100%",
              md: "50%",
            },
            width: "auto",
            padding: {
              xs: "0rem 1rem 2rem 1rem",
              md: "0",
            },

            "& h1#banner-title": {
              borderBottom: "0",
              color: theme.palette.website.f1,
              fontSize: "36px",
              fontWeight: "700",
              margin: "0",
              padding: "0",
            },

            "& div#banner-subtitle": {
              fontSize: "20px",
              color: theme.palette.text.primary,
              lineHeight: "1.5",
            },
          }}
        >
          <Typography component="h1" variant="h1" id="banner-title">
            {title}
          </Typography>
          <Typography component="div" variant="body1" id="banner-subtitle">
            {subTitle}
          </Typography>
          {!archive && ctaLink && (
            <Box
              sx={{
                "& > a.button": {
                  background: "var(--tiui-palette-primary)",
                  textDecoration: "none",
                  color: "white",
                  "&:hover": {
                    backgroundColor: "var(--tiui-palette-primary-dark)",
                  },
                },
              }}
            >
              <Button
                variant="contained"
                href={ctaLink}
                target={ctaLink.startsWith("http") ? "_blank" : undefined}
                size="large"
                color="primary"
                className="button"
              >
                {ctaLabel}
              </Button>
            </Box>
          )}
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
            position: "relative",
            display: {
              xs: "none",
              md: "block",
            },
          }}
        >
          {/* <BannerComponent
            sx={{
              width: "100%",
              height: "100%",
              maxHeight: "276px",
            }}
          /> */}
          <Box
            sx={{
              position: "absolute",
              top: "36px",
              right: "-4px",
            }}
          >
            <HomeHeroGraphic />
          </Box>
        </Box>
      </Stack>
      {/* <Stack id="doc-home-container" sx={{ padding: "2rem 0" }}>
        {children}
      </Stack> */}
      <Grid2 container>
        <Grid2 xs={12} md={10}>
          <Box>{children}</Box>
        </Grid2>
        {!archive && (
          <Grid2
            xs={0}
            md={2}
            sx={{
              display: { xs: "none", md: "block" },

              scrollbarGutter: "stable",
              height: "100%",
              maxHeight: "calc(100vh - 6.25rem)",
              overflowY: "auto",
              padding: "4rem 1rem 1rem 1rem",
              position: "sticky",
              top: "6.25rem",

              "& ul#toc-ul": {
                padding: 0,
                margin: 0,
                listStyle: "none",
              },
            }}
          >
            {!archive && (
              <>
                <Typography
                  component="div"
                  sx={{
                    paddingLeft: "0.5rem",
                    paddingBottom: "1rem",
                    color: theme.palette.website.f1,
                    fontSize: "0.875rem",
                    fontWeight: "700",
                    lineHeight: "1.25rem",
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
                      className="toc-li"
                      sx={{
                        "&.toc-li": {
                          marginTop: "0",
                        },
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
                          paddingTop: `4px`,
                          paddingBottom: `4px`,
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
              </>
            )}
            {/* <ul>
            {headingsMemo.map((i) => (
              <li key={i.id}>
                <a href={`#${i.anchor}`}>{i.label}</a>
              </li>
            ))}
          </ul> */}
          </Grid2>
        )}
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
      className="doc-home-section"
      sx={{
        display: "flex",
        flexDirection: "column",
        gap: "24px",
        marginBottom: "48px",

        "& > h2": {
          margin: 0,
        },

        "> p": {
          marginBottom: 0,
        },

        "> a.button": {
          fontSize: "14px",
          fontWeight: 500,
          lineHeight: 1.5,
          backgroundColor: "#F9F9F9",
          color: "text.primary",
          border: "1px solid #D9D9D9",
          padding: "10px 12px",
          width: "fit-content",
          display: "inline-flex",
          justifyContent: "center",
          alignItems: "center",
          cursor: "pointer",
          textDecoration: "none",
          whiteSpace: "nowrap",
          transition: "all 0.2s ease-in-out",
          "&:hover": {
            textDecoration: "none",
            borderColor: "text.secondary",
          },
        },

        "> a.button-primary": {
          color: "#ffffff",
          backgroundColor: "primary.main",
          border: "none",
        },
      }}
    >
      <Typography component="h2" variant="h2" id={id}>
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
      sx={(theme) => ({
        width: "100%",
        display: {
          xs: "flex",
          sm: "grid",
        },
        flexDirection: "column",
        gridTemplateColumns: "repeat(auto-fit, minmax(224px, 30%))",
        gap: "1.25rem",
        justifyContent: "start",

        "& > a.doc-home-card": {
          backgroundColor: theme.palette.carbon[50],
          "&:hover": {
            textDecoration: "none",
          },
        },
      })}
    >
      {children}
    </Box>
  );
}

interface DocHomeCardProps {
  href: string;
  icon: string;
  label: string;
  colSpan?: 1 | 2 | 3;
  actionBtnLabel?: string;
  ctaGraphic?: string;
}

export function DocHomeCard(props: React.PropsWithChildren<DocHomeCardProps>) {
  const {
    children,
    href = "",
    icon = "global-tidb-product",
    label,
    colSpan,
    actionBtnLabel,
    ctaGraphic,
  } = props;

  return (
    <Box
      component="a"
      className="doc-home-card"
      target={href.startsWith("http") ? "_blank" : undefined}
      referrerPolicy="no-referrer-when-downgrade"
      href={href}
      sx={(theme) => ({
        position: "relative",
        zIndex: 0,
        padding: "24px",
        transition: ".5s",
        border: `1px solid ${theme.palette.carbon[400]}`,
        gridColumn: colSpan ? `span ${colSpan}` : undefined,

        "&:hover": {
          background:
            "radial-gradient(46.96% 65.78% at 100% 96.96%, #F5F8FA 0%, #FBFDFD 56.35%, #FFFFFF 100%)",
          borderColor: "var(--tiui-palette-peacock-800)",
          boxShadow: "0px 1px 0px 0px rgba(200, 206, 208, 0.1)",
        },

        "& > img.card-cta-graphic.card-cta-graphic": {
          backgroundColor: "transparent",
        },
      })}
    >
      <Box
        className="card-content"
        sx={(theme) => ({
          "& > h3": {
            fontSize: "16px",
            marginBottom: "12px",
          },

          "& > p": {
            fontSize: "14px",
            color: theme.palette.carbon[700],
            marginBottom: 0,
          },

          "& > img.card-content-img.card-content-img": {
            backgroundColor: "transparent",
            margin: 0,
          },
        })}
      >
        <Typography
          component="img"
          className="card-content-img"
          src={require(`../../../images/docHome/${icon}.svg`)?.default}
          alt={label}
          sx={{
            maxWidth: "44px",
            maxHeight: "44px",
          }}
        />
        <Typography component="h3" variant="h3">
          {label}
        </Typography>
        {children}
        {actionBtnLabel && (
          <Button
            variant="contained"
            sx={{
              marginTop: "12px",
              color: "carbon.50",
              backgroundColor: "text.primary",
              padding: "10px 12px",
              "&:hover": {
                backgroundColor: "text.secondary",
              },
            }}
          >
            {actionBtnLabel}
          </Button>
        )}
      </Box>
      {ctaGraphic && (
        <Box
          component="img"
          className="card-cta-graphic"
          src={require(`../../../images/docHome/${ctaGraphic}.svg`)?.default}
          alt={label}
          sx={{
            right: 0,
            bottom: 0,
            position: "absolute",
            zIndex: -1,
          }}
        />
      )}
    </Box>
  );
}
