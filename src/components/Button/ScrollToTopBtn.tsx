import * as React from "react";
import Box from "@mui/material/Box";
import Fab from "@mui/material/Fab";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import { useTheme } from "@mui/material/styles";
import { useI18next } from "gatsby-plugin-react-i18next";

export default function ScrollToTopBtn() {
  const theme = useTheme();
  const { t } = useI18next();
  const [show, setShow] = React.useState(false);
  const previousScrollYRef = React.useRef(0);
  const showRef = React.useRef(false);

  React.useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    let ticking = false;
    let rafId: number | null = null;
    previousScrollYRef.current = window.scrollY || 0;

    const updateVisibility = () => {
      const currentScrollY = window.scrollY || 0;
      const isScrollingUp = currentScrollY < previousScrollYRef.current;
      const shouldShow = isScrollingUp && currentScrollY > 320;

      previousScrollYRef.current = currentScrollY;
      if (shouldShow !== showRef.current) {
        showRef.current = shouldShow;
        setShow(shouldShow);
      }

      ticking = false;
    };

    const onScroll = () => {
      if (ticking) {
        return;
      }

      ticking = true;
      rafId = window.requestAnimationFrame(updateVisibility);
    };

    window.addEventListener("scroll", onScroll, { passive: true });

    return () => {
      if (rafId != null) {
        window.cancelAnimationFrame(rafId);
      }
      window.removeEventListener("scroll", onScroll);
    };
  }, []);

  const handleClick = () => {
    if (typeof window === "undefined") {
      return;
    }

    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  return (
    <Box
      sx={{
        display: show ? "block" : "none",
      }}
    >
      <Fab
        id="scroll-to-top"
        size="medium"
        aria-label={t("fab.scrollToTop")}
        disableRipple
        variant="extended"
        sx={{
          color: theme.palette.carbon[50],
          backgroundColor: theme.palette.carbon[900],
          borderRadius: "999px",
          minHeight: "44px",
          paddingInline: "16px",
          gap: "8px",
          boxShadow: "0 10px 30px rgba(30, 36, 38, 0.16)",
          border: `1px solid ${theme.palette.carbon[800]}`,
          fontSize: "0.875rem",
          fontWeight: 600,
          "&:hover": {
            backgroundColor: theme.palette.peacock[800],
            borderColor: theme.palette.peacock[800],
          },
        }}
        onClick={handleClick}
      >
        <VerticalAlignTopIcon fontSize="small" />
        {t("fab.scrollToTop")}
      </Fab>
    </Box>
  );
}
