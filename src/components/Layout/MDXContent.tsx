import * as React from "react";
import { graphql, Link } from "gatsby";

import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";

import Box from "@mui/material/Box";

import * as Shortcodes from "components/shortcodes";

export default function MDXContent(props: { data: any }) {
  const { data } = props;
  return (
    <>
      <Box className="markdown-body">
        <MDXProvider components={{ ...Shortcodes, Link }}>
          <MDXRenderer>{data}</MDXRenderer>
        </MDXProvider>
      </Box>
    </>
  );
}
