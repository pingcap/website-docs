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
    cloudPlanLabel.textContent = cloudPlans[cloudMode] || cloudPlans.dedicated;
  }
})();
`;

const headerPrehydrateScript = `
(function() {
  try {
    var ROOT_SELECTOR = "[data-pc-docs-header-root]";
    var LEFT_CLUSTER_SELECTOR = "[data-pc-docs-header-left-cluster]";
    var LOGO_MEASURE_SELECTOR = "[data-pc-docs-header-logo-measure]";
    var CSS_VAR_TRANSLATE_X = "--pc-docs-header-translate-x";
    var CSS_VAR_LOGO_SCALE = "--pc-docs-header-logo-scale";
    var LOGO_GAP = 24;
    var FIRST_ROW_HEIGHT = 56;

    function clamp(value, min, max) {
      return Math.min(max, Math.max(min, value));
    }

    function sync(root) {
      if (!root || !root.style) {
        return false;
      }

      var y = window.scrollY || 0;
      var progress = clamp(y / FIRST_ROW_HEIGHT, 0, 1);
      var logoScale = 1 - progress * 0.2;

      var leftCluster = root.querySelector(LEFT_CLUSTER_SELECTOR);
      var logoMeasure = root.querySelector(LOGO_MEASURE_SELECTOR);

      if (!leftCluster || !logoMeasure) {
        return false;
      }

      var leftClusterWidth = leftCluster.getBoundingClientRect().width || 0;
      var logoWidth = logoMeasure.getBoundingClientRect().width || 0;

      // Always update logo scale; translateX depends on measured widths.
      root.style.setProperty(CSS_VAR_LOGO_SCALE, "" + logoScale);

      if (!leftClusterWidth || !logoWidth) {
        return false;
      }

      var menuWidth = Math.max(0, leftClusterWidth - logoWidth);
      var translateX = progress * (menuWidth + logoWidth * logoScale + LOGO_GAP);

      root.style.setProperty(CSS_VAR_TRANSLATE_X, translateX + "px");
      return true;
    }

    function trySync() {
      var root = document.querySelector(ROOT_SELECTOR);
      if (!root) {
        return false;
      }

      // Desktop only: xs uses a different layout and doesn't consume translateX.
      var isDesktop = false;
      try {
        isDesktop = window.matchMedia && window.matchMedia("(min-width: 900px)").matches;
      } catch (e) {
        isDesktop = false;
      }
      if (!isDesktop) {
        root.style.setProperty(CSS_VAR_TRANSLATE_X, "0px");
        root.style.setProperty(CSS_VAR_LOGO_SCALE, "1");
        return true;
      }

      return sync(root);
    }

    if (trySync()) {
      return;
    }

    var observer = new MutationObserver(function() {
      if (trySync()) {
        observer.disconnect();
      }
    });

    observer.observe(document.documentElement, { childList: true, subtree: true });

    // Fallback retries (in case layout isn't ready when the observer fires).
    var retries = 0;
    (function retry() {
      if (trySync()) {
        observer.disconnect();
        return;
      }
      retries += 1;
      if (retries >= 20) {
        observer.disconnect();
        return;
      }
      setTimeout(retry, 50);
    })();
  } catch (e) {
    // no-op
  }
})();
`;

export const onRenderBody = ({
  setPostBodyComponents,
  setHeadComponents,
  setPreBodyComponents,
}) => {
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
  setPreBodyComponents([
    <script
      key="header-prehydrate"
      dangerouslySetInnerHTML={{ __html: headerPrehydrateScript }}
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
