import { TitleAction } from "components/Layout/TitleAction/TitleAction";
import { headerActions } from "./H1.module.css";
import { BuildType, PathConfig, TOCNamespace } from "shared/interface";

export const H1 = (props: {
  children: React.ReactNode;
  pathConfig: PathConfig;
  filePath: string;
  pageUrl: string;
  buildType: BuildType;
  language: string;
  namespace: TOCNamespace;
}) => {
  const { children, ...restProps } = props;
  return (
    <>
      <h1>{children}</h1>
      <div className={headerActions}>
        <TitleAction {...restProps} />
      </div>
    </>
  );
};
