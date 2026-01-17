import { useI18next } from "gatsby-plugin-react-i18next";
import { TOCNamespace } from "shared/interface";

export const useIsAutoTranslation = (namespace: TOCNamespace) => {
  const { language } = useI18next();
  const isAutoTranslation =
    namespace !== TOCNamespace.Home &&
    (language === "ja" ||
      (language === "zh" && namespace === TOCNamespace.TiDBCloud));
  return isAutoTranslation;
};
