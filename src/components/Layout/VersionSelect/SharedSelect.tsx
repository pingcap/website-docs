import { Box, Button, MenuProps } from "@mui/material";
import { Menu } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";

import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import { forwardRef } from "react";

export const VersionSelectButton = forwardRef(
  (
    {
      open,
      handleClick,
      children,
    }: React.PropsWithChildren<{
      open: boolean;
      handleClick: () => void;
    }>,
    ref
  ) => {
    return (
      <Box
        sx={{
          position: "sticky",
          top: "-20px",
          backgroundColor: "#fff",
          marginTop: "-20px",
          marginLeft: "-16px",
          marginRight: "-16px",
          paddingTop: "20px",
          paddingLeft: "16px",
          paddingRight: "16px",
          zIndex: 1000,
        }}
      >
        <Button
          ref={ref as React.RefObject<HTMLButtonElement>}
          sx={{
            width: "100%",
            height: "40px",
            justifyContent: "space-between",
            borderStyle: "solid",
            borderWidth: "2px",
            marginBottom: "1rem",
            borderColor: open ? "#1E2426" : "#DCE3E5",
            "&:hover": {
              borderColor: "#9FA9AD",
              backgroundColor: "#fff",
            },
          }}
          id="version-select-button"
          aria-controls={open ? "verison-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          onClick={handleClick}
          endIcon={
            <ChevronRightIcon
              sx={(theme) => ({
                transform: open ? "rotate(90deg)" : "rotate(0deg)",
                height: "16px",
                width: "16px",
                fill: theme.palette.website.f3,
                marginRight: "0.25rem",
              })}
            />
          }
        >
          {children}
        </Button>
      </Box>
    );
  }
);

export const VersionSelectMenu = styled((props: MenuProps) => (
  <Menu
    elevation={0}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "right",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "right",
    }}
    {...props}
  />
))(({ theme }) => ({
  "& .MuiPaper-root": {
    marginTop: theme.spacing(1),
    minWidth: 268,
    color:
      theme.palette.mode === "light"
        ? "rgb(55, 65, 81)"
        : theme.palette.grey[300],
    boxShadow:
      "rgb(255, 255, 255) 0px 0px 0px 0px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px, rgba(0, 0, 0, 0.1) 0px 10px 15px -3px, rgba(0, 0, 0, 0.05) 0px 4px 6px -2px",
    "& .MuiMenu-list": {
      padding: "8px",
    },
    "& .MuiMenuItem-root": {
      height: "40px",
      padding: "10px 12px",
      justifyContent: "space-between",
      "& .MuiSvgIcon-root": {
        fontSize: 18,
      },
      "&:active": {
        backgroundColor: alpha(
          theme.palette.primary.main,
          theme.palette.action.selectedOpacity
        ),
      },
    },
  },
}));
