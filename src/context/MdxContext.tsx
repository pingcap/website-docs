import * as React from "react";

export const DefalutMdxContext = {
  version: "",
  language: "",
};

export const MdxContext = React.createContext(DefalutMdxContext);
