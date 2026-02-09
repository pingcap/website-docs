import { tabs, active, hidden } from "./simple-tab.module.css";

import {
  Children,
  Fragment,
  isValidElement,
  ReactElement,
  ReactNode,
  useState,
  useMemo,
  useEffect,
  useRef,
} from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTabGroup } from "state";
import clsx from "clsx";

export function SimpleTab({
  groupId,
  children,
}: {
  groupId: string;
  children: ReactNode;
}) {
  const [renderedTabs, setRenderedTabs] = useState<string[]>([]);
  const tabEntries = useMemo(() => {
    type TabElement = ReactElement<{ label: string; value?: string }>;
    type TabEntry = {
      // The actual tab <div label=... value=...> element used for labels/ids
      tab: TabElement;
      // The original top-level node we should render as content (could be a wrapper like <CustomContent>)
      renderNode: ReactNode;
    };

    const isTabElement = (node: unknown): node is TabElement => {
      if (!isValidElement(node as ReactElement)) {
        return false;
      }
      const props = (node as any).props;
      return typeof props?.label === "string" && props.label.length > 0;
    };

    const unwrapToTab = (node: ReactNode): TabElement | null => {
      // Find the first tab element inside this node (supports wrapper like <CustomContent>).
      return Children.toArray(node).reduce<TabElement | null>(
        (found, child) => {
          if (found) {
            return found;
          }
          if (!isValidElement(child)) {
            return null;
          }
          if ((child.props as any)?.mdxType === "CustomContent") {
            return unwrapToTab(child.props?.children);
          }
          if (isTabElement(child)) {
            return child;
          }
          // If it's some other element (e.g. Fragment), keep walking down its children.
          return unwrapToTab(child.props?.children);
        },
        null
      );
    };

    const flattenTopLevelNodes = (nodes: ReactNode): ReactNode[] => {
      // MDX can sometimes pass a single Fragment that wraps multiple tab panes.
      // We want each tab pane to be a top-level entry, so we manually unwrap Fragments here.
      return Children.toArray(nodes).reduce<ReactNode[]>((acc, node) => {
        if (isValidElement(node) && node.type === Fragment) {
          return acc.concat(Children.toArray(node.props?.children));
        }
        return acc.concat(node);
      }, []);
    };

    // Preserve original top-level nodes for rendering (keeps wrappers like <CustomContent> intact).
    const tabEntries = flattenTopLevelNodes(children)
      .map<TabEntry | null>((node) => {
        const tab = unwrapToTab(node);
        return tab ? { tab, renderNode: node } : null;
      })
      .filter((entry): entry is TabEntry => entry !== null);

    return tabEntries;
  }, [children]);

  const actualTabs = useMemo(() => tabEntries.map((e) => e.tab), [tabEntries]);

  const defaultValue =
    actualTabs[0]?.props?.value || actualTabs[0]?.props.label;
  const [activeTab, setActiveTab] = useState(defaultValue);
  const dispatch = useDispatch();
  const { tabGroup } = useSelector((state) => state) as any;

  if (groupId) {
    const activeTabGroup = tabGroup[groupId];
    if (
      activeTabGroup &&
      activeTabGroup !== activeTab &&
      actualTabs.some(
        (child) => (child.props?.value || child.props.label) === activeTabGroup
      )
    ) {
      setActiveTab(activeTabGroup);
    }
  }

  const handleActiveTabChange = (newValue: string) => {
    setActiveTab(newValue);
    if (groupId) {
      dispatch(setTabGroup({ [groupId]: newValue }));
    }
  };

  if (!actualTabs.length) {
    return null;
  }

  useEffect(() => {
    if (!renderedTabs.length) {
      return;
    }
    setActiveTab(renderedTabs[0]);
  }, [renderedTabs]);

  return (
    <>
      <ul className={clsx(tabs, "simple-tab-container")}>
        {actualTabs.map((child) => {
          const id: string = child.props?.value || child.props.label;
          if (!renderedTabs.includes(id)) {
            return null;
          }
          return (
            <li
              key={id}
              className={clsx({ [active]: activeTab === id })}
              onClick={() => activeTab !== id && handleActiveTabChange(id)}
            >
              {child.props.label}
            </li>
          );
        })}
      </ul>
      {tabEntries.map(({ tab, renderNode }) => {
        const id: string = tab.props?.value || tab.props.label;
        return (
          <TabContentDetector
            key={id}
            id={id}
            activeTab={activeTab}
            renderedTabs={renderedTabs}
            onRendered={() => {
              setRenderedTabs((prev) => {
                if (prev.includes(id)) {
                  return prev;
                }
                // Add the new tab and then sort based on actualTabs order
                const newTabs = [...prev, id];
                return newTabs.sort((a, b) => {
                  const aIndex = actualTabs.findIndex(
                    (tab) => (tab.props?.value || tab.props.label) === a
                  );
                  const bIndex = actualTabs.findIndex(
                    (tab) => (tab.props?.value || tab.props.label) === b
                  );
                  return aIndex - bIndex;
                });
              });
            }}
          >
            {renderNode}
          </TabContentDetector>
        );
      })}
    </>
  );
}

export const TabContentDetector = ({
  children,
  id,
  activeTab,
  renderedTabs,
  onRendered,
}: {
  children: ReactNode;
  id: string;
  activeTab: string;
  renderedTabs: string[];
  onRendered: (id: string) => void;
}) => {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    if (
      ref.current &&
      ref.current.children.length > 0 &&
      !renderedTabs.includes(id)
    ) {
      onRendered(id);
    }
  });
  return (
    <div ref={ref} key={id} className={clsx({ [hidden]: activeTab !== id })}>
      {children}
    </div>
  );
};
