import * as React from "react";
import { useI18next } from "gatsby-plugin-react-i18next";
import { useLocation } from "@reach/router";
import Box from "@mui/material/Box";
import { useTheme } from "@mui/material/styles";
import TextField, { TextFieldProps } from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { styled } from "@mui/material/styles";

import SearchIcon from "@mui/icons-material/Search";
import { Card, Menu, MenuItem, Popper, PopperProps } from "@mui/material";
import { Locale } from "shared/interface";

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

export default function Search(props: {
  placeholder?: string;
  disableResponsive?: boolean;
  docInfo: { type: string; version: string };
}) {
  const { placeholder, disableResponsive, docInfo } = props;

  const anchorEl = React.useRef(null);
  const [queryStr, setQueryStr] = React.useState("");
  const [isFocus, setIsFocus] = React.useState(false);
  const [popperItemIndex, setPopperItemIndex] = React.useState(0);

  const { t, navigate, language } = useI18next();
  const theme = useTheme();
  const location = useLocation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryStr(event.target.value);
  };

  const handleSearchSubmitCallback = (forceKey?: string) => {
    const key = forceKey || items[popperItemIndex].key;
    const q = encodeURIComponent(queryStr);
    if (key === "onsite") {
      navigate(
        `/search?type=${docInfo.type}&version=${docInfo.version}&q=${q}`,
        {
          state: {
            type: docInfo.type,
            version: docInfo.version,
            query: queryStr,
          },
        }
      );
      return;
    }
    if (key === "google") {
      window.open(
        `https://www.google.com/search?q=site%3Adocs.pingcap.com+${q}`,
        "_blank"
      );
    }
    if (key === "bing") {
      window.open(
        `https://cn.bing.com/search?q=site%3Adocs.pingcap.com+${q}`,
        "_blank"
      );
    }
  };

  const items: SearchPopperItem[] = React.useMemo(
    () =>
      (
        [
          {
            key: "onsite",
            component: ({ selected, query }) => (
              <MenuItem
                selected={selected}
                onClick={() => handleSearchSubmitCallback("onsite")}
                sx={{ textWrap: "auto" }}
              >
                {t("navbar.onsiteSearch")}: {query}
              </MenuItem>
            ),
          },
          {
            key: "google",
            component: ({ selected, query }) => (
              <MenuItem
                selected={selected}
                onClick={() => handleSearchSubmitCallback("google")}
                sx={{ textWrap: "auto" }}
              >
                Google: {query}
              </MenuItem>
            ),
          },
          {
            key: "bing",
            component: ({ selected, query }) => (
              <MenuItem
                selected={selected}
                onClick={() => handleSearchSubmitCallback("bing")}
                sx={{ textWrap: "auto" }}
              >
                Bing 搜索: {query}
              </MenuItem>
            ),
          },
        ] as SearchPopperItem[]
      ).filter((item) =>
        language === Locale.zh ? item.key !== "google" : item.key !== "bing"
      ),
    []
  );

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
            onClick={handleSearchSubmitCallback}
          >
            <SearchIcon />
          </IconButton>
        )}
        <Box
          component="form"
          noValidate
          autoComplete="off"
          sx={{
            width: "251px",
            display: {
              xs: disableResponsive ? "block" : "none",
              lg: "block",
            },
          }}
        >
          <StyledTextField
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
                handleSearchSubmitCallback();
              }
              if (e.key === "ArrowUp") {
                setPopperItemIndex((i) =>
                  i - 1 < 0 ? items.length - 1 : i - 1
                );
              }
              if (e.key === "ArrowDown") {
                setPopperItemIndex((i) => (i + 1) % items.length);
              }
            }}
            onSubmit={handleSearchSubmitCallback}
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
        open={!!queryStr && isFocus}
        query={queryStr}
        anchorEl={anchorEl.current}
        popperItemIndex={popperItemIndex}
        items={items}
      />
    </>
  );
}

interface SearchPopperItem {
  key: string;
  component: (props: {
    selected: boolean;
    query: string;
  }) => React.ReactElement;
}

const SearchPopper = ({
  open,
  anchorEl,
  popperItemIndex,
  items,
  query,
}: PopperProps & {
  query: string;
  items: SearchPopperItem[];
  popperItemIndex: number;
}) => {
  const { t } = useI18next();

  return (
    <Popper
      open={open}
      anchorEl={anchorEl}
      sx={{ zIndex: 99 }}
      modifiers={[{ name: "offset", options: { offset: [0, 8] } }]}
    >
      <Card sx={{ width: 251, wordBreak: "break-all" }}>
        {items.map((item, index) => (
          <item.component query={query} selected={popperItemIndex === index} />
        ))}
      </Card>
    </Popper>
  );
};
