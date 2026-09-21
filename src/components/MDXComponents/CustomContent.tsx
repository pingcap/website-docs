import { PropsWithChildren } from "react";
import { TOCNamespace, CloudPlan, CloudCompatibility } from "shared/interface";

interface CustomContentProps {
  // using in markdown file
  platform?: TOCNamespace;
  language?: string;
  plan?: CloudPlan;
  compatibility?: string;

  currentNamespace?: TOCNamespace;
  languageFromURL?: string;
  cloudPlanFromURL?: CloudPlan | null;
  compatibilityFromURL?: CloudCompatibility;
}

export const useCustomContent = (
  currentNamespace: TOCNamespace,
  cloudPlanFromURL?: CloudPlan | null,
  languageFromURL?: string,
  compatibilityFromURL?: CloudCompatibility
) => {
  return (props: PropsWithChildren<CustomContentProps>) => {
    return (
      <CustomContent
        {...props}
        currentNamespace={currentNamespace}
        languageFromURL={languageFromURL}
        cloudPlanFromURL={cloudPlanFromURL}
        compatibilityFromURL={compatibilityFromURL}
      />
    );
  };
};

export const CustomContent: React.FC<PropsWithChildren<CustomContentProps>> = (
  props
) => {
  const {
    platform: namespace,
    currentNamespace,
    children,
    languageFromURL,
    language,
    cloudPlanFromURL,
    plan,
    compatibility,
    compatibilityFromURL,
  } = props;
  const shouldDisplayByNamespace = currentNamespace === namespace;

  const cloudPlanArray = plan?.split(",").map((p) => p.trim()) || [];
  const shouldDisplayByCloudPlan = cloudPlanArray.includes(
    cloudPlanFromURL || ""
  );

  const languageArray = language
    ? language.split(",").map((lang) => lang.trim())
    : [];
  const shouldDisplayByLanguage = languageArray.includes(languageFromURL || "");

  const isNamespaceMatch = !namespace || shouldDisplayByNamespace;
  const isLanguageMatch = !language || shouldDisplayByLanguage;
  const isCloudPlanMatch = !plan || shouldDisplayByCloudPlan;
  const compatibilityArray = compatibility
    ? compatibility.split(",").map((item) => item.trim())
    : [];
  const isCompatibilityMatch =
    !compatibility || compatibilityArray.includes(compatibilityFromURL || "");

  const shouldDisplay =
    isNamespaceMatch &&
    isLanguageMatch &&
    isCloudPlanMatch &&
    isCompatibilityMatch;

  return <>{shouldDisplay ? children : <></>}</>;
};
