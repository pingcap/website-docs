import * as React from "react";
import { graphql } from "gatsby";
import { Trans, useI18next } from "gatsby-plugin-react-i18next";
import { useLocation } from "@reach/router";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import "styles/algolia.css";
import "styles/docTemplate.css";

import Layout from "components/Layout";
import SearchResults from "components/Search/Results";
import SearchInput from "components/Search";
import { Tip } from "components/MDXComponents";
import Seo from "components/Seo";
import { algoliaClient } from "shared/utils/algolia";
import {
  TIDB_EN_STABLE_VERSION,
  TIDB_EN_SEARCH_INDEX_VERSION,
  OP_EN_STABLE_VERSION,
  CLOUD_EN_VERSIONS,
  EN_DOC_TYPE_LIST,
  ZH_DOC_TYPE_LIST,
  TIDB_ZH_SEARCH_INDEX_VERSION,
} from "shared/resources";
import { Locale, TOCNamespace } from "shared/interface";
import { getHeaderHeight } from "shared/headerHeight";
import { FeedbackSurveyCampaign } from "components/Campaign/FeedbackSurvey";
import { useEffect } from "react";

// TiDB: get searchable versions from fetchTidbSearchIndcies
// TiDB Cloud: only has one version
// TiDB Operator: get stable version
const fetchVersionListByDocType = (docType: string, lang: string) => {
  switch (docType) {
    case "tidb-in-kubernetes":
      return [OP_EN_STABLE_VERSION];
    case "tidbcloud":
      return CLOUD_EN_VERSIONS;
    case "tidb":
      return fetchTidbSearchIndcies(lang);
    default:
      return [];
  }
};

const fetchTidbSearchIndcies = (lang: string, lts = 1, dmr = 1) => {
  const tidbSearchIndices: string[] = [
    ...(lang === "en"
      ? TIDB_EN_SEARCH_INDEX_VERSION
      : TIDB_ZH_SEARCH_INDEX_VERSION),
  ];
  return tidbSearchIndices.sort().reverse();
};

function replaceStableVersion(match: string) {
  switch (match) {
    case "tidb":
      return TIDB_EN_STABLE_VERSION;
    case "tidb-in-kubernetes":
      return OP_EN_STABLE_VERSION;
    default:
      break;
  }
}

const docTypeListByLang = (lang: string) => {
  switch (lang) {
    case "zh":
      return ZH_DOC_TYPE_LIST;
    default:
      return EN_DOC_TYPE_LIST;
  }
};

const convertStableToRealVersion = (
  docType: string,
  docVersion: string
): string | undefined => {
  if (docType === "tidbcloud") return undefined;
  const realVersion =
    docVersion === "stable"
      ? replaceStableVersion(docType)?.replace("release-", "v")
      : docVersion?.replace("release-", "v");
  return realVersion;
};

const getSearchIndexVersion = (
  docType: string,
  docVersion: string,
  lang: string
) => {
  switch (docType) {
    case "tidb":
      const versions = fetchVersionListByDocType(docType, lang);
      let realVersion =
        docVersion === "stable" ? replaceStableVersion(docType) : docVersion;
      realVersion = realVersion?.replace("release-", "v");
      if (versions.includes(realVersion || "")) {
        return realVersion;
      }

      const latestVersion = versions[0];
      const stableVersion = TIDB_EN_STABLE_VERSION?.replace("release-", "v");
      return latestVersion || stableVersion;
    case "tidb-in-kubernetes":
      return OP_EN_STABLE_VERSION?.replace("release-", "v");
    default:
      return undefined;
  }
};

interface DocSearchTemplateProps {
  pageContext: {
    feature?: {
      banner?: boolean;
    };
  };
  data?: Record<string, any>;
}

export default function DocSearchTemplate({
  pageContext: { feature },
}: DocSearchTemplateProps) {
  const [docType, setDocType] = React.useState("");
  const [docVersion, setDocVersion] = React.useState("");
  const [docQuery, setDocQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<any[]>([]);

  const { language, navigate } = useI18next();
  const { search } = useLocation();

  useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const type = searchParams.get("type") || "";
    const version = searchParams.get("version") || "";
    const query = searchParams.get("q") || "";
    setDocType(type);
    setDocVersion(version);
    setDocQuery(query);

    execSearch(query, type, version);
  }, [search]);

  const realVersionMemo = React.useMemo(() => {
    return getSearchIndexVersion(docType, docVersion, language);
  }, [docType, docVersion]);

  const execSearch = (search: string, type: string, version: string) => {
    if (!search || !type) {
      return;
    }

    const realVersion = getSearchIndexVersion(type, version, language);
    const index = algoliaClient.initIndex(
      `${language}-${type}${realVersion ? `-${realVersion}` : ""}`
    );
    setIsLoading(true);

    index
      .search(search, {
        hitsPerPage: 150,
      })
      .then(({ hits }) => {
        setResults(hits);
        setIsLoading(false);
      })
      .catch((reason: any) => {
        console.error(reason);
        setResults([]);
        setIsLoading(false);
      });
  };

  const handleSelectDocType = (type: string) => {
    navigate(`/search/?type=${type}&q=${docQuery}`, {
      state: {
        type,
        version: "",
        query: docQuery,
      },
    });
  };

  const handleSelectDocVersion = (version: string) => {
    navigate(`/search/?type=${docType}&version=${version}&q=${docQuery}`, {
      state: {
        type: docType,
        version,
        query: docQuery,
      },
    });
  };

  const bannerVisible = feature?.banner && language !== Locale.ja;

  return (
    <>
      <Layout bannerEnabled={bannerVisible} namespace={TOCNamespace.Search}>
        <Container
          sx={{
            marginTop: getHeaderHeight(bannerVisible || false),
            minHeight: "calc(100vh - 30rem)",
            position: "relative",
          }}
        >
          <Seo lang={language as Locale} title="Search" noindex />
          <Stack
            spacing={2}
            sx={{
              paddingTop: "1rem",
            }}
          >
            <SearchInput
              disableExternalSearch
              disableResponsive
              docInfo={{
                type: docType,
                version: realVersionMemo || "stable",
              }}
            />
            <Box
              sx={{
                display: "flex",
                width: "100%",
                alignItems: "flex-start",
                gap: "1rem",
              }}
            >
              <Typography
                component="div"
                variant="h6"
                sx={{
                  width: "5rem",
                  minWidth: "5rem",
                  wordBreak: "keep-all",
                  paddingTop: "0.25rem",
                }}
              >
                <Trans i18nKey="search.type" />
              </Typography>
              <Stack direction="row" sx={{ flexWrap: "wrap", gap: "1rem" }}>
                {docTypeListByLang(language).map((type) => (
                  <Button
                    key={type.name}
                    variant="text"
                    size="small"
                    onClick={() => {
                      handleSelectDocType(
                        type.match as typeof EN_DOC_TYPE_LIST[number]["match"]
                      );
                    }}
                    sx={(theme) => ({
                      backgroundColor:
                        docType === type.match ? theme.palette.carbon[300] : "",
                    })}
                  >
                    {type.name}
                  </Button>
                ))}
              </Stack>
            </Box>
            {!!fetchVersionListByDocType(docType, language).length && (
              <Box
                sx={{
                  display: "flex",
                  width: "100%",
                  alignItems: "flex-start",
                  gap: "1rem",
                }}
              >
                <Typography
                  component="div"
                  variant="h6"
                  sx={{
                    width: "5rem",
                    minWidth: "5rem",
                    wordBreak: "keep-all",
                    paddingTop: "0.25rem",
                  }}
                >
                  <Trans i18nKey="search.version" />
                </Typography>
                <Stack direction="row" sx={{ flexWrap: "wrap", gap: "1rem" }}>
                  {fetchVersionListByDocType(docType, language).map(
                    (version) => {
                      return (
                        <Button
                          key={version}
                          size="small"
                          variant="text"
                          onClick={() => {
                            handleSelectDocVersion(version);
                          }}
                          sx={(theme) => ({
                            backgroundColor:
                              realVersionMemo ===
                              convertStableToRealVersion(docType, version)
                                ? theme.palette.carbon[300]
                                : "",
                          })}
                        >
                          {version === "stable"
                            ? convertStableToRealVersion(docType, version)
                            : version?.replace("release-", "v")}
                        </Button>
                      );
                    }
                  )}
                </Stack>
              </Box>
            )}
          </Stack>
          <Tip>
            <Trans i18nKey="search.searchTip" />
          </Tip>
          <SearchResults loading={isLoading} data={results} />
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
        </Container>
      </Layout>
    </>
  );
}

export const query = graphql`
  query ($language: String!) {
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
