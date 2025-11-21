import { tabs, active, hidden } from "./simple-tab.module.css";

import { ReactElement, useState, useMemo, useEffect, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTabGroup } from "state";
import clsx from "clsx";

export function SimpleTab({
  groupId,
  children,
}: {
  groupId: string;
  children: ReactElement<{
    label: string;
    value?: string;
    children: ReactElement[];
  }>[];
}) {
  const [renderedTabs, setRenderedTabs] = useState<string[]>([]);
  const actualTabs = useMemo(() => {
    const tabs: ReactElement[] = [];

    const extractTabs = (elements: ReactElement[]) => {
      elements.forEach((element) => {
        if (element.props.mdxType === "CustomContent") {
          if (element.props.children) {
            const childrenArray = Array.isArray(element.props.children)
              ? element.props.children
              : [element.props.children];
            extractTabs(childrenArray);
          }
        } else {
          tabs.push(element);
        }
      });
    };

    extractTabs(children);

    return tabs;
  }, [children]);

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
        (child) => child.props?.value || child.props.label === activeTabGroup
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
      {children.map((child, index) => {
        const actualChild = actualTabs[index];
        const id: string = actualChild.props?.value || actualChild.props.label;
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
            {child}
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
  children: ReactElement;
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
