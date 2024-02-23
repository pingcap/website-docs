import { Box, Fade, IconButton} from "@mui/material";

import ZoomInIcon from "@mui/icons-material/ZoomIn";
import ZoomOutIcon from "@mui/icons-material/ZoomOut";
import AutorenewIcon from "@mui/icons-material/Autorenew";
import FullscreenIcon  from "@mui/icons-material/Fullscreen";
import FullscreenExitIcon from "@mui/icons-material/FullscreenExit";

import React, {
    PropsWithChildren,
    useRef,
    useState,
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
        console.log("gonna exit fullscreen mode")
        setIsFullScreen(false);
        let ele = ImageZoomableRef.current.getElementsByClassName("zoom-overlay")[0] as HTMLElement;
        ele.style.backgroundColor = "rgba(0,0,0,0.7)";
        ele.style.opacity = "0";
        ele.style.position = "fixed";
        ele.style.zIndex = "99998";
        ele.style.inset = "0";
        ele.style.transition = "opacity 3s ease-in-out";
        ele.style.pointerEvents = "none";
        console.log("取消全屏")

        console.log(ele)
      } else {
        /*ImageZoomableRef.current.requestFullscreen()
          .catch((err) => {
            console.error(`Error in enabling fullscreen mode: ${err.message}`);
          });*/
        setIsFullScreen(true);
        let ele = ImageZoomableRef.current.getElementsByClassName("zoom-overlay")[0] as HTMLElement;
        console.log("设置全屏")
        ele.style.opacity = "1";

        console.log(ele)


      }
    }
  }

  return (
    <Box
      className="ImageZoomableContainer"
      ref={ImageZoomableRef}
      sx={{
        position: (isFullscreen ? "fixed" : "inherit"),
        zIndex: (isFullscreen ? "10001" : "inherit")
      }}
      onMouseEnter={() => {
        contextCursor = "grab";
        setIsHovered(true);
      }}
      onMouseLeave={() => {
        if (!isFullscreen) {
          setIsHovered(false);
        }
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
                  position: (isFullscreen ? "fixed" : "absolute"),
                  float: "left",
                  zIndex: (isFullscreen ? 99999 : 99),
                  backgroundColor: "rgb(229,229,229)",
                  borderRadius: 18,
                  marginTop: ".5rem",
                  marginLeft: ".5rem",
                  transform: (isFullscreen ? "translate(-50%,-50%)" : "inherit"),
                  left: (isFullscreen ? "50%" : "inherit"),
                  top: (isFullscreen ? "95%" : "inherit")
                }}>
                <IconButton
                  aria-label="btn-zoomin"
                  onClick={() => zoomIn()}
                >
                  <ZoomInIcon fontSize={contextIconSize}/>
                </IconButton>
                <IconButton
                  aria-label="btn-zoomout"
                  onClick={() => zoomOut()}
                >
                  <ZoomOutIcon fontSize={contextIconSize}/>
                </IconButton>
                <IconButton
                  aria-label="btn-zoomreset"
                  onClick={() => resetTransform()}
                >
                  <AutorenewIcon fontSize={contextIconSize}/>
                </IconButton>
                <IconButton
                  aria-label= { isFullscreen ? "btn-fullscreen-exit" : "btn-fullscreen" } 
                  onClick={() => fullscreen()}
                >
                  { isFullscreen ? (
                    <FullscreenExitIcon fontSize={contextIconSize}/>) : (
                    <FullscreenIcon fontSize={contextIconSize}/>
                    ) }
                </IconButton>
              </Box>
            </Fade>
            <TransformComponent
              contentStyle={{ cursor: contextCursor }}
              wrapperStyle={{
                position: (isFullscreen ? "fixed" : "inherit"),
                zIndex: (isFullscreen ? "99999" : "inherit"),
                left: (isFullscreen ? "50%" : "inherit"),
                top: (isFullscreen ? "50%" : "inherit"),
                transform: (isFullscreen ? "translate(-50%,-50%) scale(1.6)" : "inherit"),
                //transition: "transform .3s cubic-bezier(.2,0,.2,1)"
              }}>
              <img src={src} alt={alt}/>
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>
      <Box
        className="zoom-overlay"
        sx={{
          backgroundColor: "rgba(0,0,0,0.7)",
          opacity: (isFullscreen ? "1" : "0"),
          position: (isFullscreen ? "fixed" : "inherit"),
          zIndex: (isFullscreen ? "99998" : "inherit"),
          inset: (isFullscreen ? "0" : "inherit"),
          transition: "opacity 3s ease-in-out",
        }}
      />
    </Box>
  );
};
