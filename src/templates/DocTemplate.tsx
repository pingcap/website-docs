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
} from "components/Layout/LeftNav/LeftNav";
import MDXContent from "components/MDXContent";
import RightNav, { RightNavMobile } from "components/Layout/RightNav/RightNav";
import {
  TableOfContent,
  PageContext,
  FrontMatter,
  RepoNav,
  BuildType,
  Locale,
  CloudPlan,
  TOCNamespace,
} from "shared/interface";
import Seo from "components/Seo";
import { getStable, generateUrl } from "shared/utils";
import { NavItemConfig } from "components/Layout/Header/HeaderNavConfigType";
import { generateNavConfig } from "components/Layout/Header/HeaderNavConfigData";
import { getSelectedNavItem } from "components/Layout/Header/getSelectedNavItem";
import GitCommitInfoCard from "components/Card/GitCommitInfoCard";
import { FeedbackSection } from "components/Card/FeedbackSection";
import { FeedbackSurveyCampaign } from "components/Campaign/FeedbackSurvey";
import { DOC_HOME_URL } from "shared/resources";
import { useIsAutoTranslation } from "shared/useIsAutoTranslation";
import { useReportReadingRate } from "shared/useReportReadingRate";
import {
  CloudPlanProvider,
  useCloudPlan,
  useCloudPlanNavigate,
} from "shared/useCloudPlan";
import { filterTOC } from "shared/filterTOC";
import { filterRightToc } from "shared/filterRightToc";

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
    namespace: TOCNamespace;
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
      toc: TableOfContent;
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
    namespace,
  },
  data,
}: DocTemplateProps) {
  const {
    mdx: { frontmatter, body, toc, timeToRead },
    navigation: originNav,
    starterNavigation: starterNav,
    essentialNavigation: essentialNav,
  } = data;

  const { cloudPlan, isStarter, isEssential } = useCloudPlan();
  useCloudPlanNavigate(namespace, inDefaultPlan);
  useReportReadingRate(timeToRead);

  const classicNavigation = originNav ? originNav.navigation : [];
  const starterNavigation = starterNav ? starterNav.starterNavigation : [];
  const essentialNavigation = essentialNav
    ? essentialNav.essentialNavigation
    : [];
  const navigationByNamespace =
    namespace !== TOCNamespace.TiDBCloud
      ? classicNavigation
      : isStarter
      ? starterNavigation
      : isEssential
      ? essentialNavigation
      : classicNavigation;
  const navigation = filterTOC(navigationByNamespace);

  const { language, t } = useI18next();
  const haveStarter = starterNavigation.length > 0;
  const haveEssential = essentialNavigation.length > 0;
  const availablePlans = ["dedicated"];
  if (haveStarter) {
    availablePlans.push("starter");
  }
  if (haveEssential) {
    availablePlans.push("essential");
  }

  const rightTocData: TableOfContent[] | undefined = React.useMemo(() => {
    let tocItems: TableOfContent[] = [];
    if (toc?.items?.length === 1) {
      tocItems = toc.items![0].items || [];
    } else {
      tocItems = toc.items || [];
    }

    // Filter TOC based on CustomContent conditions
    return filterRightToc(tocItems, namespace, cloudPlan, language);
  }, [toc, namespace, cloudPlan, language]);

  const stableBranch = getStable(pathConfig.repo);

  const isAutoTranslation = useIsAutoTranslation(namespace);
  const bannerVisible =
    buildType === "archive" || isAutoTranslation || feature?.banner;
  const isGlobalHome = !!feature?.globalHome;

  const [selectedNavItem, setSelectedNavItem] =
    React.useState<NavItemConfig | null>(() => {
      const headerNavConfig = generateNavConfig(t, cloudPlan, buildType, language);
      return getSelectedNavItem(headerNavConfig, namespace);
    });

  return (
    <Layout
      name={name}
      pathConfig={pathConfig}
      locales={availIn.locale}
      bannerEnabled={bannerVisible}
      menu={
        frontmatter?.hide_leftNav ? null : (
          <LeftNavMobile
            data={navigation}
            current={pageUrl}
            name={name}
            pathConfig={pathConfig}
            availIn={availIn.version}
            availablePlans={availablePlans}
            namespace={namespace}
          />
        )
      }
      docInfo={{
        version: pathConfig.version || "stable",
        type: pathConfig.repo,
      }}
      buildType={buildType}
      namespace={namespace}
      onSelectedNavItemChange={setSelectedNavItem}
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
        noindex={buildType === "archive"}
        archived={buildType === "archive"}
      />
      <Box
        sx={{
          display: "flex",
        }}
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
              selectedNavItem={selectedNavItem}
              namespace={namespace}
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
                    availIn={availIn.version}
                    language={language}
                    buildType={buildType}
                    pageUrl={pageUrl}
                    cloudPlan={cloudPlan}
                    namespace={namespace}
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
                        toc={rightTocData}
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
                        toc={rightTocData}
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
  query (
    $id: String
    $language: String!
    $navUrl: String!
    $starterNavUrl: String!
    $essentialNavUrl: String!
  ) {
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
      toc
      timeToRead
    }

    navigation: mdx(slug: { eq: $navUrl }) {
      navigation
    }

    starterNavigation: mdx(slug: { eq: $starterNavUrl }) {
      starterNavigation
    }

    essentialNavigation: mdx(slug: { eq: $essentialNavUrl }) {
      essentialNavigation
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
