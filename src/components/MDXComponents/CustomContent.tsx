import { PropsWithChildren, useEffect, useState } from "react";
import { PageType } from "shared/utils";

interface CustomContentProps {
  platform: "tidb" | "tidb-cloud";
  pageTypeFromURL?: PageType;
}

export const useCustomContent = (pageTypeFromURL: PageType) => {
  return (props: PropsWithChildren<CustomContentProps>) => {
    return <CustomContent {...props} pageTypeFromURL={pageTypeFromURL} />;
  };
};

export const CustomContent: React.FC<PropsWithChildren<CustomContentProps>> = (
  props
) => {
  const { platform: _pageType, pageTypeFromURL, children } = props;
  const pageType = _pageType.replace("-", "");
  const [shouldDisplay, setShouldDisplay] = useState(
    pageTypeFromURL === pageType
  );
  useEffect(() => {
    const currentPath = window?.location?.pathname || "";
    if (currentPath.includes(`/${pageType}/`)) {
      setShouldDisplay(true);
    } else {
      setShouldDisplay(false);
    }
  }, []);
  return <>{shouldDisplay ? children : <></>}</>;
};
