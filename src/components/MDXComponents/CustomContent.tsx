import { PropsWithChildren } from "react";
import { TOCNamespace, CloudPlan } from "shared/interface";

interface CustomContentProps {
  // using in markdown file
  platform?: TOCNamespace;
  language?: string;
  plan?: CloudPlan;

  currentNamespace?: TOCNamespace;
  languageFromURL?: string;
  cloudPlanFromURL?: CloudPlan | null;
}

export const useCustomContent = (
  currentNamespace: TOCNamespace,
  cloudPlanFromURL?: CloudPlan | null,
  languageFromURL?: string
) => {
  return (props: PropsWithChildren<CustomContentProps>) => {
    return (
      <CustomContent
        {...props}
        currentNamespace={currentNamespace}
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
    platform: namespace,
    currentNamespace,
    children,
    languageFromURL,
    language,
    cloudPlanFromURL,
    plan,
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

  const shouldDisplay = isNamespaceMatch && isLanguageMatch && isCloudPlanMatch;

  return <>{shouldDisplay ? children : <></>}</>;
};
