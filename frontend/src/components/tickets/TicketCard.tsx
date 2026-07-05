import { useNavigate } from "react-router";
import { cn } from "../../libs/cn";
import type { Ticket } from "../../types/Ticket";
import { Button } from "../ui/button";
import { TicketStatusBadge } from "./TicketStatusBadge";
import { TicketPriorityBadge } from "./TicketPriorityBadge";
import { formatRelativeDate, getUserDisplayName } from "./utils";

const typeLabels: Record<string, string> = {
  bug: "Bug",
  feature: "Feature",
  task: "Task",
  other: "Khác",
};

const typeColors: Record<string, string> = {
  bug: "bg-notion-red-bg text-notion-red-text",
  feature: "bg-notion-purple-bg text-notion-purple-text",
  task: "bg-notion-blue-bg text-notion-blue-text",
  other: "bg-notion-gray-bg text-notion-gray-text",
};

interface TicketCardProps {
  ticket: Ticket;
  className?: string;
}

export const TicketCard = ({ ticket, className }: TicketCardProps) => {
  const navigate = useNavigate();

  return (
    <Button
      variant="ghost"
      asChild
      className={cn(
        "group w-full block! text-left p-4 h-auto rounded-lg border border-notion-border bg-notion-bg",
        "shadow-notion-sm transition-all duration-150",
        "hover:border-notion-accent-border hover:shadow-notion-md hover:-translate-y-0.5",
        className,
      )}
    >
      <button
        type="button"
        onClick={() => navigate(`/support/tickets/${ticket._id}`)}
      >
        {/* Top row: status, priority, date */}
        <div className="mb-2 flex items-center gap-2 flex-wrap">
          {ticket.status && <TicketStatusBadge status={ticket.status} />}
          {ticket.priority && (
            <TicketPriorityBadge priority={ticket.priority} />
          )}
          {ticket.type && (
            <span
              className={cn(
                "inline-flex items-center rounded-full px-2 py-0.5 text-xs font-medium",
                typeColors[ticket.type] ||
                  "bg-notion-gray-bg text-notion-gray-text",
              )}
            >
              {typeLabels[ticket.type] || ticket.type}
            </span>
          )}
          <span className="ml-auto text-xs text-notion-text-tertiary">
            {formatRelativeDate(ticket.createdAt)}
          </span>
        </div>

        {/* Title */}
        <h3 className="mb-1 text-sm font-semibold text-notion-text group-hover:text-notion-accent transition-colors">
          {ticket.title}
        </h3>

        {/* Description preview */}
        <p className="mb-3 line-clamp-2 text-sm text-notion-text-secondary leading-relaxed">
          {ticket.description}
        </p>

        {/* Bottom row: assignee, tags, rating */}
        <div className="flex items-center gap-2 flex-wrap">
          {ticket.assignedTo && (
            <span className="inline-flex items-center gap-1 text-xs text-notion-text-tertiary">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-3.5"
              >
                <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
              </svg>
              {getUserDisplayName(ticket.assignedTo)}
            </span>
          )}

          {ticket.tags && ticket.tags.length > 0 && (
            <div className="flex items-center gap-1 flex-wrap">
              {ticket.tags.slice(0, 3).map((tag) => (
                <span
                  key={tag}
                  className="inline-flex items-center rounded-md bg-notion-surface-hover px-2 py-0.5 text-xs text-notion-text-secondary"
                >
                  {tag}
                </span>
              ))}
              {ticket.tags.length > 3 && (
                <span className="text-xs text-notion-text-tertiary">
                  +{ticket.tags.length - 3}
                </span>
              )}
            </div>
          )}

          {ticket.rating > 0 && (
            <span className="ml-auto inline-flex items-center gap-0.5 text-xs text-notion-yellow-text">
              <svg
                viewBox="0 0 24 24"
                fill="currentColor"
                stroke="currentColor"
                strokeWidth="1"
                className="size-3.5"
              >
                <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
              </svg>
              {ticket.rating.toFixed(1)}
            </span>
          )}
        </div>

        {/* Ticket number */}
        <div className="mt-2 text-xs text-notion-text-tertiary">
          #{ticket.ticketNumber}
        </div>
      </button>
    </Button>
  );
};
