import { Button, styled } from "@mui/material";

export const ActionButton = styled(Button)(({ theme }) => ({
  backgroundColor: "#F9F9F9",
  borderColor: "#D9D9D9",
  color: theme.palette.text.primary,
  "&:hover": {
    backgroundColor: "#F9F9F9",
    borderColor: theme.palette.text.primary,
  },
  ".MuiButton-startIcon": {
    marginRight: 4,
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
    color: "website.f1",
  },
};
