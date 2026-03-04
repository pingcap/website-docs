import * as React from "react";
import { useI18next } from "gatsby-plugin-react-i18next";

const IMAGE_LABELS = {
  en: {
    expand: "Expand image",
    collapse: "Collapse image",
  },
  zh: {
    expand: "展开图片",
    collapse: "收起图片",
  },
  ja: {
    expand: "画像を拡大",
    collapse: "画像を折りたたむ",
  },
} as const;

function getImageLabel(language: string, expanded: boolean) {
  const lang = language.startsWith("zh")
    ? "zh"
    : language.startsWith("ja")
    ? "ja"
    : "en";
  return expanded ? IMAGE_LABELS[lang].collapse : IMAGE_LABELS[lang].expand;
}

export function ExpandableImage(
  props: React.ImgHTMLAttributes<HTMLImageElement>
) {
  const [expanded, setExpanded] = React.useState(false);
  const { language } = useI18next();
  const label = getImageLabel(language, expanded);

  return (
    <span className="expandable-image">
      <button
        type="button"
        className="expandable-toggle-button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setExpanded((prev) => !prev);
        }}
        aria-expanded={expanded}
      >
        {label}
      </button>
      <span className={`expandable-image-frame${expanded ? " expanded" : ""}`}>
        <img {...props} />
      </span>
    </span>
  );
}
