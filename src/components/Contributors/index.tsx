import * as React from "react";
import * as ReactDOM from "react-dom";
import axios from "axios";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import Button from "@mui/material/Button";

import { PathConfig } from "shared/interface";
import { getRepo } from "../../../gatsby/path";
import { ThemeProvider } from "@mui/material";
import theme from "theme/index";
import { Link } from "gatsby";

export interface TotalAvatarsProps {
  avatars: AvatarItem[];
}

export type AvatarItem = {
  src: string;
  alt: string;
  id: string;
  name: string;
  pageUrl: string;
};

export default function TotalAvatars(props: TotalAvatarsProps) {
  const { avatars } = props;
  const [anchorEl, setAnchorEl] = React.useState<null | HTMLElement>(null);

  const open = Boolean(anchorEl);
  const handleClick = (event: React.MouseEvent<HTMLElement>) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  return (
    <ThemeProvider theme={theme}>
      <Stack
        direction="row"
        alignItems="center"
        spacing={2}
        sx={{
          paddingBottom: "1rem",
        }}
      >
        <AvatarGroup
          total={avatars.length}
          sx={{
            "& .MuiAvatar-root": {
              width: "1.5rem",
              height: "1.5rem",
              fontSize: "0.75rem",
            },
          }}
        >
          {avatars.map((avatar, index) => (
            <Avatar
              key={avatar.id}
              src={avatar.src}
              alt={avatar.alt}
              sx={{ width: 24, height: 24 }}
            />
          ))}
        </AvatarGroup>
        <Button
          variant="text"
          size="small"
          onClick={handleClick}
          aria-controls={open ? "contributor-menu" : undefined}
          aria-haspopup="true"
          aria-expanded={open ? "true" : undefined}
          sx={{
            textTransform: "none",
          }}
        >
          <Typography variant="body1" component="div" color="secondary">
            {`${avatars.length} ${
              avatars.length === 1 ? "Contributor" : "Contributors"
            }`}
          </Typography>
        </Button>
      </Stack>
      <Menu
        anchorEl={anchorEl}
        id="account-menu"
        open={open}
        onClose={handleClose}
        onClick={handleClose}
        PaperProps={{
          elevation: 0,
          sx: {
            overflow: "visible",
            filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
            mt: 1.5,
            "& .MuiAvatar-root": {
              width: 24,
              height: 24,
              ml: -0.5,
              mr: 1,
            },
            "&:before": {
              content: '""',
              display: "block",
              position: "absolute",
              top: 0,
              right: 14,
              width: 10,
              height: 10,
              bgcolor: "background.paper",
              transform: "translateY(-50%) rotate(45deg)",
              zIndex: 0,
            },
          },
        }}
        transformOrigin={{ horizontal: "right", vertical: "top" }}
        anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
      >
        {avatars.map((avatar) => (
          <Link
            to={avatar.pageUrl}
            target="_blank"
            key={`menuItem-${avatar.alt}`}
            style={{ textDecoration: "none" }}
          >
            <MenuItem>
              <Avatar src={avatar.src} alt={avatar.alt} />
              <Typography variant="body1">{avatar.name}</Typography>
            </MenuItem>
          </Link>
        ))}
      </Menu>
    </ThemeProvider>
  );
}

export const useTotalContributors = (
  pathConfig: PathConfig,
  filePath: string
) => {
  const [totalContributors, setTotalContributors] = React.useState<
    AvatarItem[]
  >([]);
  const [loading, setLoading] = React.useState(true);

  const repo = React.useMemo(() => getRepo(pathConfig), [pathConfig]);

  const filterCommitAuthors = (commits: any[]) => {
    // const authors: AvatarItem[] = [];
    const authorLoginList: string[] = [];
    const authors = commits.reduce<AvatarItem[]>(
      (prev, commit): AvatarItem[] => {
        if (!commit.author) {
          return prev;
        }

        const {
          login,
          avatar_url,
          html_url,
        }: { login: string; avatar_url: string; html_url: string } =
          commit.author;

        if (login === "ti-chi-bot") {
          return prev;
        }

        if (!authorLoginList.includes(login)) {
          authorLoginList.push(login);
          prev.push({
            id: login,
            src: avatar_url,
            alt: login,
            name: commit?.commit?.author?.name || login,
            pageUrl: html_url,
          });
        }
        return prev;
      },
      []
    );
    return authors;
  };

  React.useEffect(() => {
    async function fetchLatestCommit() {
      try {
        setLoading(true);
        const res = (
          await axios.get(`https://api.github.com/repos/${repo}/commits`, {
            params: {
              sha: pathConfig.branch,
              path: filePath,
            },
          })
        ).data;

        const results = filterCommitAuthors(res);

        setTotalContributors(results);
      } catch (err) {
        // TODO: perform error handling
        console.error(`useTotalContributors`, err);
      } finally {
        setLoading(false);
      }
    }
    pathConfig && filePath && fetchLatestCommit();
  }, [pathConfig, filePath]);

  React.useEffect(() => {
    // Create a new node(a sibling node after h1) to render the total contributors
    const mdTitleElement = document.querySelector(".markdown-body > h1");
    const contributorNode = document.createElement("div");
    const appendedNode = mdTitleElement?.parentElement?.insertBefore(
      contributorNode,
      mdTitleElement?.nextSibling
    );

    if (!!totalContributors.length) {
      try {
        appendedNode &&
          ReactDOM.render(
            <TotalAvatars avatars={totalContributors} />,
            appendedNode
          );
      } catch (error) {}
    }

    return () => {
      if (!appendedNode) {
        return;
      }
      ReactDOM.unmountComponentAtNode(appendedNode);
      appendedNode?.parentNode?.removeChild(appendedNode);
    };
  }, [totalContributors]);

  return { totalContributors, loading };
};
