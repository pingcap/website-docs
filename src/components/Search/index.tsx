import * as React from "react";
import { useI18next } from "gatsby-plugin-react-i18next";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Stack from "@mui/material/Stack";
import { useTheme } from "@mui/material/styles";
import Button from "@mui/material/Button";
import Menu, { MenuProps } from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";

import SearchIcon from "@mui/icons-material/Search";

import LinkComponent from "components/Link";
import { generateDownloadURL, generateContactURL } from "utils";

import { Locale } from "static/Type";

export default function Search(props: {
  placeholder?: string;
  disableResponsive?: boolean;
  docInfo: { type: string; version: string };
}) {
  const { placeholder, disableResponsive, docInfo } = props;

  const [queryStr, setQueryStr] = React.useState("");

  const { t, navigate } = useI18next();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryStr(event.target.value);
  };

  const handleSearchSubmitCallback = React.useCallback(() => {
    console.log("====test===");
    navigate(
      `/search?type=${docInfo.type}&version=${docInfo.version}&q=${queryStr}`,
      {
        state: {
          type: docInfo.type,
          version: docInfo.version,
          query: queryStr,
        },
      }
    );
  }, [docInfo, queryStr]);

  return (
    <>
      {!disableResponsive && (
        <IconButton
          sx={{
            display: {
              lg: "none",
            },
          }}
        >
          <SearchIcon />
        </IconButton>
      )}
      <Box
        component="form"
        noValidate
        autoComplete="off"
        sx={{
          maxWidth: "13rem",
          display: {
            xs: disableResponsive ? "block" : "none",
            lg: "block",
          },
        }}
      >
        <TextField
          size="small"
          id="doc-search"
          fullWidth
          placeholder={t("navbar.searchDocs") || placeholder}
          type="search"
          variant="outlined"
          onChange={handleChange}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              e.preventDefault();
              handleSearchSubmitCallback();
            }
          }}
          onSubmit={handleSearchSubmitCallback}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </>
  );
}
