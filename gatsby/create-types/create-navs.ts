import { CreatePagesArgs } from "gatsby";
import { mdxAstToToc } from "../toc";
import { Root } from "mdast";
import { calculateFileUrl } from "../url-resolver";

function createCloudPlanNavigationField(cacheKey: string, tocSuffix: string) {
  return {
    async resolve(mdxNode: any, args: unknown, context: unknown, info: any) {
      if (mdxNode[cacheKey]) return mdxNode[cacheKey];
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

      if (!slug.endsWith(tocSuffix))
        throw new Error(`unsupported query in ${slug}`);
      const tocPath = calculateFileUrl(slug);
      const res = mdxAstToToc(
        mdxAST.children,
        tocPath || slug,
        undefined,
        true
      );
      mdxNode[cacheKey] = res;
      return res;
    },
  };
}

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
      return createCloudPlanNavigationField(
        "starterNav",
        "TOC-tidb-cloud-starter"
      );
    },
  });

  createFieldExtension({
    name: "essentialNavigation",
    extend() {
      return createCloudPlanNavigationField(
        "essentialNav",
        "TOC-tidb-cloud-essential"
      );
    },
  });

  createFieldExtension({
    name: "byocNavigation",
    extend() {
      return createCloudPlanNavigationField("byocNav", "TOC-tidb-cloud-byoc");
    },
  });

  createTypes(`
    type Mdx implements Node {
      navigation: JSON! @navigation
      starterNavigation: JSON! @starterNavigation
      essentialNavigation: JSON! @essentialNavigation
      byocNavigation: JSON! @byocNavigation
    }
  `);
};
