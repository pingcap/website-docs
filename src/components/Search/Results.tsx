import * as React from "react";
import { Trans, useI18next } from "gatsby-plugin-react-i18next";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Grid2 from "@mui/material/Unstable_Grid2"; // Grid version 2
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Skeleton from "@mui/material/Skeleton";
import clsx from "clsx";

export default function SearchResults(props: {
  loading: boolean;
  className?: string;
  data: any[];
}) {
  const { data, loading } = props;
  if (loading) {
    return (
      <Box
        sx={{
          padding: "2rem 0",
        }}
      >
        <Typography
          variant="body2"
          sx={{
            paddingBottom: "2rem",
            width: "10rem",
          }}
        >
          <Skeleton />
        </Typography>
        <Stack spacing={4}>
          <SearchItemSkeleton />
          <SearchItemSkeleton />
          <SearchItemSkeleton />
        </Stack>
      </Box>
    );
  }
  return (
    <Box
      sx={{
        padding: "2rem 0",
      }}
      className={clsx("algolia-autocomplete", props.className)}
    >
      <Typography
        variant="body2"
        sx={{
          paddingBottom: "2rem",
        }}
      >
        <Trans
          i18nKey="search.resultTips.counts"
          values={{ counts: data.length }}
        />
      </Typography>
      <Stack spacing={4}>
        {data.map((item) => (
          <SearchItem key={item.objectID} data={item} />
        ))}
      </Stack>
      {data.length === 0 && !loading && (
        <>
          <Typography>
            <Trans i18nKey="search.resultTips.title" />
          </Typography>
          <Typography component="ul">
            <Typography component="li">
              <Trans i18nKey="search.resultTips.content1" />
            </Typography>
            <Typography component="li">
              <Trans i18nKey="search.resultTips.content2" />
            </Typography>
          </Typography>
        </>
      )}
    </Box>
  );
}

function SearchItemSkeleton() {
  return (
    <Stack spacing={1}>
      <Typography
        variant="h5"
        sx={{
          width: "25%",
        }}
      >
        <Skeleton />
      </Typography>
      <Typography
        variant="body1"
        sx={{
          width: "75%",
        }}
      >
        <Skeleton />
      </Typography>

      <Typography component="div">
        <Skeleton />
      </Typography>
    </Stack>
  );
}

function SearchItem(props: { data: any }) {
  const { data } = props;
  return (
    <Stack spacing={1}>
      <Typography
        variant="h5"
        component="a"
        href={data.url}
        sx={{
          textDecoration: "none",
          width: "fit-content",
          "& >div": {
            width: "fit-content",
          },
        }}
      >
        <div
          dangerouslySetInnerHTML={{
            __html: data._highlightResult.hierarchy.lvl0?.value,
          }}
        />
      </Typography>
      {data?._highlightResult?.url ? (
        <Typography
          variant="body1"
          component="a"
          href={data.url}
          sx={{
            textDecoration: "none",
            width: "fit-content",
            "& >div": {
              width: "fit-content",
            },
          }}
        >
          <div
            dangerouslySetInnerHTML={{
              __html: data._highlightResult.url.value,
            }}
          />
        </Typography>
      ) : (
        <Typography
          sx={{
            textDecoration: "none",
            width: "fit-content",
          }}
        >
          {data.url}
        </Typography>
      )}
      <Typography component="div">
        <div
          dangerouslySetInnerHTML={{
            __html:
              data._highlightResult.content.value.length > 500
                ? data._snippetResult.content.value
                : data._highlightResult.content.value,
          }}
        ></div>
      </Typography>
    </Stack>
  );
}
