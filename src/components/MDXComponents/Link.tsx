import { Link } from "gatsby";
import {
  CLOUD_MODE_KEY,
  CLOUD_MODE_VALUE_ESSENTIAL,
  CLOUD_MODE_VALUE_STARTER,
  useCloudMode,
} from "../../shared/useCloudMode";

export const TargetLink = (props: { to: string; [key: string]: any }) => {
  const { isStarter, isEssential } = useCloudMode();
  const { to: _to } = props;
  const to = isStarter
    ? `${_to}?${CLOUD_MODE_KEY}=${CLOUD_MODE_VALUE_STARTER}`
    : isEssential
    ? `${_to}?${CLOUD_MODE_KEY}=${CLOUD_MODE_VALUE_ESSENTIAL}`
    : _to;
  const { pathWithHash, query } = parsePathWithQuery(to);
  const newProps = { ...props };
  const isTargetBlank = query["target"] === "_blank";

  if (isTargetBlank) {
    newProps.target = "_blank";
    newProps.to = pathWithHash;
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

const parsePathWithQuery = (path: string) => {
  const result: { query: { [k: string]: string }; pathWithHash: string } = {
    query: {},
    pathWithHash: "",
  };

  const [pathPart, hashPart] = path.split("#");

  let actualPath = pathPart;
  let hash = "";
  let queryPart = "";

  if (hashPart && hashPart.includes("?")) {
    const [actualHash, query] = hashPart.split("?");
    hash = actualHash;
    queryPart = query;
  } else {
    hash = hashPart || "";

    const isQueryInPath = pathPart.includes("?");
    actualPath = isQueryInPath ? pathPart.split("?")[0] : pathPart;
    queryPart = isQueryInPath ? pathPart.split("?")[1] : "";
  }

  if (queryPart) {
    const params = new URLSearchParams(queryPart);
    for (const [key, value] of params.entries()) {
      result.query[key] = value;
    }
  }

  result.pathWithHash = actualPath + (hash ? `#${hash}` : "");

  return result;
};
