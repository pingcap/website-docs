import * as React from "react";
import { Trans, useI18next } from "gatsby-plugin-react-i18next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import clsx from "clsx";
import TablePagination from "@mui/material/TablePagination";

import LinkComponent from "components/Link";

export default function SearchResults(props: {
  loading: boolean;
  className?: string;
  data: any[];
}) {
  const { data, loading } = props;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);

  const filteredDataMemo = React.useMemo(() => {
    return data.slice(page * rowsPerPage, page * rowsPerPage + rowsPerPage);
  }, [data, page, rowsPerPage]);

  const handleChangePage = (
    event: React.MouseEvent<HTMLButtonElement> | null,
    newPage: number
  ) => {
    setPage(newPage);
  };

  const handleChangeRowsPerPage = (
    event: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>
  ) => {
    setRowsPerPage(parseInt(event.target.value, 10));
    setPage(0);
  };

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
      {/* <Typography
        variant="body2"
        sx={{
          paddingBottom: "2rem",
        }}
      >
        <Trans
          i18nKey="search.resultTips.counts"
          values={{ counts: totalHits || data.length }}
        />
      </Typography> */}
      {data?.length > 0 && (
        <>
          <TablePagination
            component="div"
            count={data.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </>
      )}

      <Stack spacing={4}>
        {filteredDataMemo.map((item) => (
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
              <Trans
                i18nKey="search.resultTips.content1"
                components={[
                  <Typography
                    component="a"
                    href="https://asktug.com/?utm_source=doc"
                    color="website.k1"
                    target="_blank"
                  />,
                ]}
              />
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
          fontFamily: `-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"`,
        }}
      >
        {!!data._highlightResult?.hierarchy?.lvl0 && (
          <div
            dangerouslySetInnerHTML={{
              __html: data._highlightResult.hierarchy.lvl0?.value,
            }}
          />
        )}
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
            fontFamily: `-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"`,
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
            fontFamily: `-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"`,
          }}
        >
          {data.url}
        </Typography>
      )}
      <Typography
        component="div"
        sx={{
          fontFamily: `-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"`,
        }}
      >
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
