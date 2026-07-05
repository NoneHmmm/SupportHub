import { useEffect, useRef } from "react";
import { useParams, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import useTicketStore from "../../stores/useTicketStore";
import useAuthStore from "../../stores/useAuthStore";
import { Button } from "../../components/ui";
import {
  TicketDetailHeader,
  TicketAttachments,
  TicketMessageBubble,
  TicketRatingSection,
  TicketReplyForm,
  TicketClosedBanner,
} from "../../components/tickets";

const TicketDetailPage = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { t } = useTranslation();
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

  const messagesEndRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (id) getTicketById(id);
  }, [id, getTicketById]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [currentTicket?.messages]);

  const handleSendReply = async (message: string) => {
    if (!id) return;
    const result = await replyToTicket(id, message);
    if (result && id) {
      getTicketById(id);
    }
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
          {error || t("ticket.empty_filter_title")}
        </h2>
        <Button
          variant="primary"
          onClick={() => navigate("/support/my-tickets")}
        >
          {t("ticket.back_to_list")}
        </Button>
      </div>
    );
  }

  const ticket = currentTicket!.ticket;
  const messages = currentTicket!.messages || [];
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
        {t("ticket.back_to_list")}
      </button>

      {/* ── Ticket header ── */}
      <TicketDetailHeader ticket={ticket} />

      {/* ── Attachments ── */}
      <TicketAttachments attachments={currentTicket!.attachments || []} />

      {/* ── Messages ── */}
      <div className="mb-6">
        <h2 className="mb-4 text-sm font-semibold text-notion-text">
          {t("ticket.replies_count", { count: messages.length })}
        </h2>

        {messages.length === 0 ? (
          <div className="rounded-lg border border-notion-border bg-notion-bg p-6 text-center text-sm text-notion-text-tertiary">
            {t("ticket.no_replies")}
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
                <TicketMessageBubble key={msg._id} message={msg} isOwn={isOwn} />
              );
            })}
            <div ref={messagesEndRef} />
          </div>
        )}
      </div>

      {/* ── Rating (only if resolved and not yet rated) ── */}
      {ticket.status === "resolved" && ticket.rating === 0 && (
        <TicketRatingSection rating={0} onChange={handleRateTicket} />
      )}

      {/* ── Rating display (if already rated) ── */}
      {ticket.rating > 0 && (
        <TicketRatingSection rating={ticket.rating} readonly />
      )}

      {/* ── Reply input (only if not closed) ── */}
      {!isResolvedOrClosed && (
        <TicketReplyForm
          onSend={handleSendReply}
          onClose={handleCloseTicket}
          loading={loading}
        />
      )}

      {/* ── Closed / Resolved actions ── */}
      {isResolvedOrClosed && ticket.status !== "closed" && (
        <TicketClosedBanner />
      )}
    </div>
  );
};

export default TicketDetailPage;
