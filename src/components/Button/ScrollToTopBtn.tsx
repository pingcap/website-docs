import * as React from "react";
import { Trans } from "gatsby-plugin-react-i18next";
import Fab from "@mui/material/Fab";
import VerticalAlignTopIcon from "@mui/icons-material/VerticalAlignTop";
import Tooltip from "@mui/material/Tooltip";

export default function ScrollToTopBtn() {
  const [show, setShow] = React.useState(false);

  const setShowThrottle = (isShow: boolean) => {
    if (isShow === show) {
      return;
    }
    setShow(isShow);
  };

  React.useEffect(() => {
    function scrollFunction() {
      if (
        document.body.scrollTop > 200 ||
        document.documentElement.scrollTop > 200
      ) {
        setShowThrottle(true);
      } else {
        setShowThrottle(false);
      }
    }
    window.onscroll = function () {
      scrollFunction();
    };
    return () => {
      window.onscroll = () => {};
    };
  });

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    typeof window !== "undefined" && window.scrollTo(0, 0);
  };

  return (
    <Fab
      id="scroll-to-top"
      size="small"
      aria-label="scroll-to-top"
      disableRipple
      variant="extended"
      sx={{
        display: show ? "flex" : "none",
        color: "website.f2",
        backgroundColor: "#eff4f7",
        borderRadius: "0.5rem",
        height: "2rem",
        width: "2rem",
        boxShadow: "none",
        "&:hover": {
          color: "website.m1",
          backgroundColor: "website.k1",
        },
      }}
      onClick={handleClick}
    >
      <VerticalAlignTopIcon />
    </Fab>
  );
}
