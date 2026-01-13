import { BuildType } from "../../src/shared/interface";

export const DEFAULT_BUILD_TYPE: BuildType = "prod";

export interface PageQueryData {
  allMdx: {
    nodes: {
      id: string;
      frontmatter: { aliases: string[] };
      slug: string;
      parent: {
        fileAbsolutePath: string;
        relativePath: string;
      } | null;
    }[];
  };
}
