import * as React from "react";
import { useI18next } from "gatsby-plugin-react-i18next";
import { MdCloseFullscreen, MdOpenInFull } from "react-icons/md";

const TABLE_LABELS = {
  en: {
    expand: "Expand table",
    collapse: "Collapse table",
  },
  zh: {
    expand: "Expand table",
    collapse: "Collapse table",
  },
  ja: {
    expand: "Expand table",
    collapse: "Collapse table",
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
  const [open, setOpen] = React.useState(false);
  const { language } = useI18next();
  const expandLabel = getTableLabel(language, false);
  const collapseLabel = getTableLabel(language, true);

  React.useEffect(() => {
    if (!open) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setOpen(false);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  return (
    <div className="expandable-table">
      <button
        type="button"
        className="expandable-toggle-button"
        onClick={() => setOpen(true)}
        aria-expanded={open}
      >
        <span className="expandable-button-content">
          <MdOpenInFull aria-hidden="true" />
          <span>{expandLabel}</span>
        </span>
      </button>
      <table {...props} />
      {open && (
        <div
          className="expandable-modal-backdrop"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            className="expandable-modal-content expandable-table-modal-content"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="expandable-modal-collapse"
              onClick={() => setOpen(false)}
            >
              <span className="expandable-button-content">
                <MdCloseFullscreen aria-hidden="true" />
                <span>{collapseLabel}</span>
              </span>
            </button>
            <div className="expandable-modal-scroll">
              <table {...props} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
