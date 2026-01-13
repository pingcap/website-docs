import { ReactNode } from "react";
import { PageType } from "shared/usePageType";

/**
 * Single navigation item configuration
 */
export interface NavItemConfig {
  type: "item";
  /** Navigation label */
  label: string | ReactNode;
  /** Navigation URL */
  to: string;
  /** Optional icon before label */
  startIcon?: ReactNode;
  /** Optional alt text for GTM tracking */
  alt?: string;
  /** Whether this item is selected (can be a function that returns boolean) */
  selected?: boolean | ((pageType: PageType) => boolean);
  /** Optional click handler */
  onClick?: () => void;
  /** Whether to use i18n for the link */
  isI18n?: boolean;
  /** Condition to show this item */
  condition?: (language: string, buildType?: string) => boolean;
}

/**
 * Navigation group configuration
 */
export interface NavGroupConfig {
  type: "group";
  /** Group title (empty string means no title displayed) */
  title: string | ReactNode;
  /** Optional icon before title */
  titleIcon?: ReactNode;
  /** Children navigation items or nested groups */
  children: (NavItemConfig | NavGroupConfig)[];
  /** Condition to show this group */
  condition?: (language: string, buildType?: string) => boolean;
}

/**
 * Navigation configuration (either item or group)
 */
export type NavConfig = NavItemConfig | NavGroupConfig;
