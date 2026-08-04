import * as React from "react";
import { createPortal } from "react-dom";
import { CloseLargeIcon } from "./ExpandIcons";

interface ExpandableImageModalProps {
  imageProps: React.ImgHTMLAttributes<HTMLImageElement>;
  onClose: () => void;
}

export function ExpandableImageModal({
  imageProps,
  onClose,
}: ExpandableImageModalProps) {
  return (
    <div
      className="expandable-modal-backdrop"
      role="presentation"
      onClick={onClose}
    >
      <div
        className="expandable-modal-content expandable-image-modal-content"
        role="dialog"
        aria-modal="true"
        onClick={(event) => event.stopPropagation()}
      >
        <button
          type="button"
          className="expandable-modal-close-button expandable-image-modal-close-button"
          aria-label="Close expanded image"
          onClick={onClose}
        >
          <CloseLargeIcon />
        </button>
        <div className="expandable-modal-scroll">
          <img {...imageProps} className="expandable-modal-image" />
        </div>
      </div>
    </div>
  );
}

export function ExpandableImage(
  props: React.ImgHTMLAttributes<HTMLImageElement>
) {
  const [portalContainer, setPortalContainer] = React.useState<Element | null>(
    null
  );
  const wrapperRef = React.useRef<HTMLSpanElement>(null);

  React.useEffect(() => {
    if (!portalContainer) return;

    const originalOverflow = document.body.style.overflow;
    document.body.style.overflow = "hidden";

    const onKeyDown = (event: KeyboardEvent) => {
      if (event.key === "Escape") {
        setPortalContainer(null);
      }
    };

    document.addEventListener("keydown", onKeyDown);

    return () => {
      document.body.style.overflow = originalOverflow;
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [portalContainer]);

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
            const container = wrapperRef.current?.closest(
              ".PingCAP-Doc .doc-content"
            );
            if (container) {
              setPortalContainer(container);
            } else if (process.env.NODE_ENV !== "production") {
              console.warn(
                "ExpandableImage requires a .doc-content ancestor inside .PingCAP-Doc."
              );
            }
          }
        }}
      />
      {portalContainer &&
        createPortal(
          <ExpandableImageModal
            imageProps={props}
            onClose={() => setPortalContainer(null)}
          />,
          portalContainer
        )}
    </span>
  );
}
