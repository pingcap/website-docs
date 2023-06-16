import * as React from "react";
import { graphql, Link } from "gatsby";
import Box from "@mui/material/Box";

import Seo from "components/Layout/Seo";
import Layout from "components/Layout";
import type { Locale, Repo, BuildType } from "../static/Type";

declare const Redoc: any;

async function loadScript(scriptSrc: string) {
  return new Promise((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "text/javascript";
    script.src = scriptSrc;
    script.async = true;
    script.onload = resolve;
    script.onerror = reject;
    document.head.appendChild(script);
  });
}

function loadLink(href: string) {
  const link = document.createElement("link");
  link.type = "text/css";
  link.href = href;
  link.rel = "stylesheet";
  document.head.appendChild(link);
}

interface APIReferenceTemplateProps {
  pageContext: {
    id: string;
    pathname: string;
    production: string;
    preview: string;
    isProduction: boolean;
    availIn: { locale: Locale[]; version: string[] };
    buildType: BuildType;
  };
  data?: { [key: string]: any };
}

export default function APIReferenceTemplate({
  pageContext: {
    production,
    preview,
    isProduction,
    pathname,
    availIn,
    buildType,
  },
  data,
}: APIReferenceTemplateProps) {
  const specUrl = isProduction ? production : preview;

  React.useEffect(() => {
    async function setupRedoc() {
      if (typeof Redoc === "undefined")
        await loadScript(
          "https://cdn.redoc.ly/redoc/latest/bundles/redoc.standalone.js"
        );

      loadLink(
        `https://fonts.googleapis.com/css?family=Montserrat:300,400,700|Roboto:300,400,700`
      );

      // https://redocly.com/docs/api-reference-docs/configuration/functionality/
      Redoc.init(
        specUrl,
        { schemaExpansionLevel: 3 },
        document.getElementById("redoc-container")
      );
    }

    setupRedoc();
  });

  return (
    <>
      <Layout
        locales={availIn.locale}
        // menu={null}
        // docInfo={{
        //   version: pathConfig.version || "stable",
        //   type: pathConfig.repo,
        // }}
        buildType={buildType}
      >
        <Seo
          title="TiDB Cloud API"
          description="The TiDB Cloud API is a REST interface that provides you with programmatic access to manage administrative objects within TiDB Cloud."
          meta={[
            {
              name: "doc:lang",
              content: "en",
            },
            {
              name: "doc:version",
              content: pathname,
            },
          ]}
        />
        <Box sx={{ marginTop: "5rem", width: "100%" }}>
          <Box id="redoc-container" data-testid="redoc-container" />
        </Box>
      </Layout>
    </>
  );
}

export const query = graphql`
  query ($language: String!) {
    locales: allLocale(filter: { language: { eq: $language } }) {
      edges {
        node {
          ns
          data
          language
        }
      }
    }
  }
`;
