import * as React from "react";
import Box from "@mui/material/Box";
import MuiTooltip from "@mui/material/Tooltip";
import { graphql, useStaticQuery } from "gatsby";
import { useI18next } from "gatsby-plugin-react-i18next";

import { Locale } from "shared/interface";

interface TooltipTermDefinition {
  en: string;
  zh: string;
  ja: string;
}

interface TooltipQueryData {
  allTooltipTerm: {
    nodes: {
      termId: string;
      definition: TooltipTermDefinition;
    }[];
  };
}

export const Tooltip = (props: {
  id: string;
  children: React.ReactNode;
}) => {
  const { id, children } = props;
  const { language } = useI18next();
  const data = useStaticQuery<TooltipQueryData>(graphql`
    query TooltipTermDefinitions {
      allTooltipTerm {
        nodes {
          termId
          definition {
            en
            zh
            ja
          }
        }
      }
    }
  `);

  const definitionsById = React.useMemo(() => {
    return data.allTooltipTerm.nodes.reduce<Record<string, TooltipTermDefinition>>(
      (acc, node) => {
        acc[node.termId] = node.definition;
        return acc;
      },
      {}
    );
  }, [data.allTooltipTerm.nodes]);

  const localizedDefinition =
    definitionsById[id]?.[language as Locale] ?? definitionsById[id]?.en;

  if (!localizedDefinition) {
    return <>{children}</>;
  }

  return (
    <MuiTooltip
      title={localizedDefinition}
      arrow
      enterDelay={100}
      placement="top"
      disableTouchListener
      componentsProps={{
        popper: {
          modifiers: [
            {
              name: "offset",
              options: {
                offset: [0, -6],
              },
            },
          ],
        },
        tooltip: {
          sx: (theme) => ({
            backgroundColor: theme.palette.carbon[800],
            color: theme.palette.carbon[50],
            fontSize: theme.typography.body2.fontSize,
            borderRadius: "6px",
          }),
        },
        arrow: {
          sx: (theme) => ({
            color: theme.palette.carbon[800],
          }),
        },
      }}
    >
      <Box
        component="span"
        tabIndex={0}
        sx={(theme) => ({
          textDecorationLine: "underline",
          textDecorationStyle: "dotted",
          textDecorationColor: theme.palette.carbon[700],
          textDecorationThickness: "1px",
          textUnderlineOffset: "4px",
          outline: "none",
          fontVariantLigatures: "none",
          "&:focus-visible": {
            textDecorationThickness: "1px",
          },
        })}
      >
        {children}
      </Box>
    </MuiTooltip>
  );
};
