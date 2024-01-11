import { Box, Fade, IconButton, Tooltip } from "@mui/material";

import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FullscreenIcon  from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

import React, {
    JSXElementConstructor,
    ReactNode,
    PropsWithChildren,
    ReactElement,
    useRef,
    useState,
    useEffect,
  } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type ImageZoomableWrapperProps = PropsWithChildren<{
  src: string;
  alt: string;
}>

export const ImageZoomable: React.FC<ImageZoomableWrapperProps> = ({ src, alt }) => {
  
  const [isFullscreen, toggleFullScreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const ImageZoomableRef = useRef<HTMLDivElement>(null);
  const contextIconSize = isFullscreen ? ("large") : ("small");
  var contextCursor = isDragging ? ("grabbing") : ("grab");

  const fullscreen = () => {
    if (ImageZoomableRef.current) {
      if (isFullscreen) {
        document.exitFullscreen();
      } else {
        ImageZoomableRef.current.requestFullscreen()
          .catch((err) => {
            console.error(`Error in enabling fullscreen mode: ${err.message}`);
          });
      }
    }

    toggleFullScreen(!isFullscreen)
  }
  
  return (
    <Box
      className="ImageZoomableContainer"
      ref={ImageZoomableRef}
      onMouseEnter={() => {
        contextCursor = "grab";
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        setIsHovered(false);
      }}
      onMouseDown={() => {
        setIsDragging(true);
        contextCursor = "grabbing";
      }}
      onMouseUp={() => {
        setIsDragging(false);
        contextCursor = "grab";
      }}
      >
      <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <React.Fragment>
            <Fade in={isHovered}>
              <Box
                sx={{
                  position: 'absolute',
                  float: 'left',
                  zIndex: 99,
                  backgroundColor: 'white',
                  borderRadius: 18,
                }}>
                <IconButton
                  aria-label='btn-zoomin'
                  onClick={() => zoomIn()}
                >
                  <ZoomInIcon fontSize={contextIconSize}/>
                </IconButton>
                <IconButton
                  aria-label='btn-zoomout'
                  onClick={() => zoomOut()}
                >
                  <ZoomOutIcon fontSize={contextIconSize}/>
                </IconButton>
                <IconButton
                  aria-label='btn-zoomreset'
                  onClick={() => resetTransform()}
                >
                  <AutorenewIcon fontSize={contextIconSize}/>
                </IconButton>
                <IconButton
                  aria-label= { isFullscreen ? ('btn-fullscreen-exit') : ('btn-fullscreen') } 
                  onClick={() => fullscreen()}
                >
                  { isFullscreen ? (
                    <FullscreenExitIcon fontSize={contextIconSize}/>) : (
                    <FullscreenIcon fontSize={contextIconSize}/>
                    ) }
                </IconButton>
              </Box>
            </Fade>
            <TransformComponent contentStyle={{ cursor: contextCursor }}>
              <img src={src} alt={alt}/>
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>
    </Box>
  );
};
