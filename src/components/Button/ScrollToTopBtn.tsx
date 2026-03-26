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
        display: show ? "block" : "none",
      }}
    >
      <IconButton
        id="scroll-to-top"
        aria-label={t("fab.scrollToTop")}
        sx={{
          width: "56px",
          height: "56px",
          color: theme.palette.carbon[900],
          backgroundColor: theme.palette.carbon[50],
          border: `1.5px solid ${theme.palette.carbon[400]}`,
          borderRadius: "999px",
          boxShadow: "0 8px 24px rgba(30, 36, 38, 0.06)",
          "&:hover": {
            backgroundColor: theme.palette.peacock[50],
            borderColor: theme.palette.peacock[500],
          },
        }}
        onClick={handleClick}
      >
        <Box
          sx={{
            position: "relative",
            width: "30px",
            height: "30px",
          }}
        >
          <Box
            sx={{
              position: "absolute",
              top: "2px",
              left: "50%",
              width: "22px",
              height: "3px",
              borderRadius: "999px",
              backgroundColor: theme.palette.carbon[900],
              transform: "translateX(-50%)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "10px",
              width: "4px",
              height: "18px",
              borderRadius: "999px",
              backgroundColor: theme.palette.carbon[900],
              transform: "translateX(-50%)",
            }}
          />
          <Box
            sx={{
              position: "absolute",
              left: "50%",
              top: "11px",
              width: "14px",
              height: "14px",
              borderTop: `3px solid ${theme.palette.carbon[900]}`,
              borderLeft: `3px solid ${theme.palette.carbon[900]}`,
              transform: "translateX(-50%) rotate(45deg)",
              transformOrigin: "center",
            }}
          />
        </Box>
      </IconButton>
    </Box>
  );
}
