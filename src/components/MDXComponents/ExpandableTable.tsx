import * as React from "react";
import {
  CloseLargeIcon,
  ExpandCornersIcon,
} from "components/MDXComponents/ExpandIcons";

type TableChildProps = {
  children?: React.ReactNode;
  mdxType?: string;
  originalType?: string;
};

type StickyHeaderMetrics = {
  tableWidth: number;
  headerHeight: number;
  columnWidths: number[];
};

type TablePropsWithRef = React.TableHTMLAttributes<HTMLTableElement> & {
  ref?: React.Ref<HTMLTableElement>;
};

const StickyHeaderTableContext = React.createContext(false);

const hasClassName = (className: string | undefined, name: string) =>
  className?.split(/\s+/).includes(name) ?? false;

const addClassName = (className: string | undefined, name: string): string =>
  hasClassName(className, name)
    ? className ?? name
    : `${className ?? ""} ${name}`.trim();

const findTableHead = (children: React.ReactNode): React.ReactNode => {
  for (const child of React.Children.toArray(children)) {
    if (!React.isValidElement<TableChildProps>(child)) continue;

    if (
      child.type === "thead" ||
      child.props.mdxType === "thead" ||
      child.props.originalType === "thead"
    ) {
      return child;
    }

    if (child.type === React.Fragment) {
      const tableHead = findTableHead(child.props.children);
      if (tableHead) return tableHead;
    }
  }

  return null;
};

export function StickyHeaderTable({
  children,
}: {
  children?: React.ReactNode;
}) {
  return (
    <StickyHeaderTableContext.Provider value={true}>
      {children}
    </StickyHeaderTableContext.Provider>
  );
}

export function ExpandableTable(
  props: React.TableHTMLAttributes<HTMLTableElement>
) {
  const { ref: _ref, ...tableProps } = props as TablePropsWithRef;
  const [open, setOpen] = React.useState(false);
  const [stickyHeaderMetrics, setStickyHeaderMetrics] =
    React.useState<StickyHeaderMetrics | null>(null);
  const [stickyHeaderActive, setStickyHeaderActive] = React.useState(false);
  const stickyHeaderScrollRef = React.useRef<HTMLDivElement | null>(null);
  const tableRef = React.useRef<HTMLTableElement | null>(null);
  const stickyHeaderOptIn = React.useContext(StickyHeaderTableContext);
  const isStickyHeader =
    stickyHeaderOptIn || hasClassName(tableProps.className, "sticky-header");
  const stickyTableProps = {
    ...tableProps,
    className: isStickyHeader
      ? addClassName(tableProps.className, "sticky-header")
      : tableProps.className,
  };
  const tableHead = findTableHead(tableProps.children);
  const hasStickyHeaderClone = Boolean(stickyHeaderMetrics && tableHead);

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

  React.useEffect(() => {
    if (!isStickyHeader) return;

    const syncStickyHeader = () => {
      if (!stickyHeaderScrollRef.current || !tableRef.current) return;
      stickyHeaderScrollRef.current.scrollLeft = tableRef.current.scrollLeft;
    };

    const tableScroll = tableRef.current;
    tableScroll?.addEventListener("scroll", syncStickyHeader, {
      passive: true,
    });
    syncStickyHeader();

    return () => {
      tableScroll?.removeEventListener("scroll", syncStickyHeader);
    };
  }, [isStickyHeader, stickyHeaderMetrics]);

  React.useEffect(() => {
    if (!isStickyHeader || !hasStickyHeaderClone || !stickyHeaderMetrics) {
      setStickyHeaderActive(false);
      return;
    }

    let rafId: number | null = null;
    const updateStickyHeaderActive = () => {
      rafId = null;
      const table = tableRef.current;
      const stickyHeader = stickyHeaderScrollRef.current;
      if (!table || !stickyHeader) {
        setStickyHeaderActive(false);
        return;
      }

      const stickyTop = Number.parseFloat(
        window.getComputedStyle(stickyHeader).top
      );
      const stickyHeaderTop = Number.isFinite(stickyTop) ? stickyTop : 0;
      const tableRect = table.getBoundingClientRect();
      const nextActive =
        tableRect.top <= stickyHeaderTop &&
        tableRect.bottom > stickyHeaderTop + stickyHeaderMetrics.headerHeight;

      if (nextActive) {
        stickyHeader.scrollLeft = table.scrollLeft;
      }
      setStickyHeaderActive((current) =>
        current === nextActive ? current : nextActive
      );
    };

    const scheduleUpdate = () => {
      if (rafId != null) {
        window.cancelAnimationFrame(rafId);
      }
      rafId = window.requestAnimationFrame(updateStickyHeaderActive);
    };

    scheduleUpdate();
    window.addEventListener("scroll", scheduleUpdate, { passive: true });
    window.addEventListener("resize", scheduleUpdate);

    return () => {
      if (rafId != null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", scheduleUpdate);
      window.removeEventListener("resize", scheduleUpdate);
    };
  }, [isStickyHeader, hasStickyHeaderClone, stickyHeaderMetrics]);

  React.useEffect(() => {
    if (!isStickyHeader) return;

    let rafId: number | null = null;
    const measure = () => {
      const table = tableRef.current;
      const tableHead = table?.tHead;
      const headerCells = tableHead?.querySelectorAll("th");
      if (!table || !tableHead || !headerCells || headerCells.length === 0) {
        return;
      }
      const tableWidth = Math.max(
        table.getBoundingClientRect().width,
        table.scrollWidth
      );
      const headerHeight = tableHead.getBoundingClientRect().height;
      if (tableWidth === 0 || headerHeight === 0) return;

      const nextMetrics = {
        tableWidth,
        headerHeight,
        columnWidths: Array.from(headerCells).map(
          (cell) => cell.getBoundingClientRect().width
        ),
      };

      setStickyHeaderMetrics((current) => {
        if (
          current?.tableWidth === nextMetrics.tableWidth &&
          current.headerHeight === nextMetrics.headerHeight &&
          current.columnWidths.length === nextMetrics.columnWidths.length &&
          current.columnWidths.every(
            (width, index) => width === nextMetrics.columnWidths[index]
          )
        ) {
          return current;
        }

        return nextMetrics;
      });
    };

    const scheduleMeasure = () => {
      if (rafId != null) {
        window.cancelAnimationFrame(rafId);
      }
      rafId = window.requestAnimationFrame(measure);
    };

    scheduleMeasure();
    window.addEventListener("resize", scheduleMeasure);
    const resizeObserver =
      typeof ResizeObserver === "undefined"
        ? null
        : new ResizeObserver(scheduleMeasure);
    if (tableRef.current && resizeObserver) {
      resizeObserver.observe(tableRef.current);
    }

    return () => {
      if (rafId != null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("resize", scheduleMeasure);
      resizeObserver?.disconnect();
    };
  }, [isStickyHeader]);

  // The cloned header is visual-only: it is aria-hidden and pointer-events are
  // disabled in CSS, so sticky table headers should not contain controls.
  const stickyHeader =
    isStickyHeader && stickyHeaderMetrics && tableHead ? (
      <div
        className={[
          "sticky-header-scroll",
          stickyHeaderActive ? "" : "sticky-header-scroll-hidden",
        ]
          .filter(Boolean)
          .join(" ")}
        ref={stickyHeaderScrollRef}
        aria-hidden="true"
        style={{
          height: stickyHeaderMetrics.headerHeight,
          marginBottom: -stickyHeaderMetrics.headerHeight,
        }}
      >
        <table
          {...stickyTableProps}
          className={addClassName(
            stickyTableProps.className,
            "sticky-header-clone"
          )}
          style={{
            ...stickyTableProps.style,
            width: stickyHeaderMetrics.tableWidth,
          }}
        >
          <colgroup>
            {stickyHeaderMetrics.columnWidths.map((width, index) => (
              <col key={index} style={{ width }} />
            ))}
          </colgroup>
          {tableHead}
        </table>
      </div>
    ) : null;
  const modalTableProps = isStickyHeader ? stickyTableProps : tableProps;

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
      {isStickyHeader ? (
        <>
          {stickyHeader}
          <table
            {...stickyTableProps}
            ref={tableRef}
            className={[
              addClassName(stickyTableProps.className, "sticky-header-source"),
              stickyHeaderActive ? "sticky-header-source-hidden" : "",
            ]
              .filter(Boolean)
              .join(" ")}
          />
        </>
      ) : (
        <table {...props} />
      )}
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
              <table {...modalTableProps} />
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
