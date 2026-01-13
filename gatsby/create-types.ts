import { CreatePagesArgs } from "gatsby";
import { generateConfig } from "./path";
import { mdxAstToToc } from "./toc";
import { Root, List } from "mdast";

export const createExtraType = ({ actions }: CreatePagesArgs) => {
  const { createTypes, createFieldExtension } = actions;

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

  createFieldExtension({
    name: "navigation",
    extend() {
      return {
        async resolve(
          mdxNode: any,
          args: unknown,
          context: unknown,
          info: any
        ) {
          if (mdxNode.nav) return mdxNode.nav;
          const types = info.schema.getType("Mdx").getFields();
          const slug = await types["slug"].resolve(mdxNode, args, context, {
            fieldName: "slug",
          });

          const mdxAST: Root = await types["mdxAST"].resolve(
            mdxNode,
            args,
            context,
            {
              fieldName: "mdxAST",
            }
          );

          if (!slug.endsWith("TOC"))
            throw new Error(`unsupported query in ${slug}`);
          const { config } = generateConfig(slug);
          const res = mdxAstToToc(mdxAST.children, slug, undefined, true);
          mdxNode.nav = res;
          return res;
        },
      };
    },
  });

  createFieldExtension({
    name: "starterNavigation",
    extend() {
      return {
        async resolve(
          mdxNode: any,
          args: unknown,
          context: unknown,
          info: any
        ) {
          if (mdxNode.starterNav) return mdxNode.starterNav;
          const types = info.schema.getType("Mdx").getFields();
          const slug = await types["slug"].resolve(mdxNode, args, context, {
            fieldName: "slug",
          });

          const mdxAST: Root = await types["mdxAST"].resolve(
            mdxNode,
            args,
            context,
            {
              fieldName: "mdxAST",
            }
          );

          if (!slug.endsWith("TOC-tidb-cloud-starter"))
            throw new Error(`unsupported query in ${slug}`);
          const { config } = generateConfig(slug);
          const res = mdxAstToToc(mdxAST.children, slug, undefined, true);
          mdxNode.starterNav = res;
          return res;
        },
      };
    },
  });

  createFieldExtension({
    name: "essentialNavigation",
    extend() {
      return {
        async resolve(
          mdxNode: any,
          args: unknown,
          context: unknown,
          info: any
        ) {
          if (mdxNode.essentialNav) return mdxNode.essentialNav;
          const types = info.schema.getType("Mdx").getFields();
          const slug = await types["slug"].resolve(mdxNode, args, context, {
            fieldName: "slug",
          });

          const mdxAST: Root = await types["mdxAST"].resolve(
            mdxNode,
            args,
            context,
            {
              fieldName: "mdxAST",
            }
          );

          if (!slug.endsWith("TOC-tidb-cloud-essential"))
            throw new Error(`unsupported query in ${slug}`);
          const { config } = generateConfig(slug);
          const res = mdxAstToToc(mdxAST.children, slug, undefined, true);
          mdxNode.essentialNav = res;
          return res;
        },
      };
    },
  });

  createTypes(`
    type Mdx implements Node {
      navigation: JSON! @navigation
      starterNavigation: JSON! @starterNavigation
      essentialNavigation: JSON! @essentialNavigation
    }
  `);
};
