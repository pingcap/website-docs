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
        height: "18px",
        fontSize: "10px",
        fontWeight: 500,
        borderRadius: "1000px",
        borderColor: theme.palette.carbon[400],
        pointerEvents: "none",
        textTransform: "uppercase",
        letterSpacing: "0.25px",
        "& .MuiChip-label": {
          paddingLeft: "8px",
          paddingRight: "8px",
          lineHeight: "16px",
          color: theme.palette.carbon[700],
        },
      }}
    />
  );
};

export default PreviewBadge;
