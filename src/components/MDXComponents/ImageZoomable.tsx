import { Box, IconButton, Tooltip } from "@mui/material";
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
  const ImageZoomableRef = useRef<HTMLDivElement>(null);

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
    <Box className="ImageZoomableContainer" ref={ImageZoomableRef}>
      <TransformWrapper
      initialScale={1}
      initialPositionX={0}
      initialPositionY={0}
      >
        {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
          <React.Fragment>
            <Box
              sx={{
                position: "absolute",
                float: "left",
                zIndex: 99,
              }}>
              <button onClick={() => zoomIn()}>+</button>
              <button onClick={() => zoomOut()}>-</button>
              <button onClick={() => resetTransform()}>x</button>
              <button onClick={() => fullscreen()}>o</button>
            </Box>
            <TransformComponent>
              <img src={src} alt={alt}/>
            </TransformComponent>
          </React.Fragment>
        )}
      </TransformWrapper>
    </Box>
  );
};
