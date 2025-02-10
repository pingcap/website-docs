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
  Env            : ${process.env.NODE_ENV}
  =====================================
  `);
};

export const onRouteUpdate = ({ location, prevLocation }) => {
  if (process.env.NODE_ENV === "production") {
    pageView();
  }
};
