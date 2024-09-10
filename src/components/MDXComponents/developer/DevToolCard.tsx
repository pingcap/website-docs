import {
  Avatar,
  Box,
  Button,
  Card,
  CardActionArea,
  CardActions,
  CardContent,
  CardHeader,
  Divider,
  Typography,
} from "@mui/material";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import GitHubIcon from "@mui/icons-material/GitHub";
import { Link } from "gatsby";
import { Logo, logoSrc } from "./logo";

interface DevToolCardProps {
  logo: Logo;
  title: string;
  docLink: string;
  githubLink?: string;
}

export function DevToolCard({
  children,
  logo,
  title,
  docLink,
  githubLink,
}: React.PropsWithChildren<DevToolCardProps>) {
  return (
    <Card
      variant="outlined"
      sx={{
        minWidth: "240px",
        maxWidth: "256px",
        borderRadius: "8px",
        borderColor: '#ededed',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'stretch',
        "> a.MuiCardActionArea-root:hover, a.MuiButton-text:hover": {
          textDecoration: "none",
        },
        ".MuiCardActions-root > a.MuiButton-text": {
          color: "#4a4a4a",
          borderRadius: "8px",
        },
      }}
    >
      <CardActionArea
        component={Link}
        to={docLink}
        disableRipple
        disableTouchRipple
        draggable="false"
        sx={{
          flex: 1,
          "> .MuiCardActionArea-focusHighlight": {
            display: "none",
          },
        }}
      >
        <CardHeader
          avatar={
            <Avatar
              aria-label={`${title} logo`}
              sx={{
                width: "36px",
                height: "36px",
                backgroundColor: 'transparent',
                borderRadius: 0
              }}
            >
              <Box
                component="img"
                src={logoSrc[logo]}
                alt={title}
                loading="lazy"
                maxHeight={36}
              />
            </Avatar>
          }
          title={title}
          titleTypographyProps={{
            sx: {
              fontSize: 14,
              fontWeight: 600,
              color: "website.f1",
              userSelect: "text",
            },
          }}
          sx={{ pb: 0 }}
        />
        <CardContent
          sx={{
            flex: 1,
            py: 0,
            pl: "68px",
            userSelect: "text",
          }}
        >
          <Typography component="div" variant="body2" color="#4a4a4a">
            {children}
          </Typography>
        </CardContent>
      </CardActionArea>
      {githubLink && (
        <>
          <Divider component="div" aria-hidden="true" sx={{ borderColor: '#ededed', opacity: 0.8 }} />
          <CardActions
          sx={{
            pl: "52px",
            justifyContent: "space-evenly",
          }}
        >
          <Button
            variant="text"
            component={Link}
            to={docLink}
            disableRipple
            disableTouchRipple
            startIcon={<DescriptionOutlinedIcon />}
          >
            Guide
          </Button>
          <Button
            variant="text"
            component="a"
            href={githubLink}
            target="_blank"
            rel="noopener noreferrer"
            disableRipple
            disableTouchRipple
            startIcon={<GitHubIcon />}
          >
            GitHub
          </Button>
        </CardActions>
        </>
      )}
    </Card>
  );
}
