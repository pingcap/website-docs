import { LightAccordion, LightAccordionProps } from "components/Accordion";
import { DevToolGroup } from "./DevToolGroup";

export function DevLangAccordion({
  children,
  ...restProps
}: React.PropsWithChildren<LightAccordionProps>) {
  return (
    <LightAccordion {...restProps}>
      <DevToolGroup>
        {children}
      </DevToolGroup>
    </LightAccordion>
  );
}
