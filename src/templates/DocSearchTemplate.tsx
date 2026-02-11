import * as React from "react";
import { graphql } from "gatsby";
import { Trans, useI18next } from "gatsby-plugin-react-i18next";
import { useLocation } from "@reach/router";

import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";

import "styles/algolia.css";
import "styles/docTemplate.css";

import Layout from "components/Layout";
import SearchResults from "components/Search/Results";
import SearchInput from "components/Search";
import { Tip } from "components/MDXComponents";
import Seo from "components/Seo";
import { algoliaClient } from "shared/utils/algolia";
import { Locale, TOCNamespace } from "shared/interface";
import { FeedbackSurveyCampaign } from "components/Campaign/FeedbackSurvey";
import { useIsAutoTranslation } from "shared/useIsAutoTranslation";

const SEARCH_INDEX_BY_LANGUAGE: Partial<Record<Locale, string>> = {
  [Locale.en]: "en-tidb-all-stable",
  [Locale.zh]: "zh-tidb-all-stable",
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
  const [isLoading, setIsLoading] = React.useState(false);
  const [results, setResults] = React.useState<any[]>([]);

  const { language } = useI18next();
  const { search } = useLocation();

  const execSearch = React.useCallback(
    (query: string) => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      const indexName = SEARCH_INDEX_BY_LANGUAGE[language as Locale];
      if (!indexName) {
        setResults([]);
        setIsLoading(false);
        return;
      }

      const index = algoliaClient.initIndex(indexName);
      setIsLoading(true);

      index
        .search(trimmedQuery, {
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
    },
    [language]
  );

  React.useEffect(() => {
    const searchParams = new URLSearchParams(search);
    const query = searchParams.get("q") || "";
    if (language === Locale.ja) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    if (!query.trim()) {
      setResults([]);
      setIsLoading(false);
      return;
    }

    execSearch(query);
  }, [search, execSearch]);

  const isAutoTranslation = useIsAutoTranslation(TOCNamespace.Search);
  const bannerVisible =
    isAutoTranslation || (feature?.banner && language !== Locale.ja);

  return (
    <>
      <Layout bannerEnabled={bannerVisible} namespace={TOCNamespace.Search}>
        <Container
          sx={{
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
                type: "",
                version: "",
              }}
            />
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
