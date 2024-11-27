import * as React from "react";
import { Link } from "gatsby";

import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import * as MDXComponents from "components/MDXComponents";
import {
  CustomNotice,
  MachineTranslationNotice,
  ArchiveTiDBNotice,
} from "components/Card/CustomNotice";
import { PathConfig, FrontMatter, BuildType } from "shared/interface";
import { useTotalContributors } from "components/Contributors";
import replaceInternalHref from "shared/utils/anchor";
import { Pre } from "components/MDXComponents/Pre";
import {
  CustomContent,
  useCustomContent,
} from "components/MDXComponents/CustomContent";
import { getPageType } from "shared/utils";

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
  pageUrl: string;
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
    pageUrl,
  } = props;

  const pageType = getPageType(language, pageUrl);
  const CustomContentWithPageType = useCustomContent(pageType);

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
    <Container disableGutters className={className} maxWidth="lg">
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
        {language === "ja" && pageType !== "home" && (
          <MachineTranslationNotice
            name={name}
            pathConfig={pathConfig}
            availIn={availIn}
          />
        )}
        <MDXProvider
          components={{
            ...MDXComponents,
            Link,
            pre: Pre,
            CustomContent: CustomContentWithPageType,
          }}
        >
          <MDXRenderer>{data}</MDXRenderer>
        </MDXProvider>
      </Box>
    </Container>
  );
}
