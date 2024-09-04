import "./src/styles/global.css";

import { pageView } from "./scripts/track";

export { default as wrapRootElement } from "./src/state/wrap-with-provider";

export const onClientEntry = () => {
  console.log(`
  ██████╗ ██╗███╗   ██╗ ██████╗  ██████╗ █████╗ ██████╗     ██████╗  ██████╗  ██████╗███████╗
  ██╔══██╗██║████╗  ██║██╔════╝ ██╔════╝██╔══██╗██╔══██╗    ██╔══██╗██╔═══██╗██╔════╝██╔════╝
  ██████╔╝██║██╔██╗ ██║██║  ███╗██║     ███████║██████╔╝    ██║  ██║██║   ██║██║     ███████╗
  ██╔═══╝ ██║██║╚██╗██║██║   ██║██║     ██╔══██║██╔═══╝     ██║  ██║██║   ██║██║     ╚════██║
  ██║     ██║██║ ╚████║╚██████╔╝╚██████╗██║  ██║██║         ██████╔╝╚██████╔╝╚██████╗███████║
  ╚═╝     ╚═╝╚═╝  ╚═══╝ ╚═════╝  ╚═════╝╚═╝  ╚═╝╚═╝         ╚═════╝  ╚═════╝  ╚═════╝╚══════╝

  =====================================
  Project        : pingcap/website-docs
  Build Time     : ${process.env.GATSBY_DOC_BUILD_DATE}
  Env            : ${process.env.NODE_ENV}
  GIT Tag        : ${process.env.GATSBY_DOC_BUILD_GIT_SHA}
  Docs Staging   : ${process.env.GATSBY_DOC_BUILD_SUBMODULE_SHA}
  =====================================
  `);
};

export const onRouteUpdate = ({ location, prevLocation }) => {
  if (process.env.NODE_ENV === "production") {
    pageView();
  }
};
