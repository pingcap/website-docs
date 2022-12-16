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
  ArchiveTiDBNotice,
} from "components/Card/CustomNotice";
import { Locale, PathConfig, FrontMatter, BuildType } from "static/Type";
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
  buildType: BuildType;
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
    buildType,
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
        {buildType === "archive" && typeof name !== "undefined" && (
          <ArchiveTiDBNotice
            name={name}
            pathConfig={pathConfig}
            availIn={availIn}
          />
        )}
        {buildType !== "archive" && (
          <CustomNotice name={name} pathConfig={pathConfig} availIn={availIn} />
        )}
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
