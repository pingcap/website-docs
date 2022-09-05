import * as React from "react";
import { Trans } from "gatsby-plugin-react-i18next";
import Popover, { PopoverProps } from "@mui/material/Popover";
import Typography from "@mui/material/Typography";
import Button from "@mui/material/Button";
import Fab from "@mui/material/Fab";
import Box from "@mui/material/Box";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import Checkbox from "@mui/material/Checkbox";
import TextField from "@mui/material/TextField";

export default function FeedbackBtn() {
  const [anchorEl, setAnchorEl] = React.useState<HTMLButtonElement | null>(
    null
  );

  const handleClick = (event: React.MouseEvent<HTMLButtonElement>) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
  };

  const open = Boolean(anchorEl);
  const id = open ? "feedback-popover" : undefined;

  return (
    <>
      <Button
        aria-describedby={id}
        size="small"
        aria-label="feedback"
        disableRipple
        // variant="extended"
        sx={{
          display: "flex",
          color: "website.f2",
          backgroundColor: "#eff4f7",
          borderRadius: "0.5rem",
          width: "100%",
          boxShadow: "none",
          "&:hover": {
            color: "website.m1",
            backgroundColor: "website.k1",
          },
        }}
        onClick={handleClick}
      >
        <Trans i18nKey="docHelpful.header" />
      </Button>
      <FeedbackPopover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
      />
      {/* <Popover
        id={id}
        open={open}
        anchorEl={anchorEl}
        onClose={handleClose}
        anchorOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        transformOrigin={{
          vertical: "top",
          horizontal: "center",
        }}
        marginThreshold={56}
      >
        <Box
          sx={{
            width: "13.5rem",
          }}
        >
          <Box
            sx={{
              height: "2.625rem",
              width: "100%",
              display: "flex",
              alignItems: "center",
              backgroundColor: "website.m5",
            }}
          >
            <Typography
              variant="body1"
              sx={{
                padding: "0 1rem",
                color: "website.m1",
              }}
            >
              <Trans i18nKey="docHelpful.header" />
            </Typography>
          </Box>
          <Box
            sx={{
              backgroundColor: "#F7F8F9",
              padding: "1rem",
            }}
          >
            <Typography variant="body2">
              您在使用文档时是否遇到以下问题?
            </Typography>
            <FormGroup>
              <FormControlLabel
                control={<Checkbox size="small" />}
                label={<Typography variant="body2">文档内容错误</Typography>}
              />
              <FormControlLabel
                control={<Checkbox size="small" />}
                label={
                  <Typography variant="body2">描述不清，内容有歧义</Typography>
                }
              />
              <FormControlLabel
                control={<Checkbox size="small" />}
                label={<Typography variant="body2">文档中有错别字</Typography>}
              />
              <FormControlLabel
                control={<Checkbox size="small" />}
                label={<Typography variant="body2">链接无法打开</Typography>}
              />
              <FormControlLabel
                control={<Checkbox size="small" />}
                label={
                  <Typography variant="body2">这篇文档不是我需要的</Typography>
                }
              />
            </FormGroup>
            <Typography variant="body2">我们应该如何改进这篇文档?</Typography>
            <TextField
              size="small"
              id="outlined-multiline-static"
              multiline
              rows={4}
            />
            <Typography variant="body2">可以联系你为您解决问题吗?</Typography>
            <TextField size="small" placeholder="邮箱地址" />
            <Button size="small" disableRipple variant="contained">
              提交
            </Button>
          </Box>
        </Box>
      </Popover> */}
    </>
  );
}

function FeedbackPopover(props: {
  id?: string;
  open: boolean;
  anchorEl?: PopoverProps["anchorEl"];
  onClose?: PopoverProps["onClose"];
}) {
  const { id, open, anchorEl, onClose } = props;
  return (
    <Popover
      id={id}
      open={open}
      anchorEl={anchorEl}
      onClose={onClose}
      anchorOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      transformOrigin={{
        vertical: "top",
        horizontal: "center",
      }}
      marginThreshold={56}
    >
      <Box
        sx={{
          width: "13.5rem",
        }}
      >
        <Box
          sx={{
            height: "2.625rem",
            width: "100%",
            display: "flex",
            alignItems: "center",
            backgroundColor: "website.m5",
          }}
        >
          <Typography
            variant="body1"
            sx={{
              padding: "0 1rem",
              color: "website.m1",
            }}
          >
            <Trans i18nKey="docHelpful.header" />
          </Typography>
        </Box>
        <Box
          sx={{
            backgroundColor: "#F7F8F9",
            padding: "1rem",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Typography variant="body2">
            您在使用文档时是否遇到以下问题?
          </Typography>
          <FormGroup>
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={<Typography variant="body2">文档内容错误</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={
                <Typography variant="body2">描述不清，内容有歧义</Typography>
              }
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={<Typography variant="body2">文档中有错别字</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={<Typography variant="body2">链接无法打开</Typography>}
            />
            <FormControlLabel
              control={<Checkbox size="small" />}
              label={
                <Typography variant="body2">这篇文档不是我需要的</Typography>
              }
            />
          </FormGroup>
          <Typography variant="body2" sx={{ marginTop: "1rem" }}>
            我们应该如何改进这篇文档?
          </Typography>
          <TextField
            size="small"
            id="outlined-multiline-static"
            multiline
            rows={4}
            sx={{
              marginTop: "0.5rem",
              marginBottom: "1rem",
            }}
          />
          <Typography variant="body2">可以联系你为您解决问题吗?</Typography>
          <TextField
            size="small"
            placeholder="邮箱地址"
            sx={{
              marginTop: "0.5rem",
              marginBottom: "1rem",
            }}
          />
          <Button
            size="small"
            disableRipple
            variant="contained"
            sx={{
              with: "11.5rem",
            }}
          >
            提交
          </Button>
        </Box>
      </Box>
    </Popover>
  );
}
