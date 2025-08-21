import { PropsWithChildren } from "react";
import { PageType } from "shared/utils";

interface CustomContentProps {
  platform?: "tidb" | "tidb-cloud";
  language?: string;
  pageTypeFromURL?: PageType;
  languageFromURL?: string;
}

export const useCustomContent = (
  pageTypeFromURL: PageType,
  languageFromURL?: string
) => {
  return (props: PropsWithChildren<CustomContentProps>) => {
    return (
      <CustomContent
        {...props}
        pageTypeFromURL={pageTypeFromURL}
        languageFromURL={languageFromURL}
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
  } = props;
  const pageType = _pageType?.replace("-", "") || "";
  const shouldDisplayByPageType = pageTypeFromURL === pageType;

  const languageArray = language
    ? language.split(",").map((lang) => lang.trim())
    : [];
  const shouldDisplayByLanguage = languageArray.includes(languageFromURL || "");

  const onlyPageType = !!pageType && !language;
  const onlyLanguage = !pageType && !!language;
  const showOnlyPageType = onlyPageType && shouldDisplayByPageType;
  const showOnlyLanguage = onlyLanguage && shouldDisplayByLanguage;
  const showAll =
    !!pageType &&
    !!languageFromURL &&
    shouldDisplayByPageType &&
    shouldDisplayByLanguage;
  const shouldDisplay = showOnlyPageType || showOnlyLanguage || showAll;

  return <>{shouldDisplay ? children : <></>}</>;
};
