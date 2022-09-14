import * as React from "react";
import { graphql, Link } from "gatsby";

import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import * as MDXConponents from "components/MDXComponents";

export default function MDXContent(props: { data: any; className?: string }) {
  const { data, className } = props;
  return (
    <Container className={className}>
      <Box className="markdown-body">
        <MDXProvider components={{ ...MDXConponents, Link }}>
          <MDXRenderer>{data}</MDXRenderer>
        </MDXProvider>
      </Box>
    </Container>
  );
}