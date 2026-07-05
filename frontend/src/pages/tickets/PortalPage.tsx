import { useEffect } from "react";
import { useNavigate } from "react-router";
import useTicketStore from "../../stores/useTicketStore";
import useAuthStore from "../../stores/useAuthStore";
import { Button } from "../../components/ui";
import { TicketCard } from "../../components/tickets/TicketCard";

const IconPlus = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <line x1="12" y1="5" x2="12" y2="19" />
    <line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconTicket = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
    <path d="M7 11V7a5 5 0 0 1 10 0v4" />
  </svg>
);

const IconClock = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="12" cy="12" r="10" />
    <polyline points="12 6 12 12 16 14" />
  </svg>
);

const IconCheckCircle = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
    <polyline points="22 4 12 14.01 9 11.01" />
  </svg>
);

const PortalPage = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const { myTickets, loading, getMyTickets } = useTicketStore();

  useEffect(() => {
    getMyTickets({ limit: 5 });
  }, [getMyTickets]);

  const pendingTickets = myTickets.filter(
    (t) => t.status === "pending" || t.status === "in_progress",
  );
  const resolvedTickets = myTickets.filter((t) => t.status === "resolved");

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Welcome header */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-notion-text">
          Chào mừng, {user?.fullName || "bạn"}!
        </h1>
        <p className="mt-1 text-sm text-notion-text-secondary">
          Đây là cổng hỗ trợ khách hàng. Hãy tạo ticket mới hoặc theo dõi các
          ticket hiện tại.
        </p>
      </div>

      {/* Quick stats */}
      <div className="mb-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="rounded-lg border border-notion-border bg-notion-bg p-4 shadow-notion-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-notion-blue-bg">
              <IconTicket className="size-5 text-notion-blue-text" />
            </div>
            <div>
              <p className="text-2xl font-bold text-notion-text">
                {myTickets.length}
              </p>
              <p className="text-xs text-notion-text-secondary">
                Tổng số ticket
              </p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-notion-border bg-notion-bg p-4 shadow-notion-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-notion-orange-bg">
              <IconClock className="size-5 text-notion-orange-text" />
            </div>
            <div>
              <p className="text-2xl font-bold text-notion-text">
                {pendingTickets.length}
              </p>
              <p className="text-xs text-notion-text-secondary">Đang xử lý</p>
            </div>
          </div>
        </div>

        <div className="rounded-lg border border-notion-border bg-notion-bg p-4 shadow-notion-sm">
          <div className="flex items-center gap-3">
            <div className="flex size-10 items-center justify-center rounded-lg bg-notion-green-bg">
              <IconCheckCircle className="size-5 text-notion-green-text" />
            </div>
            <div>
              <p className="text-2xl font-bold text-notion-text">
                {resolvedTickets.length}
              </p>
              <p className="text-xs text-notion-text-secondary">
                Đã giải quyết
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Main content grid */}
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-3">
        {/* Left: Recent tickets */}
        <div className="lg:col-span-2">
          <div className="mb-4 flex items-center justify-between">
            <h2 className="text-lg font-semibold text-notion-text">
              Ticket gần đây
            </h2>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => navigate("/support/my-tickets")}
            >
              Xem tất cả
            </Button>
          </div>

          {loading ? (
            <div className="space-y-3">
              {[1, 2, 3].map((i) => (
                <div
                  key={i}
                  className="animate-pulse rounded-lg border border-notion-border bg-notion-bg p-4"
                >
                  <div className="mb-2 h-4 w-24 rounded bg-notion-surface-hover" />
                  <div className="mb-2 h-5 w-3/4 rounded bg-notion-surface-hover" />
                  <div className="h-4 w-1/2 rounded bg-notion-surface-hover" />
                </div>
              ))}
            </div>
          ) : myTickets.length === 0 ? (
            <div className="rounded-lg border border-notion-border bg-notion-bg p-8 text-center shadow-notion-sm">
              <IconTicket className="mx-auto mb-3 size-10 text-notion-text-tertiary" />
              <h3 className="mb-1 text-sm font-semibold text-notion-text">
                Chưa có ticket nào
              </h3>
              <p className="mb-4 text-sm text-notion-text-secondary">
                Tạo ticket đầu tiên để bắt đầu nhận hỗ trợ.
              </p>
              <Button
                variant="primary"
                size="md"
                icon={IconPlus as never}
                onClick={() => navigate("/support/create-ticket")}
              >
                Tạo ticket mới
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              {myTickets.map((ticket) => (
                <TicketCard key={ticket._id} ticket={ticket} />
              ))}
            </div>
          )}
        </div>

        {/* Right: Quick actions + info */}
        <div className="space-y-6">
          {/* Create ticket CTA */}
          <div className="rounded-lg border border-notion-border bg-notion-bg p-6 shadow-notion-sm">
            <h3 className="mb-2 text-sm font-semibold text-notion-text">
              Cần hỗ trợ?
            </h3>
            <p className="mb-4 text-sm text-notion-text-secondary leading-relaxed">
              Tạo ticket mới và đội ngũ hỗ trợ sẽ phản hồi bạn trong thời gian
              sớm nhất.
            </p>
            <Button
              variant="primary"
              size="md"
              icon={IconPlus as never}
              className="w-full justify-center"
              onClick={() => navigate("/support/create-ticket")}
            >
              Tạo ticket
            </Button>
          </div>

          {/* Status guide */}
          <div className="rounded-lg border border-notion-border bg-notion-bg p-6 shadow-notion-sm">
            <h3 className="mb-3 text-sm font-semibold text-notion-text">
              Trạng thái ticket
            </h3>
            <ul className="space-y-3 text-sm text-notion-text-secondary">
              <li className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-notion-yellow-text shrink-0" />
                <span>
                  <strong className="font-medium text-notion-text">
                    Chờ xử lý
                  </strong>{" "}
                  — Ticket đang chờ được phân công
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-notion-blue-text shrink-0" />
                <span>
                  <strong className="font-medium text-notion-text">
                    Đang xử lý
                  </strong>{" "}
                  — Ticket đang được nhân viên xử lý
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-notion-green-text shrink-0" />
                <span>
                  <strong className="font-medium text-notion-text">
                    Đã giải quyết
                  </strong>{" "}
                  — Vấn đề đã được xử lý
                </span>
              </li>
              <li className="flex items-center gap-2">
                <span className="size-2 rounded-full bg-notion-gray-text shrink-0" />
                <span>
                  <strong className="font-medium text-notion-text">
                    Đã đóng
                  </strong>{" "}
                  — Ticket đã kết thúc
                </span>
              </li>
            </ul>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PortalPage;
