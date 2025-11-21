import { TableOfContent, CloudPlan } from "./interface";
import { PageType } from "./utils";

/**
 * Filter right TOC based on CustomContent conditions
 * Removes TOC items that don't match current context (pageType, cloudPlan, language)
 */
export function filterRightToc(
  items: TableOfContent[],
  pageType: PageType,
  cloudPlan: CloudPlan | null,
  language: string
): TableOfContent[] {
  if (!items) return [];

  return items
    .map((item) => {
      // Check if item has condition
      if (item.condition) {
        const { platform, plan, language: conditionLang } = item.condition;

        // Check platform match
        if (platform) {
          const normalizedPlatform = platform.replace("-", "");
          if (normalizedPlatform !== pageType) {
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
          pageType,
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
