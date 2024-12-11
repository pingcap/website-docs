import * as React from "react";
import { useI18next } from "gatsby-plugin-react-i18next";
import { useLocation } from "@reach/router";
import Box from "@mui/material/Box";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";

import SearchIcon from "@mui/icons-material/Search";
import { Card, MenuItem, Popper, PopperProps } from "@mui/material";
import { Locale } from "shared/interface";
import { GTMEvent, gtmTrack } from "shared/utils/gtm";

const StyledTextField = styled((props: TextFieldProps) => (
  <TextField {...props} />
))(({ theme }) => ({
  "& .MuiOutlinedInput-root": {
    background: theme.palette.background.paper,
    height: "32px",
    fontSize: "14px",
    "&:hover fieldset": {
      borderColor: theme.palette.text.secondary,
      borderWidth: "1px",
    },
    "&.Mui-focused fieldset": {
      borderColor: theme.palette.text.primary,
      borderWidth: "1px",
    },
  },
}));

const SEARCH_WIDTH = 251;

enum SearchType {
  Onsite = "onsite",
  Google = "google",
  Bing = "bing",
}

export default function Search(props: {
  placeholder?: string;
  disableResponsive?: boolean;
  disableExternalSearch?: boolean;
  docInfo: { type: string; version: string };
}) {
  const { placeholder, disableResponsive, docInfo, disableExternalSearch } =
    props;

  const anchorEl = React.useRef<HTMLDivElement>(null);
  const inputEl = React.useRef<HTMLInputElement>(null);
  const [queryStr, setQueryStr] = React.useState("");
  const [isFocus, setIsFocus] = React.useState(false);
  const [popperItemIndex, setPopperItemIndex] = React.useState(0);
  const searchTypeRef = React.useRef<string>(SearchType.Onsite);

  const { t, navigate, language } = useI18next();
  const location = useLocation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryStr(event.target.value);
  };

  const handleSearchSubmitCallback = (query: string, forceType?: string) => {
    const searchType = forceType || searchTypeRef.current;
    const q = encodeURIComponent(query);

    inputEl.current?.blur();

    if (searchType === SearchType.Onsite) {
      gtmTrack(GTMEvent.UseOnsiteSearch);
      navigate(
        `/search?type=${docInfo.type}&version=${docInfo.version}&q=${q}`,
        {
          state: {
            type: docInfo.type,
            version: docInfo.version,
            query: query,
          },
        }
      );
      return;
    }

    const segmentPath = `${language === Locale.en ? "" : `${language}/`}${
      docInfo.type
    }`;

    if (searchType === SearchType.Google) {
      gtmTrack(GTMEvent.UseExternalSearch, {
        search_type: searchType,
      });
      window.open(
        `https://www.google.com/search?q=site%3Adocs.pingcap.com/${segmentPath}+${q}`,
        "_blank"
      );
      return;
    }

    if (searchType === SearchType.Bing) {
      gtmTrack(GTMEvent.UseExternalSearch, {
        search_type: searchType,
      });
      window.open(
        `https://cn.bing.com/search?q=site%3Adocs.pingcap.com/${segmentPath}+${q}`,
        "_blank"
      );
      return;
    }
  };

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q") || "";
    setQueryStr(query);
  }, [location.search]);

  return (
    <>
      <Box ref={anchorEl}>
        {!disableResponsive && (
          <IconButton
            sx={{
              display: {
                lg: "none",
              },
            }}
            onClick={() => handleSearchSubmitCallback(queryStr)}
          >
            <SearchIcon />
          </IconButton>
        )}
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{
            width: SEARCH_WIDTH,
            display: {
              xs: disableResponsive ? "block" : "none",
              lg: "block",
            },
          }}
        >
          <StyledTextField
            inputRef={inputEl}
            size="small"
            id="doc-search"
            fullWidth
            placeholder={t("navbar.searchDocs") || placeholder}
            type="search"
            variant="outlined"
            value={queryStr}
            onChange={handleChange}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                handleSearchSubmitCallback(queryStr);
              }
              if (e.key === "ArrowUp") {
                e.preventDefault();
                setPopperItemIndex((i) => --i);
              }
              if (e.key === "ArrowDown") {
                e.preventDefault();
                setPopperItemIndex((i) => ++i);
              }
            }}
            onSubmit={() => handleSearchSubmitCallback(queryStr)}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon fontSize="small" />
                </InputAdornment>
              ),
            }}
            onFocus={() => setIsFocus(true)}
            onBlur={() => setTimeout(() => setIsFocus(false), 100)}
          />
        </Box>
      </Box>
      <SearchPopper
        open={!!queryStr && isFocus && !disableExternalSearch}
        query={queryStr}
        anchorEl={anchorEl.current}
        popperItemIndex={popperItemIndex}
        onUpdateIndex={setPopperItemIndex}
        onUpdateSearchType={(type) => (searchTypeRef.current = type)}
        onClickItem={handleSearchSubmitCallback}
      />
    </>
  );
}

interface SearchPopperItemProps {
  type: SearchType;
  component: (props: {
    selected: boolean;
    query: string;
  }) => React.ReactElement;
}

const SearchPopper = ({
  open,
  anchorEl,
  popperItemIndex,
  query,
  onUpdateIndex,
  onUpdateSearchType,
  onClickItem,
}: PopperProps & {
  query: string;
  popperItemIndex: number;
  onUpdateIndex: (index: number) => void;
  onUpdateSearchType: (type: SearchType) => void;
  onClickItem: (query: string, type: SearchType) => void;
}) => {
  const { t, language } = useI18next();
  const items: SearchPopperItemProps[] = React.useMemo(
    () =>
      (
        [
          {
            type: SearchType.Onsite,
            component: ({ selected, query }) => (
              <SearchPopperMenuItem
                name={t("navbar.onsiteSearch")}
                selected={selected}
                query={query}
                onClick={() => onClickItem(query, SearchType.Onsite)}
              />
            ),
          },
          {
            type: SearchType.Google,
            component: ({ selected, query }) => (
              <SearchPopperMenuItem
                name={t("navbar.googleSearch")}
                selected={selected}
                query={query}
                onClick={() => onClickItem(query, SearchType.Google)}
              />
            ),
          },
          {
            type: SearchType.Bing,
            component: ({ selected, query }) => (
              <SearchPopperMenuItem
                name={t("navbar.bingSearch")}
                selected={selected}
                query={query}
                onClick={() => onClickItem(query, SearchType.Bing)}
              />
            ),
          },
        ] as SearchPopperItemProps[]
      ).filter((item) =>
        language === Locale.zh
          ? item.type !== SearchType.Google
          : item.type !== SearchType.Bing
      ),
    []
  );
  const currentIndex =
    (popperItemIndex < 0 ? items.length - popperItemIndex : popperItemIndex) %
    items.length;

  React.useEffect(() => {
    onUpdateSearchType(items[currentIndex].type);
  }, [currentIndex]);

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      sx={{ zIndex: 99 }}
      modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
    >
      <Card
        sx={{
          width: SEARCH_WIDTH,
          wordBreak: "break-all",
          padding: "8px",
          boxSizing: "border-box",
        }}
      >
        {items.map((item, index) => (
          <Box onMouseEnter={() => onUpdateIndex(index)} key={item.type}>
            <item.component query={query} selected={currentIndex === index} />
          </Box>
        ))}
      </Card>
    </Popper>
  );
};

const SearchPopperMenuItem = ({
  name,
  selected,
  query,
  onClick,
}: {
  name: string;
  selected: boolean;
  query: string;
  onClick: () => void;
}) => {
  return (
    <MenuItem
      selected={selected}
      onClick={onClick}
      sx={{
        textWrap: "auto",
        padding: "6px 10px",
      }}
    >
      <span>
        <span
          style={{
            fontSize: "14px",
            paddingRight: "6px",
            color: "#807c7c",
          }}
        >
          {name}:
        </span>
        <span>{query}</span>
      </span>
    </MenuItem>
  );
};
