import { PlayCircleOutlineOutlined } from "@mui/icons-material";
import { Box, Button, Modal, Stack, Typography, useTheme } from "@mui/material";
import { useState } from "react";

interface IntroBannerProps {
  title: string;
  content: string;
  videoTitle: string;
  thumbnail: string;
}

export function IntroBanner({
  title,
  content,
  videoTitle,
  thumbnail,
  children,
}: React.PropsWithChildren<IntroBannerProps>) {
  const theme = useTheme();
  const [modalOpened, setModalOpened] = useState(false);
  const openModal = () => setModalOpened(true);
  const closeModal = () => {
    setModalOpened(false);
  };

  return (
    <>
      <Stack
        className="md-intro-banner"
        direction="row"
        sx={{
          background: "#4D4D4D",
          padding: "1.5rem",
          borderRadius: "12px",
          gap: "1.5rem",
          flexDirection: {
            xs: "column",
            md: "row",
          },
        }}
      >
        <Stack
          sx={{
            gap: "1rem",
            justifyContent: "center",
            alignItems: "flex-start",

            "& h1.md-intro-banner__title": {
              borderBottom: "0",
              color: "#fff",
              fontSize: "24px",
              fontWeight: "700",
              margin: "0",
              padding: "0",
            },

            "& div.md-intro-banner__content": {
              color: "#fff",
              fontSize: "14px",
            },
          }}
        >
          <Typography component="h1" variant="h1" className="md-intro-banner__title">
            {title}
          </Typography>
          <Typography component="div" variant="body1" className="md-intro-banner__content">
            {content}
          </Typography>
          <Button
            variant="outlined"
            startIcon={<PlayCircleOutlineOutlined />}
            onClick={openModal}
            sx={{
              fontWeight: 600,
              color: "#333333",
              backgroundColor: "#f1f1f1",
              borderColor: "transparent",
              ":hover": {
                backgroundColor: theme.palette.website.m4,
                borderColor: "transparent",
              },
            }}
          >
            {videoTitle}
          </Button>
        </Stack>
        <Stack
          sx={{
            width: '400px',
            maxWidth: "400px",
          }}
        >
          <Box
            component="img"
            src={thumbnail}
            alt={videoTitle}
            loading="lazy"
            onClick={openModal}
            sx={{ borderRadius: "8px", cursor: "pointer" }}
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
          }}
        >
          {children}
        </Box>
      </Modal>
    </>
  );
}

export function IntroBannerVideo({
  children,
}: React.PropsWithChildren<unknown>) {
  return <>{children}</>;
}
