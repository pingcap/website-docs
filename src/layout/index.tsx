import { Container, Section } from "@seagreenio/react-bulma";
import { PropsWithChildren, useEffect } from "react";

import { Footer } from "./comp/Footer";
import { Navbar } from "layout/comp/Navbar";
import { globalHistory } from "@reach/router";
import { navigate } from "gatsby";
// import 'styles/global.scss'
import { Locale } from "typing";

declare global {
  interface Window {
    DOCS_PINGCAP: any;
  }
}

interface Props {
  locale?: Locale[];
  is404?: Boolean;
}

export function Layout({
  children,
  locale = [Locale.en, Locale.zh, Locale.ja],
  is404 = false,
}: PropsWithChildren<Props>) {
  useEffect(() => {
    if (!window.DOCS_PINGCAP) {
      window.DOCS_PINGCAP = {
        globalHistory,
        navigate,
      };
    }
  }, []);

  return (
    <>
      <Navbar locale={locale} is404={is404} />
      <Section as="main">
        <Container>{children}</Container>
      </Section>
      <Footer />
    </>
  );
}
