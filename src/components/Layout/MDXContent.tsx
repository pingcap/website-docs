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
import { Locale, PathConfig, FrontMatter } from "static/Type";
import { useTotalContributors } from "components/Avatar/Contributors";
import replaceInternalHref from "utils/anchor";

export default function MDXContent(props: {
  data: any;
  className?: string;
  name: string;
  pathConfig: PathConfig;
  filePath: string;
  frontmatter: FrontMatter;
  availIn: string[];
  language: string;
}) {
  const {
    data,
    className,
    name,
    pathConfig,
    filePath,
    frontmatter,
    availIn,
    language,
  } = props;

  React.useEffect(() => {
    // https://github.com/pingcap/website-docs/issues/221
    // md title with html tag will cause anchor mismatch
    pathConfig &&
      replaceInternalHref(
        pathConfig.locale,
        pathConfig.repo,
        pathConfig.version || ""
      );
  });

  !frontmatter?.hide_commit && useTotalContributors(pathConfig, filePath);

  return (
    <Container className={className} maxWidth="xl">
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
