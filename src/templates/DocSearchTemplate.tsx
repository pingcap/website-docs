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
import { SearchFilterBar } from "components/Search/Results";
import SearchInput from "components/Search";
import { Tip } from "components/MDXComponents";
import Seo from "components/Seo";
import { algoliaClient } from "shared/utils/algolia";
import { Locale, TOCNamespace } from "shared/interface";
import { FeedbackSurveyCampaign } from "components/Campaign/FeedbackSurvey";
import ScrollToTopBtn from "components/Button/ScrollToTopBtn";
import { useIsAutoTranslation } from "shared/useIsAutoTranslation";
import {
  resolveSearchCategory,
  type SearchCategory,
} from "shared/utils/searchCategory";

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
  const [activeFilter, setActiveFilter] =
    React.useState<SearchCategory | null>(null);

  const { language } = useI18next();
  const { search } = useLocation();

  const categoryCountMap = React.useMemo(() => {
    const map = new Map<SearchCategory, number>();
    for (const item of results) {
      const cat = resolveSearchCategory(item.url);
      if (cat) map.set(cat, (map.get(cat) || 0) + 1);
    }
    return map;
  }, [results]);

  const filteredResults = React.useMemo(() => {
    if (!activeFilter) return results;
    return results.filter(
      (item) => resolveSearchCategory(item.url) === activeFilter
    );
  }, [results, activeFilter]);

  const handleFilterChange = React.useCallback(
    (category: SearchCategory | null) => {
      setActiveFilter((prev) => (prev === category ? null : category));
    },
    []
  );

  const execSearch = React.useCallback(
    (query: string) => {
      const trimmedQuery = query.trim();
      if (!trimmedQuery) {
        setResults([]);
        setActiveFilter(null);
        setIsLoading(false);
        return;
      }

      const indexName = SEARCH_INDEX_BY_LANGUAGE[language as Locale];
      if (!indexName) {
        setResults([]);
        setActiveFilter(null);
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
          setActiveFilter(null);
          setIsLoading(false);
        })
        .catch((reason: any) => {
          console.error(reason);
          setResults([]);
          setActiveFilter(null);
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
      setActiveFilter(null);
      setIsLoading(false);
      return;
    }

    if (!query.trim()) {
      setResults([]);
      setActiveFilter(null);
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
          <SearchFilterBar
            categoryCountMap={categoryCountMap}
            activeFilter={activeFilter}
            onFilterChange={handleFilterChange}
            visible={!isLoading && results.length > 0}
          />
          <Tip>
            <Trans i18nKey="search.searchTip" />
          </Tip>
          <SearchResults
            loading={isLoading}
            data={filteredResults}
            onFilterChange={handleFilterChange}
          />
          <Box
            sx={{
              width: "fit-content",
              position: "fixed",
              bottom: "1rem",
              right: "1rem",
              zIndex: 10,
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-end",
              gap: "0.75rem",
            }}
          >
            <ScrollToTopBtn />
            <FeedbackSurveyCampaign />
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
