import { Button, styled } from "@mui/material";

export const ThumbButton = styled(Button)(({ theme }) => ({
  fontSize: 12,
  fontWeight: 600,
  lineHeight: "20px",
  backgroundColor: theme.palette.website.k1,
  paddingLeft: 8,
  paddingRight: 8,
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
  fontSize: 12,
  fontWeight: 600,
  lineHeight: 1.5,
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
    fontSize: 14,
    color: "website.f1",
  },
};
