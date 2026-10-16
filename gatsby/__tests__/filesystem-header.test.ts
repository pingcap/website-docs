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
  it.each(["en", "zh", "ja"])(
    "exposes Filesystem in the %s Product menu",
    (language) => {
      const nav = generateNavConfig(
        (key) => key,
        CloudPlan.Starter,
        "prod",
        language
      );
      const product = nav[0];
      if (product.type !== "group") throw new Error("Missing Product menu");
      const cloud = product.children[0];
      if (cloud.type !== "group") throw new Error("Missing Cloud products");
      expect(cloud.children).toContainEqual(
        expect.objectContaining({
          type: "item",
          label: "navbar.tidbCloudFilesystem",
          to: "/tidbcloud-filesystem",
        })
      );
      const item = getSelectedNavItem(nav, TOCNamespace.TiDBCloudFilesystem);
      expect(item?.isI18n ?? true).toBe(true);
      expect(
        typeof item?.disabled === "function"
          ? item.disabled(language)
          : item?.disabled ?? false
      ).toBe(false);
      expect(item).toEqual(
        expect.objectContaining({ to: "/tidbcloud-filesystem" })
      );
    }
  );

  it("does not add Filesystem to the archived documentation site", () => {
    const nav = generateNavConfig((key) => key, null, "archive", "en");
    expect(
      getSelectedNavItem(nav, TOCNamespace.TiDBCloudFilesystem)
    ).toBeNull();
  });
});
