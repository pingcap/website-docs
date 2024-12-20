import { Link } from "gatsby";

export const TargetLink = (props: { to: string; [key: string]: any }) => {
  const { to } = props;
  const toArr = to.split("?");
  const path = toArr[0];
  const query = toArr[toArr.length - 1];
  const newProps = { ...props };
  const isTargetBlank = query.includes("target=_blank");

  if (isTargetBlank) {
    newProps.target = "_blank";
    newProps.to = path;
    newProps.rel = "noopener noreferrer";
  }

  return (
    <Link
      {...newProps}
      onClick={(e) => {
        if (isTargetBlank) {
          e.preventDefault();
          window.open((e.target as HTMLAnchorElement).href, "_blank");
        }
      }}
    />
  );
};
