import * as React from "react";
import { createTheme, ThemeOptions } from "@mui/material/styles";
import { ColorPartial } from "@mui/material/styles/createPalette";
import { treeItemClasses } from "@mui/lab/TreeItem";

declare module "@mui/material/styles" {
  interface Theme {
    status: {
      success: string;
      error: string;
      warning: string;
      minor: string;
    };
  }
  interface ThemeOptions {
    status?: {
      success?: string;
      error?: string;
      warning?: string;
      minor?: string;
    };
  }
  interface Palette {
    carbon: ColorPartial;
    peacock: ColorPartial;
    website: {
      m1: string;
      m2: string;
      m3: string;
      m4: string;
      m5: string;
      k1: string;
      k2: string;
      k3: string;
      f1: string;
      f2: string;
      f3: string;
      f4: string;
    };
  }
  interface PaletteOptions {
    carbon?: ColorPartial;
    peacock?: ColorPartial;
    website?: {
      m1?: string;
      m2?: string;
      m3?: string;
      m4?: string;
      m5?: string;
      k1?: string;
      k2?: string;
      k3?: string;
      f1?: string;
      f2?: string;
      f3?: string;
      f4?: string;
    };
  }
}

let theme = createTheme({
  breakpoints: {
    values: {
      xs: 0,
      sm: 600,
      md: 900,
      lg: 1200,
      xl: 1440,
    },
  },
  status: {
    success: "#52cc7a",
    error: "#e65c5c",
    warning: "#f2b600",
    minor: "#e6742e",
  },
  palette: {
    website: {
      m1: "#fff",
      m2: "#f9f9f9",
      m3: "#f4f4f4",
      m4: "#e5e5e5",
      m5: "#282a36",
      k1: "#0ca6f2",
      k2: "#172d72",
      k3: "#3a40e1",
      f1: "#282a36",
      f2: "#666666",
      f3: "#999999",
      f4: "#cccccc",
    },
  },
  typography: {
    button: {
      textTransform: "none",
    },
    fontFamily: [
      "moderat",
      "-apple-system",
      '"Poppins"',
      '"Helvetica Neue"',
      "sans-serif",
      '"Noto Sans"',
      '"Fira Code"',
      '"IBM Plex Sans"',
      '"sans-serif"',
    ].join(","),
    h1: {
      fontSize: "2.5rem",
      fontWeight: "400",
      fontStyle: "normal",
      lineHeight: "3.75rem",
      color: "var(--tiui-palette-carbon-900)",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: "500",
      fontStyle: "normal",
      lineHeight: "3rem",
      color: "var(--tiui-palette-carbon-900)",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: "500",
      fontStyle: "normal",
      lineHeight: "2.625rem",
      color: "var(--tiui-palette-carbon-900)",
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: "500",
      fontStyle: "normal",
      lineHeight: "1.875rem",
      color: "var(--tiui-palette-carbon-900)",
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: "500",
      fontStyle: "normal",
      lineHeight: "1.6875rem",
      color: "var(--tiui-palette-carbon-900)",
    },
    h6: {
      fontSize: "0.875rem",
      fontWeight: "500",
      fontStyle: "normal",
      lineHeight: "1.5rem",
      color: "var(--tiui-palette-carbon-900)",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: "1.5rem",
      fontWeight: "400",
      fontStyle: "normal",
      color: "var(--tiui-palette-carbon-900)",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      fontWeight: "400",
      fontStyle: "normal",
      color: "var(--tiui-palette-carbon-900)",
    },
  },
});

theme = createTheme(theme, {
  palette: {
    carbon: theme.palette.augmentColor({
      color: {
        50: "#FFFFFF",
        100: "#FDFEFF",
        200: "#F9FAFB",
        300: "#EDF1F2",
        400: "#DCE3E5",
        500: "#C4CDD0",
        600: "#9FA9AD",
        700: "#6F787B",
        800: "#383E40",
        900: "#1E2426",
      },
      name: "carbon",
    }),
    peacock: theme.palette.augmentColor({
      color: {
        50: "#FBFDFE",
        100: "#F4FAFD",
        200: "#EAF5FA",
        300: "#E0F0F8",
        400: "#C0E1F1",
        500: "#96CDE9",
        600: "#6CBAE0",
        700: "#2D9CD2",
        800: "#1480B8",
        900: "#0B628D",
      },
      name: "peacock",
    }),
    aqua: theme.palette.augmentColor({
      color: {
        50: "#FBFEFE",
        100: "#F5FCFC",
        200: "#ECF9F9",
        300: "#E2F5F5",
        400: "#C6ECEC",
        500: "#9FDFDF",
        600: "#79D2D2",
        700: "#40BFBF",
        800: "#29A3A3",
        900: "#24868F",
      },
      name: "aqua",
    }),
  },
} as ThemeOptions);

theme = createTheme(theme, {
  palette: {
    primary: {
      main: "#DC150B",
      light: "#DC150B",
      dark: "#d0140b",
    },
    secondary: {
      main: theme.palette.peacock[800],
      light: theme.palette.peacock[700],
      dark: theme.palette.peacock[900],
    },
    text: {
      primary: theme.palette.carbon[900],
      secondary: theme.palette.carbon[800],
      disabled: theme.palette.carbon[600],
    },
  },
} as ThemeOptions);

theme = createTheme(theme, {
  shape: {
    borderRadius: 0,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
        disableRipple: true,
      },
      styleOverrides: {
        sizeMedium: {
          height: "32px",
        },
        sizeLarge: {
          height: "40px",
          fontSize: "16px",
        },
        root: ({ ownerState }) => ({
          ".MuiButton-startIcon": {
            marginLeft: "0",
          },
          ".MuiButton-endIcon": {
            marginRight: "0",
          },
          ...(ownerState.variant === "text" && {
            color: theme.palette.text.primary,
            "&:hover": {
              backgroundColor: theme.palette.carbon[300],
            },
          }),
          ...(ownerState.variant === "outlined" &&
            ownerState.color === "secondary" && {
              color: theme.palette.text.primary,
              borderColor: "#C4CDD0",
              backgroundColor: "#F9FAFB",
              "&:hover": {
                borderColor: "#262A2C",
                backgroundColor: "#F9FAFB",
              },
            }),
          ...(ownerState.variant === "contained" &&
            ownerState.color === "secondary" && {
              color: theme.palette.carbon[50],
              backgroundColor: theme.palette.carbon[900],
              "&:hover": {
                backgroundColor: theme.palette.carbon[800],
              },
            }),
        }),
      },
    },
    MuiMenuItem: {
      styleOverrides: {
        root: {
          "&.Mui-selected": {
            backgroundColor: theme.palette.carbon[300],
            "&:hover": {
              backgroundColor: theme.palette.carbon[300],
            },
          },
          "&:hover": {
            backgroundColor: theme.palette.carbon[300],
          },
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          "&.Mui-focused .MuiOutlinedInput-notchedOutline": {
            borderColor: theme.palette.text.primary,
            borderWidth: "1px",
          },
        },
      },
    },
    MuiTreeItem: {
      styleOverrides: {
        root: {
          marginTop: "4px",
          marginBottom: "4px",
          [`& .${treeItemClasses.content}`]: {
            "&:hover": {
              backgroundColor: theme.palette.carbon[300],
            },
            "&.Mui-focused": {
              backgroundColor: "#fff",
              "&:hover": {
                backgroundColor: theme.palette.carbon[300],
              },
            },
            "&.Mui-selected, &.Mui-selected.Mui-focused, &.Mui-selected:hover":
              {
                backgroundColor: theme.palette.carbon[300],
                color: theme.palette.secondary.main,
                [`& svg.MuiTreeItem-ChevronRightIcon`]: {
                  fill: theme.palette.carbon[700],
                },
              },
            [`& .${treeItemClasses.iconContainer}`]: {
              display: "none",
            },
          },
          [`& .${treeItemClasses.group}`]: {
            marginLeft: 0,
          },
        },
      },
    },
  },
} as ThemeOptions);

export default theme;
