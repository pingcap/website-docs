import * as React from "react";
import { useI18next } from "gatsby-plugin-react-i18next";

const TABLE_LABELS = {
  en: {
    expand: "Expand table",
    collapse: "Collapse table",
  },
  zh: {
    expand: "展开表格",
    collapse: "收起表格",
  },
  ja: {
    expand: "表を展開",
    collapse: "表を折りたたむ",
  },
} as const;

function getTableLabel(language: string, expanded: boolean) {
  const lang = language.startsWith("zh")
    ? "zh"
    : language.startsWith("ja")
    ? "ja"
    : "en";
  return expanded ? TABLE_LABELS[lang].collapse : TABLE_LABELS[lang].expand;
}

export function ExpandableTable(
  props: React.TableHTMLAttributes<HTMLTableElement>
) {
  const [expanded, setExpanded] = React.useState(false);
  const { language } = useI18next();
  const label = getTableLabel(language, expanded);

  return (
    <div className="expandable-table">
      <button
        type="button"
        className="expandable-toggle-button"
        onClick={() => setExpanded((prev) => !prev)}
        aria-expanded={expanded}
      >
        {label}
      </button>
      <div
        className={`expandable-table-container${expanded ? " expanded" : ""}`}
      >
        <table {...props} />
      </div>
    </div>
  );
}
