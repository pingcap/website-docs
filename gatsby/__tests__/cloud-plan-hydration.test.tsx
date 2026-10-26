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

const { JSDOM } = require("jsdom");

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
    title: "Premium alert",
    url: "#premium-alert",
    condition: { plan: "premium" },
  },
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
      <CustomContent plan={CloudPlan.Premium} cloudPlanFromURL={cloudPlan}>
        <h3 id="premium-alert">Premium alert</h3>
      </CustomContent>
      <CustomContent
        plan={"essential,dedicated" as CloudPlan}
        cloudPlanFromURL={cloudPlan}
      >
        <h3 id="migration-jobs">Maximum number of migration jobs</h3>
      </CustomContent>
      <span>{cloudCompatibility}</span>
    </>
  );
}

function Page({ defaultPlan }: { defaultPlan: CloudPlan }) {
  const [cloudPlan, setCloudPlan] = React.useState<CloudPlan | null>(
    defaultPlan
  );
  const [cloudCompatibility, setCloudCompatibility] = React.useState(
    CloudCompatibility.MySQL
  );
  return (
    <CloudPlanProvider
      value={{
        repo: Repo.tidbcloud,
        cloudPlan,
        setCloudPlan,
        cloudCompatibility,
        setCloudCompatibility,
      }}
    >
      <Content />
    </CloudPlanProvider>
  );
}

function renderPage(defaultPlan: CloudPlan) {
  return renderToString(<Page defaultPlan={defaultPlan} />);
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

describe("cloud plan navigation after hydration", () => {
  let dom: InstanceType<typeof JSDOM>;
  let container: HTMLDivElement;
  let reactDOM: typeof import("react-dom");
  let act: typeof import("react-dom/test-utils").act;
  let consoleError: jest.SpyInstance;
  const globalKeys = [
    "window",
    "document",
    "navigator",
    "sessionStorage",
    "MessageChannel",
  ] as const;
  let originalGlobals: (PropertyDescriptor | undefined)[];

  beforeEach(() => {
    mockSearch = "";
    dom = new JSDOM('<div id="root"></div>', {
      url: "https://example.com/tidbcloud/test/",
    });
    originalGlobals = globalKeys.map((key) =>
      Object.getOwnPropertyDescriptor(global, key)
    );
    globalKeys.forEach((key) => {
      Object.defineProperty(global, key, {
        configurable: true,
        value: dom.window[key],
      });
    });
    // Load the DOM renderer after browser globals are available.
    reactDOM = require("react-dom");
    act = require("react-dom/test-utils").act;
    container = document.getElementById("root") as HTMLDivElement;
    consoleError = jest.spyOn(console, "error").mockImplementation(() => {});
  });

  afterEach(() => {
    act(() => {
      reactDOM.unmountComponentAtNode(container);
    });
    consoleError.mockRestore();
    dom.window.close();
    globalKeys.forEach((key, index) => {
      const descriptor = originalGlobals[index];
      if (descriptor) Object.defineProperty(global, key, descriptor);
      else delete (global as any)[key];
    });
    mockSearch = "";
  });

  it.each([
    [CloudPlan.BYOC, "#byoc-alert"],
    [CloudPlan.Premium, "#premium-alert"],
  ])(
    "updates the TOC and headings to %s after effects settle",
    async (plan, expectedHref) => {
      container.innerHTML = renderPage(CloudPlan.Dedicated);
      expect(
        container.querySelector('a[href="#dedicated-alert"]')
      ).not.toBeNull();
      expect(
        container.querySelector('a[href="#migration-jobs"]')
      ).not.toBeNull();
      mockSearch = `?plan=${plan}`;

      await act(async () => {
        reactDOM.hydrate(<Page defaultPlan={CloudPlan.Dedicated} />, container);
      });

      const links = Array.from(container.querySelectorAll("a"));
      expect(links.map((link) => link.getAttribute("href"))).toEqual([
        expectedHref,
      ]);
      expect(container.querySelector("#dedicated-alert")).toBeNull();
      expect(container.querySelector("#migration-jobs")).toBeNull();
      links.forEach((link) => {
        const heading = container.querySelector(link.getAttribute("href")!);
        expect(heading).not.toBeNull();
        expect(heading!.textContent).toBe(link.textContent);
      });
      expect(consoleError).not.toHaveBeenCalled();
    }
  );
});
