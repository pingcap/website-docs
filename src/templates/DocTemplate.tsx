import * as React from "react";
import { graphql, Link } from "gatsby";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2
import Stack from "@mui/material/Stack";

// import "styles/global.css";
import "styles/docTemplate.css";

import Layout from "components/Layout";
import { LeftNavDesktop, LeftNavMobile } from "components/Navigation/LeftNav";
import MDXContent from "components/Layout/MDXContent";
import RightNav, { RightNavMobile } from "components/Navigation/RightNav";
import { TableOfContent, PageContext, FrontMatter, RepoNav } from "static/Type";

interface DocTemplateProps {
  pageContext: PageContext;
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
    navigation: {
      navigation: RepoNav;
    };
  };
}

export default function DocTemplate({
  pageContext: { name, availIn, pathConfig, filePath, pageUrl },
  data,
}: DocTemplateProps) {
  const {
    site,
    mdx: { frontmatter, tableOfContents, body },
    navigation: { navigation },
  } = data;

  const tocData: TableOfContent[] | undefined = React.useMemo(() => {
    if (tableOfContents.items?.length === 1) {
      return tableOfContents.items![0].items;
    }
    return tableOfContents.items || [];
  }, [tableOfContents.items]);

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
      >
        <Box sx={{ marginTop: "5rem", display: "flex" }}>
          <Box sx={{ display: "flex", width: "100%" }}>
            {!frontmatter?.hide_leftNav && (
              <LeftNavDesktop
                data={navigation}
                current={pageUrl}
                name={name}
                pathConfig={pathConfig}
                availIn={availIn.version}
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
              <Container
                sx={{
                  padding: {
                    xs: "0",
                  },
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
                    }}
                  >
                    <MDXContent data={body} />
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
              </Container>
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
