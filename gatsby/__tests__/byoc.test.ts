jest.mock("shared/interface", () => require("../../src/shared/interface"), {
  virtual: true,
});
jest.mock("shared/useCloudPlan", () => ({ CLOUD_MODE_KEY: "plan" }), {
  virtual: true,
});
jest.mock("components/Badge/PreviewBadge", () => () => null, { virtual: true });
jest.mock("media/icons/cloud-03.svg", () => () => null, { virtual: true });
jest.mock("media/icons/layers-three-01.svg", () => () => null, {
  virtual: true,
});

import { generateNavConfig } from "../../src/components/Layout/Header/HeaderNavConfigData";
import { getSelectedNavItem } from "../../src/components/Layout/Header/getSelectedNavItem";
import { CloudPlan, Repo, TOCNamespace } from "../../src/shared/interface";
import { determineInDefaultPlan } from "../cloud-plan";
import { createNavs } from "../create-types/create-navs";
import { getLocaleAvailabilityKey } from "../create-pages/create-docs";
import { generateConfig, generateNavTOCPath } from "../path";
import { calculateFileUrl } from "../url-resolver";

describe("TiDB Cloud BYOC", () => {
  it("places the English-only BYOC preview entry immediately after Premium", () => {
    const nav = generateNavConfig((key) => key, CloudPlan.BYOC, "prod", "zh");
    const product = nav[0];
    if (product.type !== "group") throw new Error("Missing Product menu");
    const cloud = product.children[0];
    if (cloud.type !== "group") throw new Error("Missing Cloud products");

    const premiumIndex = cloud.children.findIndex(
      (item) => item.type === "item" && item.label === "navbar.tidbCloudPremium"
    );
    const byocIndex = cloud.children.findIndex(
      (item) => item.type === "item" && item.label === "navbar.tidbCloudBYOC"
    );
    expect(byocIndex).toBe(premiumIndex + 1);
    const byoc = cloud.children[byocIndex];
    expect(byoc).toEqual(
      expect.objectContaining({
        type: "item",
        to: "/tidbcloud/byoc?plan=byoc",
        isI18n: false,
      })
    );
    if (byoc.type !== "item") throw new Error("Missing BYOC item");
    expect(typeof byoc.disabled).toBe("function");
    if (typeof byoc.disabled !== "function") {
      throw new Error("Missing BYOC locale availability check");
    }
    expect(byoc.disabled("en")).toBe(false);
    expect(byoc.disabled("zh")).toBe(true);
    expect(byoc.disabled("ja")).toBe(true);
    expect(getSelectedNavItem(nav, TOCNamespace.TiDBCloud)).toEqual(
      expect.objectContaining({ label: "navbar.tidbCloudBYOC" })
    );
  });

  it("keeps BYOC out of the archived documentation menu", () => {
    const nav = generateNavConfig(
      (key) => key,
      CloudPlan.BYOC,
      "archive",
      "en"
    );
    expect(getSelectedNavItem(nav, TOCNamespace.TiDBCloud)).toBeNull();
  });

  it("publishes the BYOC landing page at the plan URL", () => {
    const slug = "en/tidbcloud/master/tidb-cloud/byoc/_index";
    const { config } = generateConfig(slug);

    expect(config.prefix).toBe(CloudPlan.BYOC);
    expect(calculateFileUrl(slug, true)).toBe("/tidbcloud/byoc");
    expect(generateNavTOCPath(config, "tidb-cloud-byoc")).toBe(
      "en/tidbcloud/master/TOC-tidb-cloud-byoc"
    );
  });

  it("keys landing-page locale availability by cloud plan", () => {
    const byoc = generateConfig(
      "en/tidbcloud/master/tidb-cloud/byoc/_index"
    );
    const premium = generateConfig(
      "zh/tidbcloud/master/tidb-cloud/premium/_index"
    );

    expect(getLocaleAvailabilityKey(byoc.name, byoc.config)).toBe("byoc/");
    expect(getLocaleAvailabilityKey(premium.name, premium.config)).toBe(
      "premium/"
    );
  });

  it("keeps BYOC guide pages in the shared TiDB Cloud URL namespace", () => {
    expect(
      calculateFileUrl(
        "en/tidbcloud/master/tidb-cloud/byoc/byoc-onboarding-overview",
        true
      )
    ).toBe("/tidbcloud/byoc-onboarding-overview");
  });

  it("uses BYOC as the default plan for BYOC-only pages", () => {
    const tocFiles = new Map([
      [
        "en/tidbcloud/master",
        {
          dedicated: new Set<string>(),
          starter: new Set<string>(),
          essential: new Set<string>(),
          premium: new Set<string>(),
          byoc: new Set(["byoc-onboarding-overview"]),
        },
      ],
    ]);

    expect(
      determineInDefaultPlan(
        "byoc-onboarding-overview",
        {
          repo: Repo.tidbcloud,
          locale: "en",
          branch: "master",
          version: null,
        },
        tocFiles
      )
    ).toBe(CloudPlan.BYOC);
  });

  it("registers the BYOC navigation field for page queries", () => {
    const createFieldExtension = jest.fn();
    const createTypes = jest.fn();

    createNavs({ actions: { createFieldExtension, createTypes } } as any);

    expect(createFieldExtension).toHaveBeenCalledWith(
      expect.objectContaining({ name: "byocNavigation" })
    );
    expect(createTypes).toHaveBeenCalledWith(
      expect.stringContaining("byocNavigation: JSON! @byocNavigation")
    );
  });
});
