import { Button, styled } from "@mui/material";

export const ThumbButton = styled(Button)(({ theme }) => ({
  backgroundColor: theme.palette.website.k1,
  boxShadow: "none",
  "&:hover": {
    backgroundColor: "#0A85C2",
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.16)",
  },
  ".MuiButton-startIcon": {
    marginRight: 4,
  },
}));

export const ActionButton = styled(Button)(({ theme }) => ({
  color: theme.palette.website.f1,
  backgroundColor: "#F9F9F9",
  border: "1px solid #E6E6E6",
  padding: "4px 8px",
  "&:hover": {
    backgroundColor: "#F9F9F9",
    border: "1px solid #E6E6E6",
    boxShadow: "0px 1px 4px rgba(0, 0, 0, 0.08)",
  },
}));

export const typoFontFamily = `-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"`

export const controlLabelSx = {
  ml: 0,
  py: "6px",
};
export const radioSx = {
  color: "#BBBBBB",
  p: "2px",
  mr: "8px",
  "&.Mui-checked": {
    color: "website.k1",
  },
};
export const labelProps = {
  typography: {
    fontFamily: typoFontFamily,
    color: "website.f1",
  },
};
