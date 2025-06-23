import { useI18next } from "gatsby-plugin-react-i18next";
import { getPageType } from "./utils";

export const useIsAutoTranslation = (pageUrl: string) => {
  const { language } = useI18next();
  const pageType = getPageType(language, pageUrl);
  const isAutoTranslation =
    pageType !== "home" &&
    (language === "ja" || (language === "zh" && pageType === "tidbcloud"));
  return isAutoTranslation;
};
