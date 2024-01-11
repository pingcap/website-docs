import { Box, Fade, IconButton, Tooltip } from "@mui/material";

import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FullscreenIcon  from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

import React, {
    PropsWithChildren,
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
  
  const [isFullscreen, setIsFullScreen] = useState(false);
  const [isHovered, setIsHovered] = useState(false);
  const [isDragging, setIsDragging] = useState(false);
  const [isTouchMoving, setTouchMoving] = useState(false);
  const ImageZoomableRef = useRef<HTMLDivElement>(null);
  const contextIconSize = isFullscreen ? ("medium") : ("small");
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
  }
  
  useEffect(() => {
    window.onresize = () => {
        setIsFullScreen((document.fullscreenElement != null) ? true: false);
        if (document.fullscreenElement) {
          console.log(document.fullscreenElement)

          const ele = document.fullscreenElement as HTMLElement
          ele.style.display = 'flex';
          ele.style.alignItems = 'center';
          ele.style.justifyContent = 'center';
        }
    }
  })

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
      onTouchMove={() => {
        setTouchMoving(true);
      }}
      onTouchStart={()=>{
        setTouchMoving(true);
        setTimeout(() => {
          setTouchMoving(false);
        }, 4000);
      }}
      >
      <TransformWrapper
        initialScale={1}
        initialPositionX={0}
        initialPositionY={0}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <React.Fragment>
            <Fade in={isHovered || isTouchMoving}>
              <Box
                className="ZoomButtonGroup"
                sx={{
                  position: 'absolute',
                  float: 'left',
                  zIndex: 99,
                  backgroundColor: 'rgb(229,229,229)',
                  borderRadius: 18,
                  marginTop: '.5rem',
                  marginLeft: '.5rem',
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
