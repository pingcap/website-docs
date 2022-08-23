import * as React from "react";
import { graphql, Link } from "gatsby";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2

// import "styles/global.css";
import "styles/docTemplate.css";

import Layout from "components/Layout";
import LeftNav from "components/Navigation/LeftNav";
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

  const tocData: TableOfContent | undefined = React.useMemo(() => {
    if (tableOfContents.items?.length === 1) {
      return tableOfContents.items![0].items;
    }
    return tableOfContents.items || [];
  }, [tableOfContents.items]);

  return (
    <>
      <Layout>
        <Box sx={{ marginTop: "5rem", display: "flex" }}>
          <Box sx={{ display: "flex", width: "100%" }}>
            <LeftNav data={navigation} current={pageUrl} />
            <Box
              component="main"
              sx={{ width: "100%", maxWidth: "calc(100% - 18.75rem)" }}
            >
              <Container>
                <Grid2 container>
                  <Grid2 sm={12} md={9}>
                    <MDXContent data={body} />
                  </Grid2>
                  <Grid2 sm={0} md={3}>
                    <RightNav toc={tocData} />
                  </Grid2>
                </Grid2>
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
