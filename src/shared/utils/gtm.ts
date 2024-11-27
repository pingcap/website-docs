export const GTMEvent = {
  ClickHeadNav: "docs_navi_click",
  ClickFooter: "docs_footer_click",
  SignupCloud: "go_to_cloud_signup",
  SigninCloud: "signin_click",
  GotoPlayground: "go_to_playground",
  DownloadPDF: "docs_download",

  // workable in GTM of docs.pingcap.com
  UseOnsiteSearch: "use_onsite_search",
  UseExternalSearch: "use_external_search",
} as const;

export function gtmTrack(
  event: string,
  payload: Record<string, any> = {},
  dataLayerName?: string
) {
  const dataLayer: typeof payload[] =
    (dataLayerName ? window[dataLayerName] : window.dataLayer) || [];

  dataLayer.push({
    event,
    ...payload,
  });
}
