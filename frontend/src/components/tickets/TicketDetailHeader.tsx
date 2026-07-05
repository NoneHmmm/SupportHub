import { useTranslation } from "react-i18next";
import type { Ticket } from "../../types/Ticket";
import { TicketStatusBadge } from "./TicketStatusBadge";
import { TicketPriorityBadge } from "./TicketPriorityBadge";
import { formatDateTime } from "./utils";

interface TicketDetailHeaderProps {
  ticket: Ticket;
}

export const TicketDetailHeader = ({ ticket }: TicketDetailHeaderProps) => {
  const { t } = useTranslation();

  return (
    <div className="mb-6 rounded-lg border border-notion-border bg-notion-bg p-6 shadow-notion-sm">
      {/* Top: badges + ticket number */}
      <div className="mb-3 flex flex-wrap items-start justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          {ticket.status && <TicketStatusBadge status={ticket.status} />}
          {ticket.priority && (
            <TicketPriorityBadge priority={ticket.priority} />
          )}
          {ticket.type && (
            <span className="inline-flex items-center rounded-full bg-notion-gray-bg px-2.5 py-0.5 text-xs font-medium text-notion-gray-text">
              {ticket.type}
            </span>
          )}
        </div>
        <span className="text-xs text-notion-text-tertiary">
          #{ticket.ticketNumber}
        </span>
      </div>

      {/* Title */}
      <h1 className="mb-2 text-xl font-bold tracking-tight text-notion-text">
        {ticket.title}
      </h1>

      {/* Description */}
      <p className="mb-4 whitespace-pre-wrap text-sm text-notion-text-secondary leading-relaxed">
        {ticket.description}
      </p>

      {/* Meta row */}
      <div className="flex flex-wrap items-center gap-4 text-xs text-notion-text-tertiary">
        <span>
          {t("common.created_date")}: {formatDateTime(ticket.createdAt)}
        </span>
        {ticket.assignedTo && (
          <span>
            {t("common.assigned_to")}:{" "}
            {typeof ticket.assignedTo === "string"
              ? ticket.assignedTo
              : ticket.assignedTo.fullName}
          </span>
        )}
        {ticket.dueDate && (
          <span>
            {t("common.due_date")}: {formatDateTime(ticket.dueDate)}
          </span>
        )}
        {ticket.tags && ticket.tags.length > 0 && (
          <div className="flex items-center gap-1">
            {ticket.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-md bg-notion-surface-hover px-2 py-0.5 text-xs"
              >
                {tag}
              </span>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
