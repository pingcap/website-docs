import * as React from "react";
import { graphql, Link } from "gatsby";
import { Trans, useI18next } from "gatsby-plugin-react-i18next";
import clsx from "clsx";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

// import "styles/global.css";
import "styles/docTemplate.css";

import Layout from "components/Layout";
import { LeftNavDesktop, LeftNavMobile } from "components/Navigation/LeftNav";
import MDXContent from "components/Layout/MDXContent";
import RightNav, { RightNavMobile } from "components/Navigation/RightNav";
import ScrollToTopBtn from "components/Button/ScrollToTopBtn";
import FeedbackBtn from "components/Button/FeedbackBtn";
import {
  TableOfContent,
  PageContext,
  FrontMatter,
  RepoNav,
  BuildType,
  Locale,
} from "static/Type";
import { useHighlightCode } from "utils/CustomHook";
import Seo from "components/Layout/Seo";
import { getStable, generateUrl } from "utils";
import GitCommitInfoCard from "components/Card/GitCommitInfoCard";

interface DocTemplateProps {
  pageContext: PageContext & { pageUrl: string; buildType: BuildType };
  data: {
    site: {
      siteMetadata: {
        siteUrl: string;
      };
    };
    mdx: {
      frontmatter: FrontMatter;
      body: string;
      tableOfContents: TableOfContent;
    };
    navigation?: {
      navigation: RepoNav;
    };
  };
}

export default function DocTemplate({
  pageContext: { name, availIn, pathConfig, filePath, pageUrl, buildType },
  data,
}: DocTemplateProps) {
  const {
    site,
    mdx: { frontmatter, tableOfContents, body },
    navigation: originNav,
  } = data;

  const navigation = originNav ? originNav.navigation : [];

  const tocData: TableOfContent[] | undefined = React.useMemo(() => {
    if (tableOfContents.items?.length === 1) {
      return tableOfContents.items![0].items;
    }
    return tableOfContents.items || [];
  }, [tableOfContents.items]);

  const stableBranch = getStable(pathConfig.repo);

  useHighlightCode();

  const { language } = useI18next();

  return (
    <>
      <Layout
        locales={availIn.locale}
        menu={
          frontmatter?.hide_leftNav ? null : (
            <LeftNavMobile
              data={navigation}
              current={pageUrl}
              name={name}
              pathConfig={pathConfig}
              availIn={availIn.version}
            />
          )
        }
        docInfo={{
          version: pathConfig.version || "stable",
          type: pathConfig.repo,
        }}
        buildType={buildType}
      >
        <Seo
          lang={language as Locale}
          title={frontmatter.title}
          description={frontmatter.summary}
          meta={[
            {
              name: "doc:lang",
              content: pathConfig.locale,
            },
            {
              name: "doc:type",
              content: pathConfig.repo,
            },
            {
              name: "doc:version",
              content: pathConfig.branch,
            },
          ]}
          link={[
            ...(pathConfig.branch !== stableBranch && stableBranch != null
              ? [
                  {
                    rel: "canonical",
                    href: `${site.siteMetadata.siteUrl}${generateUrl(name, {
                      ...pathConfig,
                      branch: stableBranch,
                    })}`,
                  },
                ]
              : []),
          ]}
        />
        <Box
          sx={{ marginTop: "5rem", display: "flex" }}
          className={clsx("PingCAP-Doc")}
        >
          <Box sx={{ display: "flex", width: "100%" }}>
            {!frontmatter?.hide_leftNav && (
              <LeftNavDesktop
                data={navigation}
                current={pageUrl}
                name={name}
                pathConfig={pathConfig}
                availIn={availIn.version}
                buildType={buildType}
              />
            )}
            <Box
              component="main"
              sx={{
                width: "100%",
                maxWidth: {
                  lg: frontmatter?.hide_leftNav
                    ? "100%"
                    : "calc(100% - 18.75rem)",
                },
              }}
            >
              <Box
                sx={{
                  maxWidth: "1340px",
                  width: "100%",
                  marginLeft: "auto",
                  marginRight: "auto",
                  display: "block",
                  boxSizing: "border-box",
                }}
              >
                <Stack
                  sx={{
                    flexDirection: {
                      xs: "column-reverse",
                      sm: "row",
                    },
                  }}
                >
                  <Box
                    sx={{
                      width: {
                        xs: "100%",
                        sm: frontmatter?.hide_sidebar
                          ? "100%"
                          : "calc(100% - 17.5rem)",
                      },
                      padding: "1.5rem 0",
                    }}
                  >
                    <MDXContent
                      data={body}
                      className={clsx("doc-content")}
                      name={name}
                      pathConfig={pathConfig}
                      filePath={filePath}
                      frontmatter={frontmatter}
                      availIn={availIn.version}
                      language={language}
                      buildType={buildType}
                    />
                    {!frontmatter?.hide_commit && (
                      <GitCommitInfoCard
                        pathConfig={pathConfig}
                        filePath={filePath}
                        title={frontmatter.title}
                      />
                    )}
                  </Box>
                  {!frontmatter?.hide_sidebar && (
                    <>
                      <Box
                        sx={{
                          width: "17.5rem",
                          display: {
                            xs: "none",
                            sm: "block",
                          },
                        }}
                      >
                        <RightNav
                          toc={tocData}
                          pathConfig={pathConfig}
                          filePath={filePath}
                        />
                      </Box>
                      <Box
                        sx={{
                          padding: "1rem",
                          display: {
                            sm: "none",
                          },
                        }}
                      >
                        <RightNavMobile
                          toc={tocData}
                          pathConfig={pathConfig}
                          filePath={filePath}
                        />
                      </Box>
                    </>
                  )}
                </Stack>
                {language !== "ja" && buildType !== "archive" && (
                  <Box
                    sx={{
                      width: "fit-content",
                      position: "fixed",
                      bottom: "4rem",
                      right: "1rem",
                    }}
                  >
                    <FeedbackBtn
                      title={frontmatter.title}
                      locale={pathConfig.locale}
                    />
                  </Box>
                )}
                <Box
                  sx={{
                    width: "fit-content",
                    position: "fixed",
                    bottom: "1rem",
                    right: "1rem",
                  }}
                >
                  <ScrollToTopBtn />
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </Layout>
    </>
  );
}

export const query = graphql`
  query ($id: String, $language: String!, $navUrl: String!) {
    site {
      siteMetadata {
        siteUrl
      }
    }

    mdx(id: { eq: $id }) {
      frontmatter {
        title
        summary
        hide_sidebar
        hide_commit
        hide_leftNav
      }
      body
      tableOfContents
    }

    navigation: mdx(slug: { eq: $navUrl }) {
      navigation
    }

    locales: allLocale(filter: { language: { eq: $language } }) {
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
