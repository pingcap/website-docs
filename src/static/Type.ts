export type DocLeftNavItemContent = (
  | { code: boolean; value: string }
  | string
)[];

export interface DocLeftNavItem {
  content: DocLeftNavItemContent;
  link?: string;
  children?: DocLeftNavItem[];
  id: string;
}

export type DocLeftNav = DocLeftNavItem[];
