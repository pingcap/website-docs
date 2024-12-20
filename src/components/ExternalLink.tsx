import { Link } from "gatsby";

export const ExternalLink = (props: { to: string; [key: string]: any }) => {
  return (
    <Link
      {...props}
      onClick={(e) => {
        e.preventDefault();
        window.open((e.target as HTMLAnchorElement).href, "_blank");
      }}
    />
  );
};
