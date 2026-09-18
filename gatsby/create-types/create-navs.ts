import { CreatePagesArgs } from "gatsby";
import { mdxAstToToc } from "../toc";
import { Root } from "mdast";
import { calculateFileUrl } from "../url-resolver";

export const createNavs = ({ actions }: CreatePagesArgs) => {
  const { createTypes, createFieldExtension } = actions;

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

          const tocPath = calculateFileUrl(slug);
          const res = mdxAstToToc(
            mdxAST.children,
            tocPath || slug,
            undefined,
            true
          );
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
          const tocPath = calculateFileUrl(slug);
          const res = mdxAstToToc(
            mdxAST.children,
            tocPath || slug,
            undefined,
            true
          );
          mdxNode.starterNav = res;
          return res;
        },
      };
    },
  });

  createFieldExtension({
    name: "starterPostgresqlNavigation",
    extend() {
      return {
        async resolve(
          mdxNode: any,
          args: unknown,
          context: unknown,
          info: any
        ) {
          if (mdxNode.starterPostgresqlNav) return mdxNode.starterPostgresqlNav;
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

          if (!slug.endsWith("TOC-tidb-cloud-starter-postgresql"))
            throw new Error(`unsupported query in ${slug}`);
          const tocPath = calculateFileUrl(slug);
          const res = mdxAstToToc(
            mdxAST.children,
            tocPath || slug,
            undefined,
            true
          );
          mdxNode.starterPostgresqlNav = res;
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
          const tocPath = calculateFileUrl(slug);
          const res = mdxAstToToc(
            mdxAST.children,
            tocPath || slug,
            undefined,
            true
          );
          mdxNode.essentialNav = res;
          return res;
        },
      };
    },
  });

  createFieldExtension({
    name: "premiumNavigation",
    extend() {
      return {
        async resolve(
          mdxNode: any,
          args: unknown,
          context: unknown,
          info: any
        ) {
          if (mdxNode.premiumNav) return mdxNode.premiumNav;
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

          if (!slug.endsWith("TOC-tidb-cloud-premium"))
            throw new Error(`unsupported query in ${slug}`);
          const tocPath = calculateFileUrl(slug);
          const res = mdxAstToToc(
            mdxAST.children,
            tocPath || slug,
            undefined,
            true
          );
          mdxNode.premiumNav = res;
          return res;
        },
      };
    },
  });

  createTypes(`
    type Mdx implements Node {
      navigation: JSON! @navigation
      starterNavigation: JSON! @starterNavigation
      starterPostgresqlNavigation: JSON! @starterPostgresqlNavigation
      essentialNavigation: JSON! @essentialNavigation
      premiumNavigation: JSON! @premiumNavigation
    }
  `);
};
