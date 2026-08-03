import * as React from "react";
import { renderToStaticMarkup } from "react-dom/server";

import { ExpandableImage } from "../../src/components/MDXComponents/ExpandableImage";

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

    expect(markup).toContain(
      '<p><span class="expandable-image"><img src="/diagram.png" alt="Diagram" class="expandable-inline-image"/></span></p>'
    );
    expect(markup).not.toContain("<p><div");
    expect(markup).toContain(
      '</details><h3 id="switch-dashboard">Switch Dashboard instance</h3><pre><code>tiup ctl pd</code></pre>'
    );
  });
});
