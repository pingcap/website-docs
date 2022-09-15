import * as React from "react";
import { graphql, Link } from "gatsby";
import { Trans, useI18next } from "gatsby-plugin-react-i18next";
import { useLocation } from "@reach/router";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";

import "styles/algolia.css";
import "styles/docTemplate.css";

import Layout from "components/Layout";
import SearchResults from "components/Search/Results";
import SearchInput from "components/Search";
import Seo from "components/Layout/Seo";
import { algoliaClient } from "utils/algolia";
import {
  TIDB_EN_STABLE_VERSION,
  DM_EN_STABLE_VERSION,
  OP_EN_STABLE_VERSION,
  TIDB_EN_VERSIONS,
  DM_EN_VERSIONS,
  OP_EN_VERSIONS,
  CLOUD_EN_VERSIONS,
  EN_DOC_TYPE_LIST,
  ZH_DOC_TYPE_LIST,
} from "static";

const fetchVersionListByDocType = (docType: string) => {
  switch (docType) {
    case "tidb-data-migration":
      return DM_EN_VERSIONS;
    case "tidb-in-kubernetes":
      return OP_EN_VERSIONS;
    case "tidbcloud":
      return CLOUD_EN_VERSIONS;
    case "tidb":
    default:
      return TIDB_EN_VERSIONS;
  }
};

function replaceStableVersion(match: string) {
  switch (match) {
    case "tidb":
      return TIDB_EN_STABLE_VERSION;
    // case "tidb-data-migration":
    //   return DM_EN_STABLE_VERSION;
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
      : docVersion;
  return realVersion;
};

export default function DocSearchTemplate() {
  const [docType, setDocType] = React.useState("");
  const [docVersion, setDocVersion] = React.useState("");
  const [docQuery, setDocQuery] = React.useState("");
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<any[]>([]);
  const [searched, setSearched] = React.useState(false);

  const { language } = useI18next();
  const location = useLocation();

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const type = searchParams.get("type") || "";
    const version = searchParams.get("version") || "";
    const query = searchParams.get("q") || "";
    setDocType(type);
    setDocVersion(version);
    setDocQuery(query);
  }, [location.search]);

  React.useEffect(() => {
    if (docType && docQuery) {
      execSearch();
    }
  }, [docType, docVersion, docQuery]);

  const execSearch = () => {
    const realVersion = convertStableToRealVersion(docType, docVersion);
    const index = algoliaClient.initIndex(
      `${language}-${docType}${realVersion ? `-${realVersion}` : ""}`
    );
    setIsLoading(true);

    index
      .search(docQuery, {
        hitsPerPage: 150,
      })
      .then(({ hits }) => {
        setResults(hits);
        setSearched(true);
        setIsLoading(false);
      })
      .catch((reason: any) => {
        console.error(reason);
        setResults([]);
        setSearched(true);
        setIsLoading(false);
      });
  };

  const handleSelectDocType = (
    selected: typeof EN_DOC_TYPE_LIST[number]["match"]
  ) => {
    setDocType(selected);
  };

  return (
    <>
      <Layout>
        <Container
          sx={{
            marginTop: "5rem",
            minHeight: "calc(100vh - 30rem)",
          }}
        >
          <Seo title="Search" noindex />
          <Stack
            spacing={2}
            sx={{
              paddingTop: "1rem",
            }}
          >
            <SearchInput
              disableResponsive
              docInfo={{
                type: docType,
                version: docVersion,
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
                    sx={{
                      backgroundColor: docType === type.match ? "#EAF6FB" : "",
                    }}
                  >
                    {type.name}
                  </Button>
                ))}
              </Stack>
            </Box>
            {!!fetchVersionListByDocType(docType).length && (
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
                  {fetchVersionListByDocType(docType).map((version) => {
                    return (
                      <Button
                        key={version}
                        size="small"
                        variant="text"
                        onClick={() => {
                          setDocVersion(version);
                        }}
                        sx={{
                          backgroundColor:
                            docVersion === version ? "#EAF6FB" : "",
                        }}
                      >
                        {version === "stable"
                          ? convertStableToRealVersion(docType, version)
                          : version}
                      </Button>
                    );
                  })}
                </Stack>
              </Box>
            )}
          </Stack>
          <SearchResults loading={isLoading} data={results} />
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
