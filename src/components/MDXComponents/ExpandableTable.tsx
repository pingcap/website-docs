import * as React from "react";
import {
  CloseLargeIcon,
  ExpandCornersIcon,
} from "components/MDXComponents/ExpandIcons";

export function ExpandableTable(
  props: React.TableHTMLAttributes<HTMLTableElement>
) {
  const [open, setOpen] = React.useState(false);

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
      <div className="expandable-table-toolbar">
        <button
          type="button"
          className="expandable-icon-button expandable-table-icon-button"
          aria-label="Expand table"
          onClick={() => setOpen(true)}
        >
          <ExpandCornersIcon />
        </button>
      </div>
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
              className="expandable-modal-close-button"
              aria-label="Close expanded table"
              onClick={() => setOpen(false)}
            >
              <CloseLargeIcon />
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
