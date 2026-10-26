import * as React from "react";
import { renderToString } from "react-dom/server";
import { CloudPlanProvider, useCloudPlan } from "../../src/shared/useCloudPlan";
import { CustomContent } from "../../src/components/MDXComponents/CustomContent";
import { filterRightToc } from "../../src/shared/filterRightToc";
import {
  CloudCompatibility,
  CloudPlan,
  Repo,
  TOCNamespace,
} from "../../src/shared/interface";

let mockSearch = "";
jest.mock(
  "@reach/router",
  () => ({
    useLocation: () => ({
      pathname: "/tidbcloud/test/",
      search: mockSearch,
      hash: "",
    }),
  }),
  { virtual: true }
);
jest.mock("gatsby", () => ({ navigate: jest.fn() }));

const toc = [
  {
    title: "Dedicated alert",
    url: "#dedicated-alert",
    condition: { plan: "dedicated" },
  },
  { title: "BYOC alert", url: "#byoc-alert", condition: { plan: "byoc" } },
  {
    title: "Maximum number of migration jobs",
    url: "#migration-jobs",
    condition: { plan: "essential,dedicated" },
  },
];

function Content() {
  const { cloudPlan, cloudCompatibility } = useCloudPlan();
  return (
    <>
      {filterRightToc(
        toc,
        TOCNamespace.TiDBCloud,
        cloudPlan,
        "en",
        cloudCompatibility
      ).map((item) => (
        <a key={item.url} href={item.url}>
          {item.title}
        </a>
      ))}
      <CustomContent plan={CloudPlan.Dedicated} cloudPlanFromURL={cloudPlan}>
        <h3 id="dedicated-alert">Dedicated alert</h3>
      </CustomContent>
      <CustomContent plan={CloudPlan.BYOC} cloudPlanFromURL={cloudPlan}>
        <h3 id="byoc-alert">BYOC alert</h3>
      </CustomContent>
      <span>{cloudCompatibility}</span>
    </>
  );
}

function renderPage(defaultPlan: CloudPlan) {
  return renderToString(
    <CloudPlanProvider
      value={{
        repo: Repo.tidbcloud,
        cloudPlan: defaultPlan,
        setCloudPlan: () => {},
        cloudCompatibility: CloudCompatibility.MySQL,
        setCloudCompatibility: () => {},
      }}
    >
      <Content />
    </CloudPlanProvider>
  );
}

describe("cloud plan hydration", () => {
  afterEach(() => {
    mockSearch = "";
    delete (global as any).window;
    delete (global as any).sessionStorage;
  });

  it.each([
    [CloudPlan.BYOC, ""],
    [CloudPlan.Premium, ""],
    [CloudPlan.Starter, "&compatibility=postgresql"],
  ])(
    "keeps the first client render identical to SSR for query plan %s",
    (plan, suffix) => {
      const serverMarkup = renderPage(CloudPlan.Dedicated);
      mockSearch = `?plan=${plan}${suffix}`;
      (global as any).window = {};
      (global as any).sessionStorage = { getItem: () => null };

      expect(renderPage(CloudPlan.Dedicated)).toBe(serverMarkup);
    }
  );

  it("does not apply session preferences during hydration", () => {
    const serverMarkup = renderPage(CloudPlan.Dedicated);
    const getItem = jest.fn(() => CloudPlan.Premium);
    (global as any).window = {};
    (global as any).sessionStorage = { getItem };

    expect(renderPage(CloudPlan.Dedicated)).toBe(serverMarkup);
    expect(getItem).not.toHaveBeenCalled();
  });

  it("preserves a Starter page's server compatibility on its first client render", () => {
    const serverMarkup = renderPage(CloudPlan.Starter);
    mockSearch = "?plan=starter&compatibility=postgresql";
    (global as any).window = {};
    (global as any).sessionStorage = { getItem: () => "postgresql" };

    expect(renderPage(CloudPlan.Starter)).toBe(serverMarkup);
  });
});
