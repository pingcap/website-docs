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

  const [queryStr, setQueryStr] = React.useState("");

  const { t, navigate } = useI18next();
  const theme = useTheme();
  const location = useLocation();

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setQueryStr(event.target.value);
  };

  const handleSearchSubmitCallback = React.useCallback(() => {
    navigate(
      `/search?type=${docInfo.type}&version=${
        docInfo.version
      }&q=${encodeURIComponent(queryStr)}`,
      {
        state: {
          type: docInfo.type,
          version: docInfo.version,
          query: queryStr,
        },
      }
    );
  }, [docInfo, queryStr]);

  React.useEffect(() => {
    const searchParams = new URLSearchParams(location.search);
    const query = searchParams.get("q") || "";
    setQueryStr(query);
  }, [location.search]);

  return (
    <Box>
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
          }}
          onSubmit={handleSearchSubmitCallback}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon fontSize="small" />
              </InputAdornment>
            ),
          }}
        />
      </Box>
    </Box>
  );
}
