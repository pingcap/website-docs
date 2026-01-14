import { TableOfContent, CloudPlan, TOCNamespace } from "./interface";

/**
 * Filter right TOC based on CustomContent conditions
 * Removes TOC items that don't match current context (namespace, cloudPlan, language)
 */
export function filterRightToc(
  items: TableOfContent[],
  namespace: TOCNamespace,
  cloudPlan: CloudPlan | null,
  language: string
): TableOfContent[] {
  if (!items) return [];

  return items
    .map((item) => {
      // Check if item has condition
      if (item.condition) {
        const { platform, plan, language: conditionLang } = item.condition;

        // Check platform match (namespace)
        if (platform) {
          // platform value should match TOCNamespace enum value
          if (platform !== namespace) {
            return null; // Filter out this item
          }
        }

        // Check plan match
        if (plan) {
          const planArray = plan.split(",").map((p) => p.trim());
          if (!cloudPlan || !planArray.includes(cloudPlan)) {
            return null; // Filter out this item
          }
        }

        // Check language match
        if (conditionLang) {
          const langArray = conditionLang.split(",").map((lang) => lang.trim());
          if (!langArray.includes(language)) {
            return null; // Filter out this item
          }
        }
      }

      // Recursively filter nested items
      if (item.items && item.items.length > 0) {
        const filteredItems = filterRightToc(
          item.items,
          namespace,
          cloudPlan,
          language
        );
        return {
          ...item,
          items: filteredItems,
        };
      }

      return item;
    })
    .filter((item): item is TableOfContent => item !== null);
}
