import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";

export const TicketClosedBanner = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();

  return (
    <div className="rounded-lg border border-notion-border bg-notion-bg p-5 text-center shadow-notion-sm">
      <p className="mb-3 text-sm text-notion-text-secondary">
        {t("ticket.closed_banner_text")}
      </p>
      <Button
        variant="primary"
        size="md"
        onClick={() => navigate("/support/create-ticket")}
      >
        {t("ticket.closed_banner_action")}
      </Button>
    </div>
  );
};
