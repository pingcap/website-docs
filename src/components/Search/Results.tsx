import * as React from "react";
import { Trans, useI18next } from "gatsby-plugin-react-i18next";
import Box from "@mui/material/Box";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Skeleton from "@mui/material/Skeleton";
import clsx from "clsx";
import TablePagination from "@mui/material/TablePagination";
import Chip from "@mui/material/Chip";
import {
  getSearchCategoryLabelKey,
  resolveSearchCategory,
} from "shared/utils/searchCategory";

export default function SearchResults(props: {
  loading: boolean;
  className?: string;
  data: any[];
}) {
  const { data, loading } = props;

  const [page, setPage] = React.useState(0);
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const { t, language } = useI18next();

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

  const getHref = () => {
    switch (language) {
      case "zh":
        return "https://asktug.com/?utm_source=doc";
      case "en":
      case "ja":
      default:
        return "https://discord.gg/DQZ2dy3cuc?utm_source=doc";
    }
  };

  React.useEffect(() => {
    setPage(0);
  }, [data]);

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
          values={{ data.length }}
        />
      </Typography> */}
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
          <Typography
            component="ul"
            sx={{
              paddingTop: "1rem",
            }}
          >
            <Typography component="li">
              <Trans i18nKey="search.resultTips.content1" />
            </Typography>
            <Typography component="li">
              <Trans
                i18nKey="search.resultTips.content2"
                components={[
                  <Typography
                    component="a"
                    href={getHref()}
                    color="website.k1"
                    target="_blank"
                  />,
                ]}
              />
            </Typography>
          </Typography>
        </>
      )}
      {data?.length > 0 && (
        <Box mt={1}>
          <TablePagination
            component="div"
            count={data.length}
            page={page}
            onPageChange={handleChangePage}
            rowsPerPage={rowsPerPage}
            onRowsPerPageChange={handleChangeRowsPerPage}
          />
        </Box>
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
  const { t } = useI18next();
  const category = React.useMemo(
    () => resolveSearchCategory(data.url),
    [data.url]
  );
  const categoryLabel = category ? t(getSearchCategoryLabelKey(category)) : "";

  return (
    <Stack spacing={1}>
      <Box
        sx={{
          display: "flex",
          alignItems: "flex-start",
          flexWrap: "wrap",
          gap: "0.5rem",
        }}
      >
        <Typography
          variant="h5"
          component="a"
          href={data.url}
          sx={{
            textDecoration: "none",
            minWidth: 0,
            flex: "1 1 16rem",
            overflowWrap: "anywhere",
            "& >div": {
              width: "100%",
              maxWidth: "100%",
            },
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
        {!!category && !!categoryLabel && (
          <Chip
            size="small"
            variant="outlined"
            label={categoryLabel}
            sx={{
              height: "20px",
              fontSize: "12px",
              borderRadius: "10px",
              backgroundColor: "carbon.100",
              color: "carbon.800",
            }}
          />
        )}
      </Box>
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
      <Typography component="div" sx={{}}>
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
