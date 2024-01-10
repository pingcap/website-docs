import React, {
    JSXElementConstructor,
    ReactNode,
    PropsWithChildren,
    ReactElement,
  } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type ImageZoomableWrapperProps = PropsWithChildren<{
  src: string;
  alt: string;
}>

export const ImageZoomable: React.FC<ImageZoomableWrapperProps> = ({ src, alt }) => {
  
  return (
    <TransformWrapper
      initialScale={1}
      initialPositionX={0}
      initialPositionY={0}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <React.Fragment>
          <div className="tools">
            <button onClick={() => zoomIn()}>+</button>
            <button onClick={() => zoomOut()}>-</button>
            <button onClick={() => resetTransform()}>x</button>
          </div>
          <TransformComponent>
            <img src={src} alt={alt} />
          </TransformComponent>
        </React.Fragment>
      )}
    </TransformWrapper>
  );
};
  
