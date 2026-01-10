import { useI18next } from "gatsby-plugin-react-i18next";
import { usePageType, PageType } from "shared/usePageType";

export const useIsAutoTranslation = (pageUrl: string) => {
  const { language } = useI18next();
  const pageType = usePageType(language, pageUrl);
  const isAutoTranslation =
    pageType !== PageType.Home &&
    (language === "ja" ||
      (language === "zh" && pageType === PageType.TiDBCloud));
  return isAutoTranslation;
};
