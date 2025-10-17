import * as React from "react";
import { graphql } from "gatsby";
import { useI18next } from "gatsby-plugin-react-i18next";
import clsx from "clsx";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import "styles/docTemplate.css";

import Layout from "components/Layout";
import {
  LeftNavDesktop,
  LeftNavMobile,
} from "components/Layout/Navigation/LeftNav";
import MDXContent from "components/MDXContent";
import RightNav, {
  RightNavMobile,
} from "components/Layout/Navigation/RightNav";
import {
  TableOfContent,
  PageContext,
  FrontMatter,
  RepoNav,
  BuildType,
  Locale,
} from "shared/interface";
import Seo from "components/Seo";
import { getStable, generateUrl } from "shared/utils";
import GitCommitInfoCard from "components/Card/GitCommitInfoCard";
import { FeedbackSection } from "components/Card/FeedbackSection";
import { FeedbackSurveyCampaign } from "components/Campaign/FeedbackSurvey";
import { DOC_HOME_URL } from "shared/resources";
import { useReportReadingRate } from "shared/useReportReadingRate";
import {
  CloudPlan,
  CloudPlanProvider,
  useCloudPlan,
  useCloudPlanNavigate,
} from "shared/useCloudPlan";
import { filterTOC } from "shared/filterTOC";

interface DocTemplateProps {
  pageContext: PageContext & {
    pageUrl: string;
    buildType: BuildType;
    feature?: {
      globalHome?: boolean;
      banner?: boolean;
      feedback?: boolean;
    };
    inDefaultPlan: string | null;
  };
  data: {
    site: {
      siteMetadata: {
        siteUrl: string;
      };
    };
    mdx: {
      frontmatter: FrontMatter;
      body: string;
      tableOfContents: TableOfContent;
      timeToRead: number;
    };
    navigation?: {
      navigation: RepoNav;
    };
    starterNavigation?: {
      starterNavigation: RepoNav;
    };
    essentialNavigation?: {
      essentialNavigation: RepoNav;
    };
  };
}

const DocTemplateWithProvider = (props: DocTemplateProps) => {
  const [cloudPlan, setCloudPlan] = React.useState<CloudPlan | null>(
    props.pageContext.inDefaultPlan as CloudPlan | null
  );
  return (
    <CloudPlanProvider
      value={{
        cloudPlan,
        setCloudPlan,
        repo: props.pageContext.pathConfig.repo,
      }}
    >
      <DocTemplate {...props} />
    </CloudPlanProvider>
  );
};

export default DocTemplateWithProvider;

function DocTemplate({
  pageContext: {
    name,
    availIn,
    pathConfig,
    filePath,
    pageUrl,
    buildType,
    feature,
    inDefaultPlan,
  },
  data,
}: DocTemplateProps) {
  const {
    mdx: { frontmatter, tableOfContents, body, timeToRead },
    navigation: originNav,
  } = data;

  // const { cloudPlan } = useCloudPlan();
  // useCloudPlanNavigate(pathConfig.repo);
  useReportReadingRate(timeToRead);

  const classicNavigation = originNav ? originNav.navigation : [];
  const navigation = filterTOC(classicNavigation);

  const { language } = useI18next();
  const availablePlans = ["premium"];

  const tocData: TableOfContent[] | undefined = React.useMemo(() => {
    if (tableOfContents.items?.length === 1) {
      return tableOfContents.items![0].items;
    }
    return tableOfContents.items || [];
  }, [tableOfContents.items]);

  const stableBranch = getStable(pathConfig.repo);

  const bannerVisible = feature?.banner;
  const isGlobalHome = !!feature?.globalHome;

  return (
    <Layout
      name={name}
      pathConfig={pathConfig}
      locales={availIn.locale}
      bannerEnabled={bannerVisible}
      pageUrl={pageUrl}
      menu={
        frontmatter?.hide_leftNav ? null : (
          <LeftNavMobile
            data={navigation}
            current={pageUrl}
            name={name}
            pathConfig={pathConfig}
            availIn={availIn.version}
            availablePlans={availablePlans}
          />
        )
      }
      docInfo={{
        version: pathConfig.version || "stable",
        type: pathConfig.repo,
      }}
      buildType={buildType}
    >
      <Seo
        lang={language as Locale}
        title={frontmatter.title}
        description={frontmatter.summary}
        meta={[
          {
            name: "doc:lang",
            content: pathConfig.locale,
          },
          {
            name: "doc:type",
            content: pathConfig.repo,
          },
          {
            name: "doc:version",
            content: pathConfig.branch,
          },
        ]}
        link={[
          ...(pathConfig.branch !== stableBranch && stableBranch != null
            ? [
                {
                  rel: "canonical",
                  href: `${DOC_HOME_URL}${generateUrl(name, {
                    ...pathConfig,
                    version: "stable",
                  })}/`,
                },
              ]
            : []),
        ]}
        noindex
        archived={buildType === "archive"}
      />
      <Box
        sx={{ marginTop: bannerVisible ? "7.5rem" : "5rem", display: "flex" }}
        className={clsx("PingCAP-Doc", {
          "doc-feature-banner": bannerVisible,
        })}
      >
        <Box sx={{ display: "flex", width: "100%" }}>
          {!frontmatter?.hide_leftNav && (
            <LeftNavDesktop
              data={navigation}
              current={pageUrl}
              name={name}
              pathConfig={pathConfig}
              availIn={availIn.version}
              buildType={buildType}
              bannerEnabled={bannerVisible}
              availablePlans={availablePlans}
            />
          )}
          <Box
            component="main"
            className={clsx({
              "doc-global-home": isGlobalHome,
            })}
            sx={{
              width: "100%",
              maxWidth: {
                lg: frontmatter?.hide_leftNav
                  ? "100%"
                  : "calc(100% - 18.75rem)",
              },
            }}
          >
            <Box
              sx={{
                maxWidth: "1200px",
                width: "100%",
                marginLeft: "auto",
                marginRight: "auto",
                display: "block",
                boxSizing: "border-box",
              }}
            >
              <Stack
                sx={{
                  flexDirection: {
                    xs: "column-reverse",
                    md: "row",
                  },
                }}
              >
                <Box
                  sx={{
                    width: {
                      xs: "100%",
                      md: frontmatter?.hide_sidebar
                        ? "100%"
                        : "calc(100% - 290px)",
                    },
                    padding: "36px 16px",
                    boxSizing: "border-box",
                  }}
                >
                  <MDXContent
                    data={body}
                    className={clsx("doc-content")}
                    name={name}
                    pathConfig={pathConfig}
                    filePath={filePath}
                    frontmatter={frontmatter}
                    availIn={availIn.version}
                    language={language}
                    buildType={buildType}
                    pageUrl={pageUrl}
                    cloudPlan={"premium"}
                  />
                  {!frontmatter?.hide_commit && buildType !== "archive" && (
                    <GitCommitInfoCard
                      pathConfig={pathConfig}
                      filePath={filePath}
                      title={frontmatter.title}
                    />
                  )}
                  {!!feature?.feedback && buildType !== "archive" && (
                    <FeedbackSection
                      title={frontmatter.title}
                      locale={pathConfig.locale}
                    />
                  )}
                </Box>
                {!frontmatter?.hide_sidebar && (
                  <>
                    <Box
                      width={290}
                      sx={{
                        display: {
                          xs: "none",
                          md: "block",
                        },
                      }}
                    >
                      <RightNav
                        toc={tocData}
                        pathConfig={pathConfig}
                        filePath={filePath}
                        buildType={buildType}
                        pageUrl={pageUrl}
                        bannerVisible={bannerVisible}
                      />
                    </Box>
                    <Box
                      sx={{
                        padding: "1rem",
                        display: {
                          md: "none",
                        },
                      }}
                    >
                      <RightNavMobile
                        toc={tocData}
                        pathConfig={pathConfig}
                        filePath={filePath}
                        buildType={buildType}
                      />
                    </Box>
                  </>
                )}
              </Stack>
              <Box
                sx={{
                  width: "fit-content",
                  position: "fixed",
                  bottom: "1rem",
                  right: "1rem",
                  zIndex: 9,
                }}
              >
                <FeedbackSurveyCampaign />
                {/* <ScrollToTopBtn /> */}
              </Box>
            </Box>
          </Box>
        </Box>
      </Box>
    </Layout>
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
      timeToRead
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
