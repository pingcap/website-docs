/**
 * Header height constants
 * These values should be kept in sync with the actual header height in Header.tsx
 */
const BANNER_HEIGHT_PX = 40;
const FIRST_ROW_HEIGHT_PX = 56;
const SECOND_ROW_HEIGHT_PX = 56;
const WITHOUT_BANNER_HEIGHT_PX = FIRST_ROW_HEIGHT_PX + SECOND_ROW_HEIGHT_PX;
const WITH_BANNER_HEIGHT_PX = WITHOUT_BANNER_HEIGHT_PX + BANNER_HEIGHT_PX;
const STICKY_WITHOUT_BANNER_HEIGHT_PX = SECOND_ROW_HEIGHT_PX;
const STICKY_WITH_BANNER_HEIGHT_PX =
  STICKY_WITHOUT_BANNER_HEIGHT_PX + BANNER_HEIGHT_PX;

const px = (value: number) => `${value}px`;

export const HEADER_HEIGHT = {
  BANNER: px(BANNER_HEIGHT_PX),
  FIRST_ROW: px(FIRST_ROW_HEIGHT_PX),
  SECOND_ROW: px(SECOND_ROW_HEIGHT_PX),
  WITHOUT_BANNER: px(WITHOUT_BANNER_HEIGHT_PX),
  WITH_BANNER: px(WITH_BANNER_HEIGHT_PX),
  STICKY_WITHOUT_BANNER: px(STICKY_WITHOUT_BANNER_HEIGHT_PX),
  STICKY_WITH_BANNER: px(STICKY_WITH_BANNER_HEIGHT_PX),
} as const;

/**
 * Get header height based on banner visibility
 */
export const getHeaderHeight = (bannerEnabled: boolean): string => {
  return bannerEnabled
    ? HEADER_HEIGHT.WITH_BANNER
    : HEADER_HEIGHT.WITHOUT_BANNER;
};

/**
 * Get sticky top offset (banner + second row) based on banner visibility.
 */
export const getHeaderStickyHeight = (bannerEnabled: boolean): string => {
  return bannerEnabled
    ? HEADER_HEIGHT.STICKY_WITH_BANNER
    : HEADER_HEIGHT.STICKY_WITHOUT_BANNER;
};
