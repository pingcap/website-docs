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
});
