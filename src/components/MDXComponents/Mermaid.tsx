import { useEffect, useRef } from "react";

let idCounter = 0;

export const Mermaid: React.FC<{ value: string }> = ({ value }) => {
  const ref = useRef<HTMLDivElement>(null);
  const id = useRef(`mermaid-${++idCounter}`);

  useEffect(() => {
    if (!ref.current) return;
    const container = ref.current;

    import("mermaid")
      .then(({ default: mermaid }) => {
        mermaid.initialize({
          startOnLoad: false,
          themeVariables: {
            fontFamily:
              'moderat, -apple-system, "Poppins", "Helvetica Neue", "Noto Sans", "Fira Code", "IBM Plex Sans", sans-serif',
          },
        });
        return mermaid.render(id.current, value);
      })
      .then(({ svg }) => {
        container.innerHTML = svg;
      })
      .catch((err) => {
        console.error("[mermaid] render error:", err);
      });
  }, [value]);

  return <div ref={ref} className="mermaid-diagram" />;
};
