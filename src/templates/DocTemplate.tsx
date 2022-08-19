import * as React from "react";
import { graphql, Link } from "gatsby";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import "styles/global.css";

import Layout from "components/Layout";
import LeftNav from "components/Navigation/LeftNav";
import MDXContent from "components/Layout/MDXContent";

export default function DocTemplate({
  pageContext: { name, availIn, pathConfig, filePath, pageUrl },
  data,
}: any) {
  const {
    site,
    mdx: { frontmatter, tableOfContents, body },
    navigation: { navigation },
  } = data;

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
              <MDXContent />
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
