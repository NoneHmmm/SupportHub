import { useEffect, useState, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import useTicketStore from "../../stores/useTicketStore";
import useAuthStore from "../../stores/useAuthStore";
import { Button, Textarea } from "../../components/ui";
import { TicketStatusBadge } from "../../components/tickets/TicketStatusBadge";
import { TicketPriorityBadge } from "../../components/tickets/TicketPriorityBadge";
import type { TicketMessage } from "../../types/Ticket";

// ── Helpers ──

function formatDateTime(dateStr: string): string {
  const date = new Date(dateStr);
  return date.toLocaleDateString("vi-VN", {
    hour: "2-digit",
    minute: "2-digit",
    day: "2-digit",
    month: "2-digit",
    year: "numeric",
  });
}

function getUserAvatar(
  user?:
    | string
    | { _id: string; fullName: string; email: string; avatar?: string },
): { initials: string; avatar?: string; name: string } {
  if (!user || typeof user === "string")
    return {
      initials: "?",
      name: typeof user === "string" ? user : "Người dùng",
    };
  const initials = user.fullName
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
  return { initials, avatar: user.avatar, name: user.fullName };
}

// ── Rating Stars ──

const StarRating = ({
  value,
  onChange,
  readonly = false,
}: {
  value: number;
  onChange?: (v: number) => void;
  readonly?: boolean;
}) => (
  <div className="flex items-center gap-0.5">
    {[1, 2, 3, 4, 5].map((star) => (
      <button
        key={star}
        type="button"
        disabled={readonly}
        onClick={() => onChange?.(star)}
        className={`cursor-pointer transition-colors ${
          readonly ? "cursor-default" : "hover:scale-110"
        }`}
      >
        <svg
          viewBox="0 0 24 24"
          fill={star <= value ? "currentColor" : "none"}
          stroke="currentColor"
          strokeWidth="1.5"
          className={`size-5 ${
            star <= value
              ? "text-notion-yellow-text"
              : "text-notion-text-tertiary"
          }`}
        >
          <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2" />
        </svg>
      </button>
    ))}
  </div>
);

// ── Message Bubble ──

const MessageBubble = ({
  message,
  isOwn,
}: {
  message: TicketMessage;
  isOwn: boolean;
}) => {
  const sender = getUserAvatar(message.senderId as never);

  return (
    <div className={`flex gap-3 ${isOwn ? "flex-row-reverse" : ""}`}>
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
        className={`max-w-[75%] ${isOwn ? "items-end" : "items-start"} flex flex-col`}
      >
        <div
          className={`rounded-lg px-4 py-2.5 text-sm leading-relaxed ${
            isOwn
              ? "bg-notion-accent text-notion-accent-text"
              : "bg-notion-surface border border-notion-border text-notion-text"
          }`}
        >
          <p className="whitespace-pre-wrap break-words">{message.message}</p>
        </div>
        <div
          className={`mt-1 flex items-center gap-2 text-xs text-notion-text-tertiary ${
            isOwn ? "justify-end" : "justify-start"
          }`}
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

// ── Page ──

const TicketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user: authUser } = useAuthStore();
  const {
    currentTicket,
    loading,
    error,
    getTicketById,
    replyToTicket,
    closeTicket,
    rateTicket,
  } = useTicketStore();

  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) getTicketById(id);
  }, [id, getTicketById]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentTicket?.messages]);

  const handleSendReply = async () => {
    if (!reply.trim() || !id) return;
    setSending(true);
    const result = await replyToTicket(id, reply.trim());
    if (result) {
      setReply("");
      // Refresh ticket detail to get updated messages
      getTicketById(id);
    }
    setSending(false);
  };

  const handleCloseTicket = async () => {
    if (!id) return;
    await closeTicket(id);
    getTicketById(id);
  };

  const handleRateTicket = async (rating: number) => {
    if (!id) return;
    await rateTicket(id, rating);
    getTicketById(id);
  };

  // ── Loading state ──
  if (loading && !currentTicket) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-8">
        <div className="animate-pulse space-y-4">
          <div className="h-6 w-48 rounded bg-notion-surface-hover" />
          <div className="h-4 w-32 rounded bg-notion-surface-hover" />
          <div className="h-32 rounded-lg bg-notion-surface-hover" />
          <div className="space-y-3">
            {[1, 2, 3].map((i) => (
              <div key={i} className="flex gap-3">
                <div className="size-8 rounded-full bg-notion-surface-hover" />
                <div className="h-16 flex-1 rounded-lg bg-notion-surface-hover" />
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // ── Error / not found ──
  if (!currentTicket && !loading) {
    return (
      <div className="mx-auto max-w-4xl px-4 py-16 text-center">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="mx-auto mb-4 size-12 text-notion-text-tertiary"
        >
          <circle cx="12" cy="12" r="10" />
          <path d="M12 16v-4" />
          <path d="M12 8h.01" />
        </svg>
        <h2 className="mb-2 text-lg font-semibold text-notion-text">
          {error || "Không tìm thấy ticket"}
        </h2>
        <Button
          variant="primary"
          onClick={() => navigate("/support/my-tickets")}
        >
          Quay lại danh sách
        </Button>
      </div>
    );
  }

  const ticket = currentTicket!.ticket;
  const messages = currentTicket!.messages || [];
  const attachments = currentTicket!.attachments || [];
  const isResolvedOrClosed =
    ticket.status === "resolved" || ticket.status === "closed";

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* ── Back button ── */}
      <button
        type="button"
        onClick={() => navigate("/support/my-tickets")}
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-notion-text-secondary hover:text-notion-text transition-colors cursor-pointer"
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
          <path d="M19 12H5" />
          <polyline points="12 19 5 12 12 5" />
        </svg>
        Quay lại danh sách
      </button>

      {/* ── Ticket header card ── */}
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
          <span>Ngày tạo: {formatDateTime(ticket.createdAt)}</span>
          {ticket.assignedTo && (
            <span>
              Phụ trách:{" "}
              {typeof ticket.assignedTo === "string"
                ? ticket.assignedTo
                : ticket.assignedTo.fullName}
            </span>
          )}
          {ticket.dueDate && <span>Hạn: {formatDateTime(ticket.dueDate)}</span>}
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

      {/* ── Attachments ── */}
      {attachments.length > 0 && (
        <div className="mb-6">
          <h3 className="mb-2 text-sm font-semibold text-notion-text">
            Tệp đính kèm
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
      )}

      {/* ── Messages ── */}
      <div className="mb-6">
        <h2 className="mb-4 text-sm font-semibold text-notion-text">
          Phản hồi ({messages.length})
        </h2>

        {messages.length === 0 ? (
          <div className="rounded-lg border border-notion-border bg-notion-bg p-6 text-center text-sm text-notion-text-tertiary">
            Chưa có phản hồi nào.
          </div>
        ) : (
          <div className="space-y-4">
            {messages.map((msg) => {
              const authUserId =
                typeof authUser?._id === "string" ? authUser._id : "";
              const senderId =
                typeof msg.senderId === "string"
                  ? msg.senderId
                  : (msg.senderId as { _id?: string })?._id || "";
              const isOwn = senderId === authUserId;

              return (
                <MessageBubble key={msg._id} message={msg} isOwn={isOwn} />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Rating (only if resolved) ── */}
      {ticket.status === "resolved" && ticket.rating === 0 && (
        <div className="mb-6 rounded-lg border border-notion-border bg-notion-bg p-5 shadow-notion-sm">
          <h3 className="mb-2 text-sm font-semibold text-notion-text">
            Đánh giá mức độ hài lòng
          </h3>
          <p className="mb-3 text-xs text-notion-text-secondary">
            Vấn đề của bạn đã được giải quyết? Hãy đánh giá trải nghiệm của bạn.
          </p>
          <StarRating value={0} onChange={handleRateTicket} />
        </div>
      )}

      {/* ── Rating display (if already rated) ── */}
      {ticket.rating > 0 && (
        <div className="mb-6 rounded-lg border border-notion-border bg-notion-bg p-5 shadow-notion-sm">
          <h3 className="mb-2 text-sm font-semibold text-notion-text">
            Đánh giá của bạn
          </h3>
          <StarRating value={ticket.rating} readonly />
        </div>
      )}

      {/* ── Reply input (only if not closed) ── */}
      {!isResolvedOrClosed && (
        <div className="mb-6 rounded-lg border border-notion-border bg-notion-bg p-5 shadow-notion-sm">
          <h3 className="mb-3 text-sm font-semibold text-notion-text">
            Phản hồi của bạn
          </h3>
          <Textarea
            value={reply}
            onChange={(e) => setReply(e.target.value)}
            placeholder="Nhập phản hồi của bạn..."
            rows={4}
            wrapperClassName="w-full"
          />
          <div className="mt-3 flex items-center justify-between">
            {ticket.status !== "closed" && ticket.status !== "resolved" && (
              <Button
                variant="danger"
                size="sm"
                onClick={handleCloseTicket}
                loading={loading}
                disabled={loading}
              >
                Đóng ticket
              </Button>
            )}
            <div className="flex items-center gap-2 ml-auto">
              <Button
                variant="secondary"
                size="sm"
                onClick={() => setReply("")}
                disabled={!reply.trim()}
              >
                Xoá
              </Button>
              <Button
                variant="primary"
                size="sm"
                onClick={handleSendReply}
                loading={sending}
                disabled={sending || !reply.trim()}
              >
                Gửi phản hồi
              </Button>
            </div>
          </div>
        </div>
      )}

      {/* ── Closed / Resolved actions ── */}
      {isResolvedOrClosed && ticket.status !== "closed" && (
        <div className="rounded-lg border border-notion-border bg-notion-bg p-5 text-center shadow-notion-sm">
          <p className="mb-3 text-sm text-notion-text-secondary">
            Ticket này đã được đóng. Nếu bạn cần hỗ trợ thêm, hãy tạo ticket
            mới.
          </p>
          <Button
            variant="primary"
            size="md"
            onClick={() => navigate("/support/create-ticket")}
          >
            Tạo ticket mới
          </Button>
        </div>
      )}
    </div>
  );
};

export default TicketDetailPage;
