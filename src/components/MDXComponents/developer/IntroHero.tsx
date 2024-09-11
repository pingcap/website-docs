import { PlayCircleOutlineOutlined } from "@mui/icons-material";
import { Box, Button, Modal, Stack, Typography, useTheme } from "@mui/material";
import { useState } from "react";
import TidbcloudIntroVideoThumbnail from "media/imgs/tidb-cloud-intro-video-thumbnail.svg";

interface IntroHeroProps {
  title: string;
  content: string;
  videoTitle: string;
  thumbnail?: string;
}

export function IntroHero({
  title,
  content,
  videoTitle,
  children,
}: React.PropsWithChildren<IntroHeroProps>) {
  const theme = useTheme();
  const [modalOpened, setModalOpened] = useState(false);
  const openModal = () => setModalOpened(true);
  const closeModal = () => {
    setModalOpened(false);
  };

  return (
    <>
      <Stack
        className="md-intro-hero"
        direction="row"
        sx={{
          backgroundColor: "carbon.200",
          padding: "1.5rem",
          gap: "1.5rem",
          flexDirection: {
            xs: "column",
            md: "row",
          },
        }}
      >
        <Stack
          sx={{
            minWidth: "304px",
            gap: "1rem",
            justifyContent: "center",
            alignItems: "flex-start",
            flex: 1,

            "& h1.md-intro-hero__title": {
              borderBottom: "0",
              color: "text.primary",
              fontSize: "24px",
              fontWeight: "700",
              margin: "0",
              padding: "0",
            },

            "& div.md-intro-hero__content": {
              color: "text.primary",
              fontSize: "14px",
            },
          }}
        >
          <Typography
            component="h1"
            variant="h1"
            className="md-intro-hero__title"
          >
            {title}
          </Typography>
          <Typography
            component="div"
            variant="body1"
            className="md-intro-hero__content"
          >
            {content}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<PlayCircleOutlineOutlined />}
            onClick={openModal}
            sx={{
              fontWeight: 600,
              color: "text.primary",
              backgroundColor: "website.m2",
              borderColor: "text.primary",
              ":hover": {
                backgroundColor: "website.m2",
                borderColor: "text.primary",
              },
            }}
          >
            {videoTitle}
          </Button>
        </Stack>
        <Stack
          alignItems="center"
          justifyContent="center"
          sx={{
            display: {
              xs: "none",
              md: 'flex',
            },
          }}
        >
          <Box
            component={TidbcloudIntroVideoThumbnail}
            aria-label={videoTitle}
            onClick={openModal}
            sx={{
              cursor: "pointer",
              maxHeight: "200px",
              width: "100%",
              height: "auto",
            }}
          />
        </Stack>
      </Stack>
      <Modal open={modalOpened} onClose={closeModal} aria-label={videoTitle}>
        <Box
          sx={{
            position: "absolute",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            outlineColor: 'transparent'
          }}
        >
          {children}
        </Box>
      </Modal>
    </>
  );
}

interface IntroHeroVideoProps {
  title: string;
  src: string;
}

export function IntroHeroVideo({ title, src }: IntroHeroVideoProps) {
  return (
    <Box
      component="iframe"
      width={800}
      height={450}
      src={src}
      title={title}
      frameBorder="0"
      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
      referrerPolicy="strict-origin-when-cross-origin"
      allowFullScreen
      tabIndex={-1}
      sx={{
        maxWidth: "100vw",
        maxHeight: "100vh",
      }}
    />
  );
}
