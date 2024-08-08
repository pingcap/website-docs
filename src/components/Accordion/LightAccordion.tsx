import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Typography,
} from "@mui/material";
import ArrowForwardIosIcon from '@mui/icons-material/ArrowForwardIos';

export interface LightAccordionProps {
  defaultExpanded?: boolean;
  label: string;
}

export function LightAccordion({
  children,
  defaultExpanded,
  label = '',
}: React.PropsWithChildren<LightAccordionProps>) {
  return (
    <Accordion defaultExpanded={defaultExpanded} disableGutters elevation={0} sx={{
      '&::before': {
        display: 'none'
      }
    }}>
      <AccordionSummary
        expandIcon={<ArrowForwardIosIcon fontSize="small" sx={{ fontSize: '0.875rem' }} />}
        aria-controls={`accordion-panel-${label?.toLowerCase()}-content`}
        id={`accordion-panel-${label?.toLowerCase()}-header`}
        sx={{
          px: 0,
          flexDirection: 'row-reverse',
          '.MuiAccordionSummary-expandIconWrapper': {
            color: "website.f1",
            '&.Mui-expanded': {
              transform: 'rotate(90deg)',
            }
          },
          '.MuiAccordionSummary-content': {
            ml: 1
          }
        }}
      >
        <Typography component="span" color="website.f1">{label}</Typography>
      </AccordionSummary>
      <AccordionDetails sx={{ px: 0 }}>{children}</AccordionDetails>
    </Accordion>
  );
}
