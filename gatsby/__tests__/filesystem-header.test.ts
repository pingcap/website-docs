jest.mock("shared/interface", () => require("../../src/shared/interface"), {
  virtual: true,
});
jest.mock("shared/useCloudPlan", () => ({ CLOUD_MODE_KEY: "cloud-mode" }), {
  virtual: true,
});
jest.mock("components/Badge/PreviewBadge", () => () => null, { virtual: true });
jest.mock("media/icons/cloud-03.svg", () => () => null, { virtual: true });
jest.mock("media/icons/layers-three-01.svg", () => () => null, {
  virtual: true,
});

import { generateNavConfig } from "../../src/components/Layout/Header/HeaderNavConfigData";
import { getSelectedNavItem } from "../../src/components/Layout/Header/getSelectedNavItem";
import { CloudPlan, TOCNamespace } from "../../src/shared/interface";

describe("Filesystem product menu", () => {
  it("appears immediately after Lake and links to English documentation", () => {
    const nav = generateNavConfig(
      (key) => key,
      CloudPlan.Starter,
      "prod",
      "zh"
    );
    const product = nav[0];
    if (product.type !== "group") throw new Error("Missing Product menu");
    const cloud = product.children[0];
    if (cloud.type !== "group") throw new Error("Missing Cloud products");
    const lakeIndex = cloud.children.findIndex(
      (item) => item.type === "item" && item.to === "/tidbcloudlake"
    );
    expect(lakeIndex).toBeGreaterThanOrEqual(0);
    const filesystem = cloud.children[lakeIndex + 1];
    expect(filesystem).toMatchObject({
      type: "item",
      label: "navbar.tidbCloudFilesystem",
      to: "/tidbcloudfs",
      isI18n: false,
    });
    if (filesystem.type !== "item") throw new Error("Missing Filesystem item");
    expect(filesystem.endIcon).toBeTruthy();
    expect(getSelectedNavItem(nav, TOCNamespace.TiDBCloudFilesystem)).toBe(
      filesystem
    );
    expect(filesystem.onClick).toBeUndefined();
  });

  it("does not add Filesystem to the archived documentation site", () => {
    const nav = generateNavConfig((key) => key, null, "archive", "en");
    expect(
      getSelectedNavItem(nav, TOCNamespace.TiDBCloudFilesystem)
    ).toBeNull();
  });
});
