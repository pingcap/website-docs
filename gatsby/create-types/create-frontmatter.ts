import { CreatePagesArgs } from "gatsby";

export const createFrontmatter = ({ actions }: CreatePagesArgs) => {
  const { createTypes } = actions;

  const typeDefs = `
    """
    Markdown Node
    """
    type Mdx implements Node @dontInfer {
      frontmatter: Frontmatter
    }

    """
    Markdown Frontmatter
    """
    type Frontmatter {
      title: String!
      summary: String
      aliases: [String!]
      draft: Boolean
      hide_sidebar: Boolean
      hide_commit: Boolean
      hide_leftNav: Boolean
    }
  `;

  createTypes(typeDefs);
};
