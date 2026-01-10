import { ThemeProvider, styled, useTheme } from "@mui/material/styles";

import "@fontsource/poppins";
import "@fontsource/noto-sans-sc";
import "@fontsource/noto-sans-jp";
import "@fontsource/ibm-plex-sans";

import theme from "theme/index";
import Header from "components/Layout/Header";
import Footer from "components/Layout/Footer";
import { Locale, BuildType, PathConfig } from "shared/interface";
import { NavItemConfig } from "components/Layout/Header/HeaderNavConfig";

export default function Layout(props: {
  children?: React.ReactNode;
  bannerEnabled?: boolean;
  menu?: React.ReactNode;
  locales?: Locale[];
  docInfo?: { type: string; version: string };
  buildType?: BuildType;
  pageUrl?: string;
  name?: string;
  pathConfig?: PathConfig;
  onSelectedNavItemChange?: (item: NavItemConfig | null) => void;
}) {
  return (
    <ThemeProvider theme={theme}>
      {/* <CustomCheckbox defaultChecked /> */}
      <Header
        bannerEnabled={props.bannerEnabled}
        menu={props.menu}
        locales={props.locales || []}
        docInfo={props.docInfo}
        buildType={props.buildType}
        pageUrl={props.pageUrl}
        name={props.name}
        pathConfig={props.pathConfig}
        onSelectedNavItemChange={props.onSelectedNavItemChange}
      />
      {props.children}
      <Footer />
    </ThemeProvider>
  );
}
