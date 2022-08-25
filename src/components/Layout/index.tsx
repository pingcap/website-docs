import { ThemeProvider, styled, useTheme } from "@mui/material/styles";

import theme from "theme/index";
import Header from "components/Layout/Header";
import Footer from "components/Layout/Footer";
import { Locale } from "static/Type";

export default function Layout(props: {
  children?: React.ReactNode;
  menu?: React.ReactNode;
  locales?: Locale[];
}) {
  return (
    <ThemeProvider theme={theme}>
      {/* <CustomCheckbox defaultChecked /> */}
      <Header menu={props.menu} locales={props.locales || []} />
      {props.children}
      <Footer />
    </ThemeProvider>
  );
}
