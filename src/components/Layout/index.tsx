import { ThemeProvider, styled, useTheme } from "@mui/material/styles";

import theme from "theme/index";
import Header from "components/Layout/Header";
import Footer from "components/Layout/Footer";

export default function Layout(props: { children?: React.ReactNode }) {
  return (
    <ThemeProvider theme={theme}>
      {/* <CustomCheckbox defaultChecked /> */}
      <Header />
      {props.children}
      <Footer />
    </ThemeProvider>
  );
}
