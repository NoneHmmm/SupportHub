import { useTranslation } from "react-i18next";
import { StarRating } from "./StarRating";

interface TicketRatingSectionProps {
  rating: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}

export const TicketRatingSection = ({
  rating,
  onChange,
  readonly = false,
}: TicketRatingSectionProps) => {
  const { t } = useTranslation();
  if (readonly && rating === 0) return null;

  return (
    <div className="mb-6 rounded-lg border border-notion-border bg-notion-bg p-5 shadow-notion-sm">
      <h3 className="mb-2 text-sm font-semibold text-notion-text">
        {readonly ? t("ticket.rate_your_rating") : t("ticket.rate_title")}
      </h3>

      {!readonly && (
        <p className="mb-3 text-xs text-notion-text-secondary">
          {t("ticket.rate_subtitle")}
        </p>
      )}

      <StarRating value={rating} onChange={onChange} readonly={readonly} />
    </div>
  );
};
