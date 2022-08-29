import * as React from "react";
import { graphql, Link } from "gatsby";

import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import * as Shortcodes from "components/shortcodes";
import * as MDXConponents from "components/MDXComponents";

export default function MDXContent(props: { data: any }) {
  const { data } = props;
  return (
    <Container>
      <Box className="markdown-body">
        <MDXProvider components={{ ...Shortcodes, ...MDXConponents, Link }}>
          <MDXRenderer>{data}</MDXRenderer>
        </MDXProvider>
      </Box>
    </Container>
  );
}
