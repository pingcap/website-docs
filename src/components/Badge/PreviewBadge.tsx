import Chip from "@mui/material/Chip";
import { useTheme } from "@mui/material/styles";

const PreviewBadge = (props: { label: string }) => {
  const theme = useTheme();

  return (
    <Chip
      label={props.label}
      size="small"
      variant="outlined"
      sx={{
        height: "20px",
        fontSize: "12px",
        fontWeight: 400,
        borderRadius: "10px",
        pointerEvents: "none",
        "& .MuiChip-label": {
          paddingLeft: "8px",
          paddingRight: "8px",
          lineHeight: "20px",
          color: theme.palette.carbon[700],
        },
      }}
    />
  );
};

export default PreviewBadge;
