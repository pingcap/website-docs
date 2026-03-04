import * as React from "react";
import { useI18next } from "gatsby-plugin-react-i18next";

const IMAGE_LABELS = {
  en: {
    expand: "Expand image",
    collapse: "Collapse image",
  },
  zh: {
    expand: "Expand image",
    collapse: "Collapse image",
  },
  ja: {
    expand: "Expand image",
    collapse: "Collapse image",
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
  const [open, setOpen] = React.useState(false);
  const { language } = useI18next();
  const expandLabel = getImageLabel(language, false);
  const collapseLabel = getImageLabel(language, true);

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
    <div className="expandable-image">
      <button
        type="button"
        className="expandable-toggle-button"
        onClick={(event) => {
          event.preventDefault();
          event.stopPropagation();
          setOpen(true);
        }}
        aria-expanded={open}
      >
        {expandLabel}
      </button>
      <img {...props} />
      {open && (
        <div
          className="expandable-modal-backdrop"
          role="presentation"
          onClick={() => setOpen(false)}
        >
          <div
            className="expandable-modal-content expandable-image-modal-content"
            role="dialog"
            aria-modal="true"
            onClick={(event) => event.stopPropagation()}
          >
            <button
              type="button"
              className="expandable-modal-collapse"
              onClick={() => setOpen(false)}
            >
              {collapseLabel}
            </button>
            <div className="expandable-modal-scroll">
              <img {...props} className="expandable-modal-image" />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
