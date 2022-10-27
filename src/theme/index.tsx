import * as React from "react";
import { createTheme } from "@mui/material/styles";

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

const theme = createTheme({
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
      fontWeight: "600",
      fontStyle: "normal",
      fontFamily: '"Poppins"',
      lineHeight: "3.75rem",
      color: "#666666",
    },
    h2: {
      fontSize: "2rem",
      fontWeight: "600",
      fontStyle: "normal",
      fontFamily: '"Poppins"',
      lineHeight: "3rem",
      color: "#666666",
    },
    h3: {
      fontSize: "1.75rem",
      fontWeight: "600",
      fontStyle: "normal",
      fontFamily: '"Poppins"',
      lineHeight: "2.625rem",
      color: "#666666",
    },
    h4: {
      fontSize: "1.25rem",
      fontWeight: "600",
      fontStyle: "normal",
      fontFamily: '"Poppins"',
      lineHeight: "1.875rem",
      color: "#666666",
    },
    h5: {
      fontSize: "1.125rem",
      fontWeight: "600",
      fontStyle: "normal",
      fontFamily: '"Poppins"',
      lineHeight: "1.6875rem",
      color: "#666666",
    },
    h6: {
      fontSize: "0.875rem",
      fontWeight: "600",
      fontStyle: "normal",
      fontFamily: '"Poppins"',
      lineHeight: "1.5rem",
      color: "#666666",
    },
    body1: {
      fontSize: "1rem",
      lineHeight: "1.5rem",
      fontFamily: '"Helvetica Neue", "sans-serif"',
      fontWeight: "400",
      fontStyle: "normal",
      color: "#666666",
    },
    body2: {
      fontSize: "0.875rem",
      lineHeight: "1.25rem",
      fontFamily: '"Helvetica Neue", "sans-serif"',
      fontWeight: "400",
      fontStyle: "normal",
      color: "#666666",
    },
  },
});

export default theme;

// export default function CustomStyles() {
//   return (
//     <ThemeProvider theme={theme}>
//       <CustomCheckbox defaultChecked />
//     </ThemeProvider>
//   );
// }
