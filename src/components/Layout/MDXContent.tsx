import * as React from "react";
import { graphql, Link } from "gatsby";

import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import * as MDXConponents from "components/MDXComponents";
import {
  CustomNotice,
  MachineTranslationNotice,
} from "components/Card/CustomNotice";
import { Locale, PathConfig } from "static/Type";

export default function MDXContent(props: {
  data: any;
  className?: string;
  name: string;
  pathConfig: PathConfig;
  availIn: string[];
  language: string;
}) {
  const { data, className, name, pathConfig, availIn, language } = props;

  return (
    <Container className={className}>
      <Box className="markdown-body">
        <CustomNotice name={name} pathConfig={pathConfig} availIn={availIn} />
        {language === "ja" && (
          <MachineTranslationNotice
            name={name}
            pathConfig={pathConfig}
            availIn={availIn}
          />
        )}
        <MDXProvider components={{ ...MDXConponents, Link }}>
          <MDXRenderer>{data}</MDXRenderer>
        </MDXProvider>
      </Box>
    </Container>
  );
}
