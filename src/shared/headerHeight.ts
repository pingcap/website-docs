/**
 * Header height constants
 * These values should be kept in sync with the actual header height in Header.tsx
 */
export const HEADER_HEIGHT = {
  /** Banner height: 40px */
  BANNER: "40px",
  /** First row height (Logo row): 72px */
  FIRST_ROW: "72px",
  /** Second row height (Navigation row): 56px */
  SECOND_ROW: "56px",
  /** Header height without banner: 128px (72px + 56px) */
  WITHOUT_BANNER: "128px",
  /** Header height with banner: 168px (40px + 72px + 56px) */
  WITH_BANNER: "168px",
} as const;

/**
 * Get header height based on banner visibility
 */
export const getHeaderHeight = (bannerEnabled: boolean): string => {
  return bannerEnabled
    ? HEADER_HEIGHT.WITH_BANNER
    : HEADER_HEIGHT.WITHOUT_BANNER;
};
