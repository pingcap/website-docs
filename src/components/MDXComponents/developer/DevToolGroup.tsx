import { Stack } from "@mui/material";

interface DevToolGroupProps {
  withMarginBottom?: boolean;
}

export function DevToolGroup({ children, withMarginBottom }: React.PropsWithChildren<DevToolGroupProps>) {
  return (
    <Stack
      component="div"
      direction="row"
      flexWrap="wrap"
      sx={{
        columnGap: 4,
        rowGap: 2,
        mb: withMarginBottom ? 2 : undefined
      }}
    >
      {children}
    </Stack>
  );
}
