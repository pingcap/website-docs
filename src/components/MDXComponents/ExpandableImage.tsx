import * as React from "react";
import { createPortal } from "react-dom";
import { CloseLargeIcon } from "./ExpandIcons";

export function ExpandableImage(
  props: React.ImgHTMLAttributes<HTMLImageElement>
) {
  const [open, setOpen] = React.useState(false);
  const wrapperRef = React.useRef<HTMLSpanElement>(null);
  const portalContainer =
    typeof document === "undefined"
      ? null
      : wrapperRef.current?.closest(".doc-content") ?? document.body;

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
    <span ref={wrapperRef} className="expandable-image">
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
        portalContainer &&
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
              <div className="expandable-image-modal-toolbar">
                <button
                  type="button"
                  className="expandable-modal-close-button expandable-image-modal-close-button"
                  aria-label="Close expanded image"
                  onClick={() => setOpen(false)}
                >
                  <CloseLargeIcon />
                </button>
              </div>
              <div className="expandable-modal-scroll">
                <img {...props} className="expandable-modal-image" />
              </div>
            </div>
          </div>,
          portalContainer
        )}
    </span>
  );
}
