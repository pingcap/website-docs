import { PropsWithChildren } from "react";
import { PageType } from "shared/utils";
import { CloudPlan } from "shared/useCloudPlan";

interface CustomContentProps {
  platform?: "tidb" | "tidb-cloud";
  language?: string;
  cloudPlan?: CloudPlan;
  pageTypeFromURL?: PageType;
  languageFromURL?: string;
  cloudPlanFromURL?: CloudPlan | null;
}

export const useCustomContent = (
  pageTypeFromURL: PageType,
  cloudPlanFromURL?: CloudPlan | null,
  languageFromURL?: string
) => {
  return (props: PropsWithChildren<CustomContentProps>) => {
    return (
      <CustomContent
        {...props}
        pageTypeFromURL={pageTypeFromURL}
        languageFromURL={languageFromURL}
        cloudPlanFromURL={cloudPlanFromURL}
      />
    );
  };
};

export const CustomContent: React.FC<PropsWithChildren<CustomContentProps>> = (
  props
) => {
  const {
    platform: _pageType,
    pageTypeFromURL,
    children,
    languageFromURL,
    language,
    cloudPlanFromURL,
    cloudPlan,
  } = props;
  const pageType = _pageType?.replace("-", "") || "";
  const shouldDisplayByPageType = pageTypeFromURL === pageType;

  const cloudPlanArray = cloudPlan?.split(",").map((plan) => plan.trim()) || [];
  const shouldDisplayByCloudPlan = cloudPlanArray.includes(
    cloudPlanFromURL || ""
  );

  const languageArray = language
    ? language.split(",").map((lang) => lang.trim())
    : [];
  const shouldDisplayByLanguage = languageArray.includes(languageFromURL || "");

  const isPageTypeMatch = !pageType || (!!pageType && shouldDisplayByPageType);
  const isLanguageMatch = !language || (!!language && shouldDisplayByLanguage);
  const isCloudPlanMatch =
    !cloudPlan || (!!cloudPlan && shouldDisplayByCloudPlan);

  const shouldDisplay = isPageTypeMatch && isLanguageMatch && isCloudPlanMatch;

  return <>{shouldDisplay ? children : <></>}</>;
};
