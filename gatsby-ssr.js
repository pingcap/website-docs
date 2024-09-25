export { default as wrapRootElement } from "./src/state/wrap-with-provider";

// https://github.com/gatsbyjs/gatsby/issues/1526
export const onPreRenderHTML = ({ getHeadComponents }) => {
  if (process.env.NODE_ENV !== "production") {
    return;
  }

  getHeadComponents().forEach((el) => {
    if (el.type === "style" && el.props["data-href"]) {
      el.type = "link";
      el.props["href"] = el.props["data-href"];
      el.props["rel"] = "stylesheet";

      delete el.props["data-href"];
      delete el.props["dangerouslySetInnerHTML"];
    }
  });
};

// TODO: remove after we staticize everything
const script = `if (Promise == null || Promise.allSettled == null) {
  const div = document.createElement('div')
  div.classList.add('notification', 'is-danger', 'is-light')
  div.style = 'position: fixed; top: 0; left: 0; width: 100%;text-align:center; z-index: 9999'
  div.innerText = /^\\/?zh/.exec(location.pathname) ? '当前浏览器不受支持，请使用最新版本的 Chrome、Firefox 或 Edge。' : 'Your current browser is not supported. Please use the latest version of Chrome, Firefox, or Edge.'
  document.body.appendChild(div)
}`;

export const onRenderBody = ({ setPostBodyComponents, setHeadComponents }) => {
  setHeadComponents([
    <link
      key="moderat-bold"
      rel="preload"
      href="/fonts/Moderat-Bold.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
    <link
      key="moderat-light"
      rel="preload"
      href="/fonts/Moderat-Light.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
    <link
      key="moderat-medium"
      rel="preload"
      href="/fonts/Moderat-Medium.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
    <link
      key="moderat-regular"
      rel="preload"
      href="/fonts/Moderat-Regular.woff2"
      as="font"
      type="font/woff2"
      crossOrigin="anonymous"
    />,
  ]);
  setPostBodyComponents([
    <script key="deprecated" dangerouslySetInnerHTML={{ __html: script }} />,
    <script
      key="ai-widget"
      async
      src="https://tidb.ai/widget.js"
      data-controlled="true"
      data-chat-engine="pingcap-doc"
      data-measurement-id="G-GRPCMS37RV"
    />,
  ]);
};
