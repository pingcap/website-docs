export { default as wrapRootElement } from "./src/state/wrap-with-provider";
import {
  CLOUD_PLAN_LABEL_ELEMENT_ID,
  CLOUD_PLAN_LABEL_STRINGS,
} from "components/Layout/VersionSelect/CloudVersionSelect";
import docsJson from "./docs/docs.json";

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

// Custom redirect logic script
const redirectScript = `
(function() {
  // Redirect configuration from docs.json
  const CONFIG_REDIRECT = ${JSON.stringify(docsJson.redirect || {})};

  function checkCustomRedirect(pathname) {
    // First check for exact match
    const exactRedirectUrl = CONFIG_REDIRECT[pathname];
    if (exactRedirectUrl) {
      return { hasCustomRedirect: true, redirectUrl: exactRedirectUrl };
    }

    // Check for wildcard patterns
    for (const [pattern, target] of Object.entries(CONFIG_REDIRECT)) {
      if (pattern.includes('*')) {
        // Convert wildcard pattern to regex
        const regexPattern = pattern.replace(/\\*/g, '.*');
        const regex = new RegExp('^' + regexPattern + '$');

        if (regex.test(pathname)) {
          // Replace * in target with the actual pathname parts
          const pathParts = pathname.split('/');
          const patternParts = pattern.split('/');
          const wildcardIndex = patternParts.findIndex((part) => part === '*');

          if (wildcardIndex !== -1) {
            const wildcardValue = pathParts[wildcardIndex] || '';
            const redirectUrl = target.replace(/\\*/g, wildcardValue);
            return { hasCustomRedirect: true, redirectUrl };
          } else {
            return { hasCustomRedirect: true, redirectUrl: target };
          }
        }
      }
    }

    return { hasCustomRedirect: false, redirectUrl: undefined };
  }

  // Check if current page should redirect
  const pathname = window.location.pathname;
  const { hasCustomRedirect, redirectUrl } = checkCustomRedirect(pathname);

  if (hasCustomRedirect && redirectUrl) {
    // Redirect immediately
    window.location.href = redirectUrl;
  }
})();
`;

const fulfillCloudPlanScript = `
(function() {
  const cloudPlans = ${JSON.stringify(CLOUD_PLAN_LABEL_STRINGS)};
  const searchParams = new URLSearchParams(location.search);
  const cloudMode = searchParams.get("plan");
  const cloudPlanLabel = document.getElementById("${CLOUD_PLAN_LABEL_ELEMENT_ID}");
  if (cloudPlanLabel) {
    cloudPlanLabel.textContent = cloudPlans[cloudMode] || cloudPlans.premium;
  }
})();
`;

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
      key="custom-redirect"
      dangerouslySetInnerHTML={{ __html: redirectScript }}
    />,
    <script
      key="ai-widget"
      async
      src="https://tidb.ai/widget.js"
      data-controlled="true"
      data-chat-engine="pingcap-doc"
      data-measurement-id="G-GRPCMS37RV"
    />,
    <script
      key="fulfill-cloud-plan"
      dangerouslySetInnerHTML={{ __html: fulfillCloudPlanScript }}
    />,
  ]);
};
