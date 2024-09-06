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
import { Locale } from "shared/interface";
import { Page404Icon } from "components/Icons";
import Seo from "components/Layout/Seo";

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
    feature?: {
      banner?: boolean;
    };
  };
  data: AllLocales;
}

export default function PageNotFoundTemplate({
  pageContext: { feature },
  data,
}: PageNotFoundTemplateProps) {
  const pathname =
    typeof window === "undefined" ? "" : window.location.pathname;
  const context = React.useContext(I18nextContext);
  const language = React.useMemo(() => {
    const lang = pathname.split("/")[1] || "";
    switch (lang) {
      case "zh":
        return "zh";
      case "ja":
        return "ja";
      default:
        break;
    }
    return "en";
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

  const bannerVisible = feature?.banner && language !== Locale.ja;

  return (
    <>
      <I18nextProvider i18n={i18n}>
        <I18nextContext.Provider value={{ ...context, language }}>
          <Layout bannerEnabled={bannerVisible}>
            <Seo lang={language as Locale} title="404 Not Found" noindex />
            <Container
              sx={{
                marginTop: bannerVisible ? "7rem" : "5rem",
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
                      {/* <div className={styles.searchInput}>
                    <SearchInput
                      docInfo={docInfo}
                      searchValue={searchValue}
                      setSearchValue={handleSetSearchValue}
                    />
                  </div> */}
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
          {/* <Layout is404={true}>
          <Seo title="404 Not Found" noindex />
          <div className={styles.container}>
            <div className={clsx('markdown-body', styles.left)}>
              <h1 className={clsx(styles.title)}>
                {<Trans i18nKey="doc404.title" />}
              </h1>
              {['en', 'zh'].includes(language) && (
                <>
                  <div>{<Trans i18nKey="doc404.youMayWish" />}</div>
                  <ul className={clsx(styles.optionsContainer)}>
                    <li>
                      {
                        <Trans
                          i18nKey="doc404.goToDocHome"
                          components={[<Link to="/" />]}
                        />
                      }
                    </li>
                    <li>{<Trans i18nKey="doc404.searchDoc" />}</li>
                  </ul>
                  <div className={styles.searchInput}>
                    <SearchInput
                      docInfo={docInfo}
                      searchValue={searchValue}
                      setSearchValue={handleSetSearchValue}
                    />
                  </div>
                </>
              )}
            </div>
            <div className={clsx(styles.right)}></div>
          </div>
        </Layout> */}
        </I18nextContext.Provider>
      </I18nextProvider>
    </>
  );
}

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
