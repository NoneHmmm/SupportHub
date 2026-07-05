import type { TicketMessage } from "../../types/Ticket";
import { cn } from "../../libs/cn";
import { formatDateTime, getUserAvatar } from "./utils";

interface TicketMessageBubbleProps {
  message: TicketMessage;
  isOwn: boolean;
}

export const TicketMessageBubble = ({
  message,
  isOwn,
}: TicketMessageBubbleProps) => {
  const sender = getUserAvatar(message.senderId as never);

  return (
    <div className={cn("flex gap-3", isOwn ? "flex-row-reverse" : "")}>
      {/* Avatar */}
      {sender.avatar ? (
        <img
          src={sender.avatar}
          alt={sender.name}
          className="mt-1 size-8 shrink-0 rounded-full object-cover"
        />
      ) : (
        <span className="mt-1 flex size-8 shrink-0 items-center justify-center rounded-full bg-notion-accent text-xs font-semibold text-notion-accent-text">
          {sender.initials}
        </span>
      )}

      {/* Content */}
      <div
        className={cn(
          "max-w-[75%] flex flex-col",
          isOwn ? "items-end" : "items-start",
        )}
      >
        <div
          className={cn(
            "rounded-lg px-4 py-2.5 text-sm leading-relaxed",
            isOwn
              ? "bg-notion-accent text-notion-accent-text"
              : "bg-notion-surface border border-notion-border text-notion-text",
          )}
        >
          <p className="whitespace-pre-wrap wrap-break-word">
            {message.message}
          </p>
        </div>
        <div
          className={cn(
            "mt-1 flex items-center gap-2 text-xs text-notion-text-tertiary",
            isOwn ? "justify-end" : "justify-start",
          )}
        >
          <span>{sender.name}</span>
          <span>{formatDateTime(message.createdAt)}</span>
          {message.isInternal && (
            <span className="inline-flex items-center gap-0.5 rounded bg-notion-orange-bg px-1.5 py-0.5 text-[10px] text-notion-orange-text">
              Nội bộ
            </span>
          )}
        </div>
      </div>
    </div>
  );
};
