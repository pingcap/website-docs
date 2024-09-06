import * as React from "react";
import { Trans } from "gatsby-plugin-react-i18next";
import axios from "axios";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";

import { Locale, PathConfig } from "shared/interface";
import { getRepo } from "../../../gatsby/path";
import { docs } from "../../../docs/docs.json";

interface GitCommitInfoCardProps {
  pathConfig: PathConfig;
  title: string;
  filePath: string;
}

export default function GitCommitInfoCard(props: GitCommitInfoCardProps) {
  const { pathConfig, title, filePath } = props;
  const [latestCommit, setLatestCommit] = React.useState(null as any);

  if (pathConfig.repo === "tidbcloud") {
    const cloudConfig = docs[pathConfig.repo];
    const targetTidbBranch = cloudConfig.target;
    pathConfig.branch = targetTidbBranch;
  }
  if (pathConfig.locale === "ja") {
    pathConfig.locale = Locale.en;
  }
  const repo = React.useMemo(() => getRepo(pathConfig), [pathConfig]);

  React.useEffect(() => {
    async function fetchLatestCommit() {
      try {
        const res = (
          await axios.get(`https://api.github.com/repos/${repo}/commits`, {
            params: {
              sha: pathConfig.branch,
              path: filePath,
              per_page: 1,
            },
          })
        ).data[0];

        setLatestCommit(res);
      } catch (err) {
        // TODO: perform error handling
      }
    }

    fetchLatestCommit();
  }, [pathConfig, filePath]);

  return (
    <>
      {latestCommit ? (
        <Box
          sx={{
            margin: "1.5rem 0",
            padding: "1rem",
            backgroundColor: "carbon.200",
          }}
        >
          <Typography
            variant="body1"
            component="a"
            href={`https://github.com/${repo}/blob/${pathConfig.branch}/${filePath}`}
            target="_blank"
            rel="noreferrer"
            color="secondary"
            sx={{
              textDecoration: "none",
              fontSize: "0.875rem",
              lineHeight: "1.75",
            }}
          >
            {title}
          </Typography>
          <Typography
            variant="body1"
            component="span"
            sx={{
              paddingLeft: "0.5rem",
              paddingRight: "0.5rem",
              fontSize: "0.875rem",
              lineHeight: "1.75",
            }}
          >
            <Trans i18nKey="doc.latestCommit" />
            {` ${new Date(latestCommit.commit.author.date).toLocaleString()}: `}
          </Typography>
          <Typography
            variant="body1"
            component="a"
            href={latestCommit.html_url}
            target="_blank"
            rel="noreferrer"
            color="secondary"
            sx={{
              textDecoration: "none",
              fontSize: "0.875rem",
              lineHeight: "1.75",
            }}
          >
            {latestCommit.commit.message.split("\n")[0]}
          </Typography>
        </Box>
      ) : (
        <></>
      )}
    </>
  );
}
