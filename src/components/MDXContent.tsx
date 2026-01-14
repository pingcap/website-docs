import * as React from "react";

import { MDXProvider } from "@mdx-js/react";
import { MDXRenderer } from "gatsby-plugin-mdx";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";

import * as MDXComponents from "components/MDXComponents";
import { CustomNotice } from "components/Card/CustomNotice";
import {
  PathConfig,
  BuildType,
  CloudPlan,
  TOCNamespace,
} from "shared/interface";
import replaceInternalHref from "shared/utils/anchor";
import { Pre } from "components/MDXComponents/Pre";
import { useCustomContent } from "components/MDXComponents/CustomContent";
import { usePageType } from "shared/usePageType";
import { H1 } from "./MDXComponents/H1";

export default function MDXContent(props: {
  data: any;
  className?: string;
  name: string;
  pathConfig: PathConfig;
  filePath: string;
  availIn: string[];
  language: string;
  buildType: BuildType;
  pageUrl: string;
  cloudPlan: CloudPlan | null;
  namespace?: TOCNamespace;
}) {
  const {
    data,
    className,
    name,
    pathConfig,
    filePath,
    availIn,
    language,
    buildType,
    pageUrl,
    cloudPlan,
    namespace,
  } = props;

  const pageType = usePageType(language, pageUrl);
  const CustomContent = useCustomContent(pageType, cloudPlan, language);
  // const isAutoTranslation = useIsAutoTranslation(pageUrl || "");

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

  // Create H1 wrapper with props
  const H1WithProps = React.useCallback(
    (props: { children: React.ReactNode }) => (
      <H1
        pathConfig={pathConfig}
        filePath={filePath}
        pageUrl={pageUrl}
        buildType={buildType}
        language={language}
        {...props}
      />
    ),
    [pathConfig, filePath, pageUrl, namespace]
  );

  return (
    <Container disableGutters className={className} maxWidth="lg">
      <Box className="markdown-body">
        {buildType !== "archive" && (
          <CustomNotice name={name} pathConfig={pathConfig} availIn={availIn} />
        )}
        <MDXProvider
          components={{
            ...MDXComponents,
            pre: Pre,
            h1: H1WithProps,
            CustomContent,
          }}
        >
          <MDXRenderer>{data}</MDXRenderer>
        </MDXProvider>
      </Box>
    </Container>
  );
}
