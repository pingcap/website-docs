import { useI18next } from "gatsby-plugin-react-i18next";
import { TOCNamespace } from "shared/interface";

export const useIsAutoTranslation = (namespace: TOCNamespace) => {
  const { language } = useI18next();
  const isJA = language === "ja";
  const isZH = language === "zh";
  const isAutoTranslation =
    namespace !== TOCNamespace.Home &&
    (isJA ||
      (isZH &&
        (namespace === TOCNamespace.TiDBCloud ||
          namespace === TOCNamespace.AI)));
  return isAutoTranslation;
};
