import { cn } from "../../libs/cn";
import type { TicketPriority } from "../../types/Ticket";

const priorityConfig: Record<
  TicketPriority,
  { label: string; bg: string; text: string; dot: string }
> = {
  low: {
    label: "Thấp",
    bg: "bg-notion-green-bg",
    text: "text-notion-green-text",
    dot: "bg-notion-green-text",
  },
  medium: {
    label: "Trung bình",
    bg: "bg-notion-orange-bg",
    text: "text-notion-orange-text",
    dot: "bg-notion-orange-text",
  },
  high: {
    label: "Cao",
    bg: "bg-notion-red-bg",
    text: "text-notion-red-text",
    dot: "bg-notion-red-text",
  },
};

interface TicketPriorityBadgeProps {
  priority: TicketPriority;
  className?: string;
}

export const TicketPriorityBadge = ({
  priority,
  className,
}: TicketPriorityBadgeProps) => {
  const config = priorityConfig[priority];
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1.5 rounded-full px-2.5 py-0.5 text-xs font-medium",
        config.bg,
        config.text,
        className,
      )}
    >
      <span className={cn("size-1.5 rounded-full", config.dot)} />
      {config.label}
    </span>
  );
};
