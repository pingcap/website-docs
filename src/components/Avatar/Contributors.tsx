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

import { PathConfig } from "static/Type";
import { getRepo } from "../../../gatsby/path";

export interface TotalAvatarsProps {
  avatars: AvatarItem[];
}

export type AvatarItem = {
  src: string;
  alt: string;
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
    <>
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
              key={avatar.alt}
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
          <Typography
            variant="body1"
            component="div"
            color="#0A85C2"
            sx={{
              fontFamily: `-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"`,
            }}
          >
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
          <MenuItem>
            <Avatar
              key={`menuItem-${avatar.alt}`}
              src={avatar.src}
              alt={avatar.alt}
            />
            <Typography
              variant="body1"
              component="a"
              color="#0A85C2"
              href={avatar.pageUrl}
              target="_blank"
              sx={{
                textDecoration: "none",
                width: "100%",
                fontFamily: `-apple-system,BlinkMacSystemFont,"Segoe UI",Helvetica,Arial,sans-serif,"Apple Color Emoji","Segoe UI Emoji"`,
                color: "#24292f",
              }}
            >
              {avatar.name}
            </Typography>
          </MenuItem>
        ))}
      </Menu>
    </>
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
    const authorNameList: string[] = [];
    const authors = commits.reduce<AvatarItem[]>(
      (prev, commit): AvatarItem[] => {
        const {
          login,
          avatar_url,
          html_url,
        }: { login: string; avatar_url: string; html_url: string } =
          commit.author;
        const name = (commit?.commit?.author?.name as string) || login;
        if (!authorNameList.includes(name)) {
          authorNameList.push(name);
          prev.push({
            src: avatar_url,
            alt: login,
            name: name,
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
    if (totalContributors.length > 0) {
      // Create a new node(a sibling node after h1) to render the total contributors
      const mdTitleElement = document.querySelector(".markdown-body > h1");
      const contributorNode = document.createElement("div");
      try {
        const appendedNode = mdTitleElement?.parentElement?.insertBefore(
          contributorNode,
          mdTitleElement?.nextSibling
        );
        appendedNode &&
          ReactDOM.render(
            <TotalAvatars avatars={totalContributors} />,
            appendedNode
          );
      } catch (error) {}
    }
  }, [totalContributors]);

  return { totalContributors, loading };
};
