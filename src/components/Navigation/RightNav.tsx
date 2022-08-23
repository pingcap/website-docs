import * as React from "react";
import Box from "@mui/material/Box";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import InboxIcon from "@mui/icons-material/Inbox";
import DraftsIcon from "@mui/icons-material/Drafts";
import Typography from "@mui/material/Typography";
import { useTheme } from "@mui/material/styles";

import { TableOfContent } from "static/Type";
import LinkComponent from "components/Link";

export default function RightNav(props: { toc: TableOfContent[] }) {
  const { toc } = props;
  return (
    <>
      <Box
        sx={{
          position: "sticky",
          top: "6rem",
          height: "100%",
          maxHeight: "calc(100vh - 8rem)",
          overflowY: "auto",
          padding: "1rem",
        }}
      >
        <Box component="nav" aria-label="toc">
          {generateToc(toc)}
        </Box>
      </Box>
    </>
  );
}

const generateToc = (items: TableOfContent[], level = 0) => {
  const theme = useTheme();

  return (
    <Typography
      component="ul"
      sx={{
        listStyle: "none",
        padding: 0,
      }}
    >
      {items.map((item) => {
        return (
          <Typography key={`${level}-${item.title}`} component="li">
            <Typography
              component="a"
              href={item.url}
              sx={{
                display: "flex",
                textDecoration: "none",
                fontSize: "13px",
                borderLeft: `1px solid transparent`,
                paddingLeft: `${0.5 * (level + 1)}rem`,
                "&:hover": {
                  color: theme.palette.website.f3,
                  borderLeft: `1px solid ${theme.palette.website.f3}`,
                },
              }}
            >
              {item.title}
            </Typography>
            {item.items && generateToc(item.items, level + 1)}
          </Typography>
        );
      })}
    </Typography>
  );
};
