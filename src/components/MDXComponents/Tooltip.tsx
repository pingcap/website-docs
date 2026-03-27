import * as React from "react";
import Box from "@mui/material/Box";
import ClickAwayListener from "@mui/material/ClickAwayListener";
import MuiTooltip from "@mui/material/Tooltip";
import useMediaQuery from "@mui/material/useMediaQuery";
import { useI18next } from "gatsby-plugin-react-i18next";
import tooltipTerms from "../../../docs/tooltip-terms.json";

import { Locale } from "shared/interface";

interface TooltipTermDefinition {
  en: string;
  zh: string;
  ja: string;
}

interface TooltipTerm {
  id: string;
  definition: TooltipTermDefinition;
}

const definitionsById = (tooltipTerms as TooltipTerm[]).reduce<
  Record<string, TooltipTermDefinition>
>((acc, term) => {
  acc[term.id] = term.definition;
  return acc;
}, {});

export const Tooltip = (props: {
  id: string;
  children: React.ReactNode;
}) => {
  const { id, children } = props;
  const { language } = useI18next();
  const isTouchDevice = useMediaQuery("(hover: none) and (pointer: coarse)", {
    noSsr: true,
  });
  const [isTouchTooltipOpen, setIsTouchTooltipOpen] = React.useState(false);

  const localizedDefinition =
    definitionsById[id]?.[language as Locale] ?? definitionsById[id]?.en;

  if (!localizedDefinition) {
    return <>{children}</>;
  }

  const handleTouchTooltipToggle = (
    event: React.MouseEvent<HTMLSpanElement>
  ) => {
    if (!isTouchDevice) {
      return;
    }

    event.preventDefault();
    setIsTouchTooltipOpen((open) => !open);
  };

  const handleTouchTooltipKeyDown = (
    event: React.KeyboardEvent<HTMLSpanElement>
  ) => {
    if (event.key === "Escape") {
      setIsTouchTooltipOpen(false);
      return;
    }

    if (!isTouchDevice || (event.key !== "Enter" && event.key !== " ")) {
      return;
    }

    event.preventDefault();
    setIsTouchTooltipOpen((open) => !open);
  };

  const handleTouchTooltipClose = () => {
    setIsTouchTooltipOpen(false);
  };

  return (
    <ClickAwayListener onClickAway={handleTouchTooltipClose}>
      <Box component="span" sx={{ display: "inline" }}>
        <MuiTooltip
          title={localizedDefinition}
          arrow
          enterDelay={100}
          placement="top"
          open={isTouchDevice ? isTouchTooltipOpen : undefined}
          disableHoverListener={isTouchDevice}
          disableFocusListener={isTouchDevice}
          disableTouchListener
          onClose={handleTouchTooltipClose}
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
                padding: "8px 12px",
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.body2.fontSize,
                fontWeight: theme.typography.body2.fontWeight,
                fontStyle: theme.typography.body2.fontStyle,
                lineHeight: theme.typography.body2.lineHeight,
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
            onClick={handleTouchTooltipToggle}
            onKeyDown={handleTouchTooltipKeyDown}
            sx={(theme) => ({
              textDecorationLine: "underline",
              textDecorationStyle: "dotted",
              textDecorationColor: theme.palette.carbon[700],
              textDecorationThickness: "1px",
              textUnderlineOffset: "4px",
              outline: "none",
              fontVariantLigatures: "none",
              "&:focus-visible": {
                outline: `2px solid ${theme.palette.carbon[700]}`,
                outlineOffset: "2px",
                textDecorationThickness: "2px",
                textDecorationColor: theme.palette.carbon[900],
              },
            })}
          >
            {children}
          </Box>
        </MuiTooltip>
      </Box>
    </ClickAwayListener>
  );
};
