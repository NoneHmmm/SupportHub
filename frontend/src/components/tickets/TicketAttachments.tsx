import { useTranslation } from "react-i18next";
import type { Attachment } from "../../types/Ticket";

interface TicketAttachmentsProps {
  attachments: Attachment[];
}

export const TicketAttachments = ({ attachments }: TicketAttachmentsProps) => {
  const { t } = useTranslation();
  if (attachments.length === 0) return null;

  return (
    <div className="mb-6">
      <h3 className="mb-2 text-sm font-semibold text-notion-text">
        {t("ticket.attachments_title")}
      </h3>
      <div className="flex flex-wrap gap-2">
        {attachments.map((att) => (
          <a
            key={att._id}
            href={att.fileUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-lg border border-notion-border bg-notion-bg px-3 py-2 text-sm text-notion-blue-text hover:bg-notion-blue-bg transition-colors shadow-notion-sm"
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="size-4"
            >
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
              <polyline points="17 8 12 3 7 8" />
              <line x1="12" y1="3" x2="12" y2="15" />
            </svg>
            {att.fileName}
          </a>
        ))}
      </div>
    </div>
  );
};
