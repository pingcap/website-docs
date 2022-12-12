import * as React from "react";

import * as MDSvgIconEle from "components/Icons/MDSvgIcon";

export function MDSvgIcon(props: { name: string; className?: string }) {
  const { name, className } = props;

  const nameMemo = React.useMemo(() => {
    // example: icon-top-apply-for-poc => IconTopApplyForPoc
    return name
      .split("-")
      .map((item) => item[0].toUpperCase() + item.slice(1))
      .join("");
  }, [name]);

  const Ele = MDSvgIconEle[nameMemo as keyof typeof MDSvgIconEle];

  return <>{Ele ? <Ele className={className} /> : <></>}</>;
}
