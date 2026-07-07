jest.mock("../toc", () => ({}));
jest.mock("../path", () => ({}));
jest.mock("../toc-filter", () => ({}));
jest.mock("../url-resolver", () => ({}));

const { determineInDefaultPlan } = require("../cloud-plan");
const { CloudPlan, Repo, Locale } = require("../../src/shared/interface");

const pathConfig = {
  locale: Locale.en,
  repo: Repo.tidbcloud,
  branch: "master",
  version: null,
};

describe("cloud plan detection", () => {
  it("detects BYOC-only TiDB Cloud articles", () => {
    const tocMap = new Map([
      [
        "en/tidbcloud/master",
        {
          dedicated: new Set(),
          starter: new Set(),
          essential: new Set(),
          premium: new Set(),
          byoc: new Set(["byoc-overview"]),
        },
      ],
    ]);

    expect(determineInDefaultPlan("byoc-overview", pathConfig, tocMap)).toBe(
      CloudPlan.Byoc
    );
  });

  it("keeps dedicated as the default when a BYOC page is also in the dedicated TOC", () => {
    const tocMap = new Map([
      [
        "en/tidbcloud/master",
        {
          dedicated: new Set(["shared-overview"]),
          starter: new Set(),
          essential: new Set(),
          premium: new Set(),
          byoc: new Set(["shared-overview"]),
        },
      ],
    ]);

    expect(determineInDefaultPlan("shared-overview", pathConfig, tocMap)).toBe(
      CloudPlan.Dedicated
    );
  });
});
