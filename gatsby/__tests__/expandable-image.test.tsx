import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { parseFragment } from "parse5";
import type {
  DefaultTreeDocumentFragment,
  DefaultTreeElement,
  DefaultTreeParentNode,
} from "parse5";

import { ExpandableImage } from "../../src/components/MDXComponents/ExpandableImage";

function getChildElements(node: DefaultTreeParentNode): DefaultTreeElement[] {
  return node.childNodes.filter(
    (child): child is DefaultTreeElement => "tagName" in child
  );
}

function getAttributes(element: DefaultTreeElement): Record<string, string> {
  return Object.fromEntries(
    element.attrs.map(({ name, value }) => [name, value])
  );
}

function findElementByClass(
  node: DefaultTreeParentNode,
  className: string
): DefaultTreeElement | undefined {
  for (const child of getChildElements(node)) {
    const classes = getAttributes(child).class?.split(/\s+/) ?? [];
    if (classes.includes(className)) return child;

    const nestedMatch = findElementByClass(child, className);
    if (nestedMatch) return nestedMatch;
  }
}

describe("ExpandableImage", () => {
  it("keeps Markdown image SSR markup valid inside a paragraph", () => {
    const markup = renderToStaticMarkup(
      <div>
        <p>
          <ExpandableImage src="/diagram.png" alt="Diagram" />
        </p>
        <details>
          <summary>Upgrade TiUP Cluster</summary>
          <pre>
            <code>tiup update --self</code>
          </pre>
        </details>
        <h3 id="switch-dashboard">Switch Dashboard instance</h3>
        <pre>
          <code>tiup ctl pd</code>
        </pre>
      </div>
    );
    const fragment = parseFragment(
      markup
    ) as unknown as DefaultTreeDocumentFragment;
    const [root] = getChildElements(fragment);
    const [paragraph, details, heading, codeBlock] = getChildElements(root);
    const [wrapper] = getChildElements(paragraph);
    const [image] = getChildElements(wrapper);

    expect(root.tagName).toBe("div");
    expect([
      paragraph.tagName,
      details.tagName,
      heading.tagName,
      codeBlock.tagName,
    ]).toEqual(["p", "details", "h3", "pre"]);
    expect(wrapper.tagName).toBe("span");
    expect(getAttributes(wrapper)).toMatchObject({ class: "expandable-image" });
    expect(image.tagName).toBe("img");
    expect(getAttributes(image)).toMatchObject({
      src: "/diagram.png",
      alt: "Diagram",
      class: "expandable-inline-image",
    });
    expect(getAttributes(heading)).toMatchObject({ id: "switch-dashboard" });
  });

  it("renders the close button in a toolbar above the expanded image", () => {
    const reactModule = jest.requireActual("react") as typeof React;
    const reactDomModule = jest.requireActual(
      "react-dom"
    ) as typeof import("react-dom");
    const useStateSpy = jest
      .spyOn(reactModule, "useState")
      .mockReturnValueOnce([true, jest.fn()]);
    const createPortalSpy = jest
      .spyOn(reactDomModule, "createPortal")
      .mockImplementation((children) => children as React.ReactPortal);
    const documentDescriptor = Object.getOwnPropertyDescriptor(
      globalThis,
      "document"
    );
    Object.defineProperty(globalThis, "document", {
      configurable: true,
      value: { body: {} },
    });

    let markup: string;
    try {
      markup = renderToStaticMarkup(
        <ExpandableImage src="/diagram.png" alt="Diagram" />
      );
    } finally {
      useStateSpy.mockRestore();
      createPortalSpy.mockRestore();
      if (documentDescriptor) {
        Object.defineProperty(globalThis, "document", documentDescriptor);
      } else {
        Reflect.deleteProperty(globalThis, "document");
      }
    }

    const fragment = parseFragment(
      markup
    ) as unknown as DefaultTreeDocumentFragment;
    const modalContent = findElementByClass(
      fragment,
      "expandable-image-modal-content"
    );
    expect(modalContent).toBeDefined();

    const [toolbar, imageArea] = getChildElements(modalContent!);
    const [closeButton] = getChildElements(toolbar);
    const [expandedImage] = getChildElements(imageArea);

    expect(getAttributes(toolbar)).toMatchObject({
      class: "expandable-image-modal-toolbar",
    });
    expect(closeButton.tagName).toBe("button");
    const closeButtonAttributes = getAttributes(closeButton);
    expect(closeButtonAttributes["aria-label"]).toBe("Close expanded image");
    expect(closeButtonAttributes.class?.split(/\s+/)).toEqual(
      expect.arrayContaining([
        "expandable-modal-close-button",
        "expandable-image-modal-close-button",
      ])
    );
    expect(getAttributes(imageArea)).toMatchObject({
      class: "expandable-modal-scroll",
    });
    expect(expandedImage.tagName).toBe("img");
    expect(getAttributes(expandedImage)).toMatchObject({
      class: "expandable-modal-image",
    });
  });
});
