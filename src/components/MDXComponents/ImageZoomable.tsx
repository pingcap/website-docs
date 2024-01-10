import { Box, IconButton, Tooltip } from "@mui/material";
import React, {
    JSXElementConstructor,
    ReactNode,
    PropsWithChildren,
    ReactElement,
    useRef,
    useState,
  } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type ImageZoomableWrapperProps = PropsWithChildren<{
  src: string;
  alt: string;
}>

export const ImageZoomable: React.FC<ImageZoomableWrapperProps> = ({ src, alt }) => {
  
  const [isFullscreen, toogleFullScreen] = useState(false);
  const ImageZoomableRef = useRef(null);

  function fullscreen () {
    toogleFullScreen(!isFullscreen) // invert state

    console.log("hit: " + isFullscreen);
  }
  
  return (
    <TransformWrapper
      initialScale={1}
      initialPositionX={0}
      initialPositionY={0}
      ref={ImageZoomableRef}
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
            <img src={src} alt={alt} />
          </TransformComponent>
        </React.Fragment>
      )}
    </TransformWrapper>
  );
};
