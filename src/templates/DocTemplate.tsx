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
import RightNav from "components/Navigation/RightNav";
import { TableOfContent } from "static/Type";

export default function DocTemplate({
  pageContext: { name, availIn, pathConfig, filePath, pageUrl },
  data,
}: any) {
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
      <Layout menu={<LeftNavMobile data={navigation} current={pageUrl} />}>
        <Box sx={{ marginTop: "5rem", display: "flex" }}>
          <Box sx={{ display: "flex", width: "100%" }}>
            {/* <LeftNavMobile data={navigation} current={pageUrl} /> */}
            <LeftNavDesktop data={navigation} current={pageUrl} />
            <Box
              component="main"
              sx={{ width: "100%", maxWidth: { lg: "calc(100% - 18.75rem)" } }}
            >
              <Container
                sx={{
                  padding: {
                    xs: "0",
                  },
                }}
              >
                <Stack direction="row">
                  <Box sx={{ width: { sm: "calc(100% - 17.5rem)" } }}>
                    <MDXContent data={body} />
                  </Box>
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
