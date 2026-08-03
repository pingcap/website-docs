import * as React from "react";
import { createPortal } from "react-dom";
import { CloseLargeIcon } from "./ExpandIcons";

export function ExpandableImage(
  props: React.ImgHTMLAttributes<HTMLImageElement>
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
    <span className="expandable-image">
      <img
        {...props}
        className={`expandable-inline-image${
          props.className ? ` ${props.className}` : ""
        }`}
        onClick={(event) => {
          props.onClick?.(event);
          if (!event.defaultPrevented) {
            setOpen(true);
          }
        }}
      />
      {open &&
        createPortal(
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
                className="expandable-modal-close-button"
                aria-label="Close expanded image"
                onClick={() => setOpen(false)}
              >
                <CloseLargeIcon />
              </button>
              <div className="expandable-modal-scroll">
                <img {...props} className="expandable-modal-image" />
              </div>
            </div>
          </div>,
          document.body
        )}
    </span>
  );
}
