import { forwardRef } from "react";
import { Box, Typography } from "@mui/material";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import { useTheme } from "@mui/material/styles";
import { FormattedMessage } from "react-intl";
import { useNavigate } from "react-router-dom";
import Backdrop from "components/Backdrop";
import Skeleton from "components/Skeleton";
import SummaryCardContent from "components/SummaryCardContent";
import Tooltip from "components/Tooltip";
import { useOrganizationInfo } from "hooks/useOrganizationInfo";
import useStyles from "./SummaryCard.styles";
import SummaryCardPdf from "./SummaryCardPdf";

const CardLayout = forwardRef(({ children, color, button = {}, onClick, cardTestId, ...rest }, ref) => {
  const { classes, cx } = useStyles(color);
  const cardColorClasses = cx(classes.root, button.show ? classes.button : "");

  return (
    <Card {...rest} elevation={0} data-test-id={cardTestId} className={cardColorClasses} onClick={onClick} ref={ref}>
      <CardContent className={classes.content}>{children}</CardContent>
    </Card>
  );
});

const SummaryCard = ({
  value,
  caption,
  dataTestIds,
  icon = {},
  color = "primary",
  isLoading = false,
  help = {},
  button = {},
  rawValue = value,
  rawCaption = caption,
  pdfId,
  customContent,
  backdrop
}) => {
  const theme = useTheme();

  const themeColor = theme.palette[color].main;

  const { currency } = useOrganizationInfo();
  const { cardTestId } = dataTestIds || {};

  const tooltipMessage = button.show && button.tooltip?.show ? <FormattedMessage id={button.tooltip.messageId} /> : "";

  const navigate = useNavigate();

  const cardClickHandler = () => {
    if (!button?.show) {
      return;
    }

    if (typeof button.onClick === "function") {
      button.onClick();
    }

    if (button.link) {
      navigate(button.link);
    }
  };

  const renderContent = () => {
    if (isLoading) {
      return (
        <Skeleton>
          <CardLayout color={themeColor} />
        </Skeleton>
      );
    }

    return (
      <Tooltip title={tooltipMessage} placement={button.tooltip?.placement}>
        <Box height="100%" position="relative">
          {backdrop && backdrop.show ? (
            <>
              <Backdrop customClass="content" />
              <Typography
                sx={{
                  position: "absolute",
                  zIndex: () => theme.zIndex.drawer,
                  top: "50%",
                  left: "50%",
                  transform: "translate(-50%, -50%)"
                }}
                variant="body1"
                fontWeight="bold"
                textAlign="center"
              >
                {backdrop.message}
              </Typography>
            </>
          ) : null}
          <CardLayout button={button} cardTestId={cardTestId} onClick={cardClickHandler} color={themeColor}>
            {customContent || <SummaryCardContent {...{ value, caption, dataTestIds, icon, help, button }} />}
            {pdfId ? (
              <SummaryCardPdf pdfId={pdfId} renderData={() => ({ rawValue, rawCaption, color: themeColor, currency })} />
            ) : null}
          </CardLayout>
        </Box>
      </Tooltip>
    );
  };

  return renderContent();
};

export default SummaryCard;