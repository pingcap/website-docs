import React, {
    JSXElementConstructor,
    PropsWithChildren,
    ReactElement,
  } from "react";
import { TransformWrapper, TransformComponent } from "react-zoom-pan-pinch";

type ImageZoomableWrapperProps = {
  children?: React.ReactNode;
}

export const ImageZoomable: React.FC<PropsWithChildren> = ({ children } : ImageZoomableWrapperProps) => {
  
  return (
    <TransformWrapper
      initialScale={1}
      initialPositionX={200}
      initialPositionY={100}
    >
      {({ zoomIn, zoomOut, resetTransform, ...rest }) => (
        <React.Fragment>
          <div className="tools">
            <button onClick={() => zoomIn()}>+</button>
            <button onClick={() => zoomOut()}>-</button>
            <button onClick={() => resetTransform()}>x</button>
          </div>
          <TransformComponent>
            <img src="image.jpg" alt="test" />
            <div>Example text</div>
            <div>{children}</div>
          </TransformComponent>
        </React.Fragment>
      )}
    </TransformWrapper>
  );
};
  
