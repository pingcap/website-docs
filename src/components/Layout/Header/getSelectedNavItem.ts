import { TOCNamespace } from "shared/interface";
import { NavConfig, NavItemConfig } from "./HeaderNavConfigType";

export const getSelectedNavItem = (
  configs: NavConfig[],
  namespace?: TOCNamespace
): NavItemConfig | null => {
  for (const config of configs) {
    if (config.type === "item") {
      const isSelected =
        typeof config.selected === "function"
          ? config.selected(namespace)
          : config.selected ?? false;
      if (isSelected) {
        return config;
      }
      continue;
    }

    const item = getSelectedNavItem(config.children, namespace);
    if (item) {
      return item;
    }
  }
  return null;
};

