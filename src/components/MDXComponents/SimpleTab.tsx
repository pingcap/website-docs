import { tabs, active, hidden } from "./simple-tab.module.css";

import { ReactElement, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { setTabGroup } from "state";
import clsx from "clsx";

// TODO: refactor with MUI and Recoil

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
  const defaultValue = children[0]!.props?.value || children[0].props.label;
  const [activeTab, setActiveTab] = useState(defaultValue);
  const dispatch = useDispatch();
  const { tabGroup } = useSelector((state) => state) as any;

  if (groupId) {
    const activeTabGroup = tabGroup[groupId];
    if (
      activeTabGroup &&
      activeTabGroup !== activeTab &&
      children.some(
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

  return (
    <>
      <ul className={clsx(tabs, "simple-tab-container")}>
        {children.map((child) => {
          const id: string = child.props?.value || child.props.label;
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
      {children.map((child) => {
        const id: string = child.props?.value || child.props.label;
        return (
          <div key={id} className={clsx({ [hidden]: activeTab !== id })}>
            {child.props.children}
          </div>
        );
      })}
    </>
  );
}
