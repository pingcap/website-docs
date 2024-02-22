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
import ReactDOM from "react-dom";
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
        /*ImageZoomableRef.current.requestFullscreen()
          .catch((err) => {
            console.error(`Error in enabling fullscreen mode: ${err.message}`);
          });*/

        //append overlay(grey background)
        const overlay = (
          //<Box style={{position:"fixed",zIndex:"9999"}}>
        <Box className="zoom-overlay" style={{backgroundColor:"rgba(0,0,0,0.7)",zIndex:99998,position:"fixed",top:0,bottom:0,left:0,right:0}} />
        //</Box>
        );

        
        ReactDOM.render(overlay, ImageZoomableRef.current.getElementsByClassName("zoom-overlay")[0]);
        
        const imagebox = ImageZoomableRef.current.getElementsByClassName("react-transform-wrapper")[0] as HTMLElement;
        
        imagebox.style.position = "fixed";
        imagebox.style.zIndex = "99999";
        imagebox.style.top = "50px";
        imagebox.style.left = "50px";
        imagebox.style.bottom = "50px";
        imagebox.style.right = "50px";
        

        ImageZoomableRef.current.style.position = "fixed";
        ImageZoomableRef.current.style.zIndex = "10001";/*
        ImageZoomableRef.current.style.top = "50px";
        ImageZoomableRef.current.style.left = "50px";
        ImageZoomableRef.current.style.bottom = "50px";
        ImageZoomableRef.current.style.right = "50px";*/

        console.log(ImageZoomableRef.current);
        console.log(imagebox)
        //append large image


      }
    }
  }
  
  useEffect(() => {
    window.onresize = () => {
      setIsFullScreen((document.fullscreenElement != null) ? true: false);
      if (document.fullscreenElement) {

        // when entered fullscreen, set image position to flex-centered for better display
        const ele = document.fullscreenElement as HTMLElement
        ele.style.display = 'flex';
        ele.style.alignItems = 'center';
        ele.style.justifyContent = 'center';
        ele.style.flexFlow = 'column-reverse';

        // when entered fullscreen, unset 'position:absolute' zoom button group for better display
        const ele2 = ele.querySelector(".ZoomButtonGroup") as HTMLElement;
        ele2.style.position = 'unset';

      } else {
        if (ImageZoomableRef.current) {
          
          // exited fullscreen and back to normal position
          ImageZoomableRef.current.style.display = 'block';

          // exited fullscreen and restore 'position:absolute' of zoom button group
          const ele2 = ImageZoomableRef.current.querySelector(".ZoomButtonGroup") as HTMLElement;
          ele2.style.position = 'absolute';
        }
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
      <Box className="zoom-overlay"/>
    </Box>
  );
};
