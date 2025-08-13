import * as React from "react";
import { graphql } from "gatsby";
import { I18nextContext, Link, Trans } from "gatsby-plugin-react-i18next";
import { I18nextProvider } from "react-i18next";
import Container from "@mui/material/Container";
import i18next from "i18next";
import Stack from "@mui/material/Stack";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import Layout from "components/Layout";
import { BuildType, Locale, Repo } from "shared/interface";
import { Page404Icon } from "components/Icons";
import Seo from "components/Layout/Seo";

import CONFIG from "../../docs/docs.json";
import { useEffect, useRef, useState } from "react";
interface AllLocales {
  locales: {
    edges: {
      node: {
        ns: string;
        data: string;
        language: Locale;
      };
    }[];
  };
}

interface PageNotFoundTemplateProps {
  pageContext: {
    buildType: BuildType;
    feature?: {
      banner?: boolean;
    };
  };
  data: AllLocales;
}

const REDIRECT_SECONDS = 1;

export default function PageNotFoundTemplate({
  pageContext: { feature, buildType },
  data,
}: PageNotFoundTemplateProps) {
  const pathname =
    typeof window === "undefined" ? "" : window.location.pathname;
  const context = React.useContext(I18nextContext);
  const language = React.useMemo<Locale>(() => {
    const lang = pathname.split("/")[1] || "";
    switch (lang) {
      case "zh":
        return Locale.zh;
      case "ja":
        return Locale.ja;
      default:
        return Locale.en;
    }
  }, [pathname]);
  const i18n = React.useMemo(() => {
    const i18n = i18next.createInstance();

    const resources = data.locales.edges.reduce((acc, cur) => {
      acc[cur.node.language] = { [cur.node.ns]: JSON.parse(cur.node.data) };
      return acc;
    }, {} as Record<string, Record<string, any>>);

    i18n.init({
      resources,
      lng: language,
      fallbackLng: "en",
      react: {
        useSuspense: false,
      },
    });
    return i18n;
  }, [language, data]);

  const isArchived = buildType === "archive";
  const bannerVisible =
    (feature?.banner && language !== Locale.ja) || isArchived;

  const secondsRef = useRef(REDIRECT_SECONDS);
  const [seconds, setSeconds] = useState(REDIRECT_SECONDS);
  const { isArchivedDoc, redirectUrl: archivedRedirectUrl } = useArchiveDoc(
    pathname,
    language
  );
  const shouldRedirect = isArchivedDoc;
  const redirectUrl = archivedRedirectUrl;

  useEffect(() => {
    if (isArchived || !shouldRedirect) {
      return;
    }

    let timeout: NodeJS.Timeout;
    const redirectTimout = () => {
      timeout = setTimeout(() => {
        setSeconds((prev) => prev - 1);
        secondsRef.current = secondsRef.current - 1;
        if (secondsRef.current === 0) {
          window.location.href = redirectUrl;
        } else {
          redirectTimout();
        }
      }, 1000);
    };
    redirectTimout();

    return () => {
      clearTimeout(timeout);
      secondsRef.current = REDIRECT_SECONDS;
      setSeconds(REDIRECT_SECONDS);
    };
  }, []);

  return (
    <>
      <I18nextProvider i18n={i18n}>
        <I18nextContext.Provider value={{ ...context, language }}>
          <Layout bannerEnabled={bannerVisible} buildType={buildType}>
            <Seo lang={language} title="404 Not Found" noindex />
            <Container
              sx={{
                marginTop: bannerVisible ? "7.5rem" : "5rem",
                minHeight: "calc(100vh - 30rem)",
                display: "flex",
                alignItems: "center",
              }}
            >
              <Stack
                direction="row"
                sx={{
                  justifyContent: "space-between",
                  alignItems: "center",
                  width: "100%",
                }}
              >
                <Stack
                  sx={{
                    width: {
                      xs: "100%",
                      md: "50%",
                    },
                  }}
                >
                  {!isArchived && isArchivedDoc ? (
                    <>
                      <Typography component="h1" variant="h1">
                        <Trans i18nKey="doc404.archive.title" />
                      </Typography>
                      <Link to={redirectUrl}>{redirectUrl}</Link>
                      <Typography>
                        <Trans
                          i18nKey="doc404.archive.redirect"
                          values={{ seconds }}
                        />
                      </Typography>
                    </>
                  ) : (
                    <>
                      <Typography component="h1" variant="h1">
                        <Trans i18nKey="doc404.title" />
                      </Typography>
                      {["en", "zh"].includes(language) && (
                        <>
                          <Typography>
                            <Trans i18nKey="doc404.youMayWish" />
                          </Typography>
                          <Typography component="ul">
                            <Typography component="li">
                              <Trans
                                i18nKey="doc404.goToDocHome"
                                components={[<Link to="/" />]}
                              />
                            </Typography>
                            <Typography component="li">
                              <Trans i18nKey="doc404.searchDoc" />
                            </Typography>
                          </Typography>
                        </>
                      )}
                    </>
                  )}
                </Stack>
                <Box
                  id="right"
                  sx={{
                    width: "50%",
                    display: {
                      xs: "none",
                      md: "block",
                    },
                  }}
                >
                  <Page404Icon
                    sx={{
                      width: "100%",
                      height: "100%",
                    }}
                  />
                </Box>
              </Stack>
            </Container>
          </Layout>
        </I18nextContext.Provider>
      </I18nextProvider>
    </>
  );
}

const useArchiveDoc = (pathname: string, lang: Locale) => {
  const pathArr = pathname.split("/");
  const repo = lang === Locale.en ? (pathArr[1] as Repo) : pathArr[2];
  const version = lang === Locale.en ? pathArr[2] : pathArr[3];
  const isJA = lang === Locale.ja;
  const docConfig = CONFIG.docs[repo as keyof typeof CONFIG.docs] as {
    archived?: string[];
  };
  // for ja, because not all docs are archived, so don't check archived
  const isArchivedDoc = !isJA && docConfig?.archived?.includes(version || "");
  const redirectUrl = `https://docs-archive.pingcap.com${pathname}`;

  return { isArchivedDoc, redirectUrl };
};

export const query = graphql`
  query {
    locales: allLocale {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
