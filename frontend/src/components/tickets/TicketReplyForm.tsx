import { useState } from "react";
import { useTranslation } from "react-i18next";
import { Button } from "../ui/button";
import { Textarea } from "../ui/Textarea";

interface TicketReplyFormProps {
  onSend: (message: string) => Promise<void>;
  onClose: () => void;
  loading?: boolean;
}

export const TicketReplyForm = ({
  onSend,
  onClose,
  loading = false,
}: TicketReplyFormProps) => {
  const { t } = useTranslation();
  const [reply, setReply] = useState("");
  const [sending, setSending] = useState(false);

  const handleSend = async () => {
    if (!reply.trim()) return;
    setSending(true);
    await onSend(reply.trim());
    setReply("");
    setSending(false);
  };

  return (
    <div className="mb-6 rounded-lg border border-notion-border bg-notion-bg p-5 shadow-notion-sm">
      <h3 className="mb-3 text-sm font-semibold text-notion-text">
        {t("ticket.reply_title")}
      </h3>

      <Textarea
        value={reply}
        onChange={(e) => setReply(e.target.value)}
        placeholder={t("ticket.reply_placeholder")}
        rows={4}
        wrapperClassName="w-full"
      />

      <div className="mt-3 flex items-center justify-between">
        <Button
          variant="danger"
          size="sm"
          onClick={onClose}
          loading={loading}
          disabled={loading}
        >
          {t("ticket.close_ticket")}
        </Button>

        <div className="flex items-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            onClick={() => setReply("")}
            disabled={!reply.trim()}
          >
            {t("ticket.clear")}
          </Button>
          <Button
            variant="primary"
            size="sm"
            onClick={handleSend}
            loading={sending}
            disabled={sending || !reply.trim()}
          >
            {t("ticket.send_reply")}
          </Button>
        </div>
      </div>
    </div>
  );
};
