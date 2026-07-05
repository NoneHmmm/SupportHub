import { cn } from "../../libs/cn";
import type { TicketStatus } from "../../types/Ticket";

const statusConfig: Record<TicketStatus, { label: string; bg: string; text: string }> = {
  pending: { label: "Chờ xử lý", bg: "bg-notion-yellow-bg", text: "text-notion-yellow-text" },
  in_progress: { label: "Đang xử lý", bg: "bg-notion-blue-bg", text: "text-notion-blue-text" },
  resolved: { label: "Đã giải quyết", bg: "bg-notion-green-bg", text: "text-notion-green-text" },
  closed: { label: "Đã đóng", bg: "bg-notion-gray-bg", text: "text-notion-gray-text" },
};

interface TicketStatusBadgeProps {
  status: TicketStatus;
  className?: string;
}

export const TicketStatusBadge = ({ status, className }: TicketStatusBadgeProps) => {
  const config = statusConfig[status];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.bg,
        config.text,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", config.bg === "bg-notion-gray-bg" ? "bg-notion-gray-text" : "currentColor")} />
      {config.label}
    </span>
  );
};
