import * as React from "react";
import Box from "@mui/material/Box";
import IconButton from "@mui/material/IconButton";
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
        position: "fixed",
        right: {
          xs: "0.75rem",
          md: "1rem",
        },
        bottom: {
          xs: "1.5rem",
          md: "2.5rem",
        },
        zIndex: 10,
        display: show ? "block" : "none",
      }}
    >
      <IconButton
        id="scroll-to-top"
        aria-label={t("fab.scrollToTop")}
        sx={{
          width: "52px",
          height: "52px",
          color: theme.palette.carbon[900],
          backgroundColor: "rgba(255, 255, 255, 0.94)",
          border: `1px solid ${theme.palette.carbon[400]}`,
          borderRadius: "999px",
          boxShadow: "0 8px 24px rgba(30, 36, 38, 0.08)",
          backdropFilter: "blur(8px)",
          "&:hover": {
            backgroundColor: theme.palette.peacock[50],
            borderColor: theme.palette.peacock[500],
          },
          "&::before": {
            content: '""',
            position: "absolute",
            width: "14px",
            height: "14px",
            borderLeft: `2px solid ${theme.palette.carbon[900]}`,
            borderTop: `2px solid ${theme.palette.carbon[900]}`,
            transform: "translateY(-3px) rotate(45deg)",
          },
          "&::after": {
            content: '""',
            position: "absolute",
            width: "2px",
            height: "18px",
            backgroundColor: theme.palette.carbon[900],
            borderRadius: "999px",
            transform: "translateY(4px)",
          },
        }}
        onClick={handleClick}
      />
    </Box>
  );
}
