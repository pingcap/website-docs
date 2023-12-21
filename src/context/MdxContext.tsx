import * as React from "react";
import { Locale, PathConfig, Repo } from "static/Type";

interface IDefalutMdxContext {
  pathConfig: PathConfig;
}

export const DefalutMdxContext: IDefalutMdxContext = {
  pathConfig: {
    repo: Repo.tidb,
    locale: Locale.en,
    branch: "dev",
    version: null
  }
};

export const MdxContext = React.createContext(DefalutMdxContext);
