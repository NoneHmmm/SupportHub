import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import useTicketStore from "../../stores/useTicketStore";
import { Button } from "../../components/ui";
import { TicketCard } from "../../components/tickets/TicketCard";
import type { TicketStatus, TicketPriority, TicketType } from "../../types/Ticket";

const IconPlus = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <line x1="12" y1="5" x2="12" y2="19" /><line x1="5" y1="12" x2="19" y2="12" />
  </svg>
);

const IconFilter = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const IconRefresh = ({ className }: { className?: string }) => (
  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

const statusOptions: { value: string; label: string }[] = [
  { value: "", label: "Tất cả trạng thái" },
  { value: "pending", label: "Chờ xử lý" },
  { value: "in_progress", label: "Đang xử lý" },
  { value: "resolved", label: "Đã giải quyết" },
  { value: "closed", label: "Đã đóng" },
];

const priorityOptions: { value: string; label: string }[] = [
  { value: "", label: "Tất cả mức độ" },
  { value: "low", label: "Thấp" },
  { value: "medium", label: "Trung bình" },
  { value: "high", label: "Cao" },
];

const typeOptions: { value: string; label: string }[] = [
  { value: "", label: "Tất cả loại" },
  { value: "bug", label: "Bug" },
  { value: "feature", label: "Feature" },
  { value: "task", label: "Task" },
  { value: "other", label: "Khác" },
];

const sortOptions: { value: string; label: string }[] = [
  { value: "-createdAt", label: "Mới nhất" },
  { value: "createdAt", label: "Cũ nhất" },
  { value: "-priority", label: "Mức độ ưu tiên" },
  { value: "-updatedAt", label: "Cập nhật gần đây" },
];

const MyTicketPage = () => {
  const navigate = useNavigate();
  const { myTickets, loading, pagination, getMyTickets } = useTicketStore();

  // Filter state
  const [search, setSearch] = useState("");
  const [status, setStatus] = useState("");
  const [priority, setPriority] = useState("");
  const [type, setType] = useState("");
  const [sort, setSort] = useState("-createdAt");
  const [page, setPage] = useState(1);

  const fetchTickets = useCallback(() => {
    getMyTickets({
      search: search || undefined,
      status: (status || undefined) as TicketStatus | undefined,
      priority: (priority || undefined) as TicketPriority | undefined,
      type: (type || undefined) as TicketType | undefined,
      sort: sort || undefined,
      page,
      limit: 10,
    });
  }, [search, status, priority, type, sort, page, getMyTickets]);

  useEffect(() => {
    fetchTickets();
  }, [fetchTickets]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    setPage(1);
    fetchTickets();
  };

  const handleResetFilters = () => {
    setSearch("");
    setStatus("");
    setPriority("");
    setType("");
    setSort("-createdAt");
    setPage(1);
  };

  const hasActiveFilters = search || status || priority || type;

  return (
    <div className="mx-auto max-w-5xl px-4 py-8 sm:px-6 lg:px-8">
      {/* Header */}
      <div className="mb-6 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold tracking-tight text-notion-text">
            Ticket của tôi
          </h1>
          <p className="mt-1 text-sm text-notion-text-secondary">
            Quản lý và theo dõi tất cả các ticket bạn đã gửi.
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={IconPlus as never}
          onClick={() => navigate("/support/create-ticket")}
        >
          Tạo ticket
        </Button>
      </div>

      {/* Filters */}
      <div className="mb-6 space-y-4">
        {/* Search bar */}
        <form onSubmit={handleSearch} className="flex gap-2">
          <div className="relative flex-1">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-notion-text-tertiary"
            >
              <circle cx="11" cy="11" r="8" />
              <line x1="21" y1="21" x2="16.65" y2="16.65" />
            </svg>
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Tìm kiếm ticket..."
              className="block w-full rounded-md border border-notion-border bg-notion-surface py-2 pl-10 pr-3 text-sm text-notion-text placeholder:text-notion-text-tertiary transition-colors focus:border-notion-blue-text focus:outline-none focus:ring-1 focus:ring-notion-blue-text"
            />
          </div>
          <Button variant="secondary" size="md" type="submit">
            Tìm kiếm
          </Button>
        </form>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-notion-text-secondary">
            <IconFilter className="size-4" />
            <span>Lọc:</span>
          </div>

          <select
            value={status}
            onChange={(e) => { setStatus(e.target.value); setPage(1); }}
            className="rounded-md border border-notion-border bg-notion-surface px-3 py-1.5 text-sm text-notion-text transition-colors focus:border-notion-blue-text focus:outline-none focus:ring-1 focus:ring-notion-blue-text"
          >
            {statusOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <select
            value={priority}
            onChange={(e) => { setPriority(e.target.value); setPage(1); }}
            className="rounded-md border border-notion-border bg-notion-surface px-3 py-1.5 text-sm text-notion-text transition-colors focus:border-notion-blue-text focus:outline-none focus:ring-1 focus:ring-notion-blue-text"
          >
            {priorityOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <select
            value={type}
            onChange={(e) => { setType(e.target.value); setPage(1); }}
            className="rounded-md border border-notion-border bg-notion-surface px-3 py-1.5 text-sm text-notion-text transition-colors focus:border-notion-blue-text focus:outline-none focus:ring-1 focus:ring-notion-blue-text"
          >
            {typeOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          <select
            value={sort}
            onChange={(e) => { setSort(e.target.value); setPage(1); }}
            className="rounded-md border border-notion-border bg-notion-surface px-3 py-1.5 text-sm text-notion-text transition-colors focus:border-notion-blue-text focus:outline-none focus:ring-1 focus:ring-notion-blue-text"
          >
            {sortOptions.map((opt) => (
              <option key={opt.value} value={opt.value}>{opt.label}</option>
            ))}
          </select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-notion-red-text hover:bg-notion-red-bg transition-colors cursor-pointer"
            >
              <IconRefresh className="size-3.5" />
              Xoá lọc
            </button>
          )}

          {pagination && (
            <span className="ml-auto text-xs text-notion-text-tertiary">
              {pagination.total} ticket
            </span>
          )}
        </div>
      </div>

      {/* Ticket list */}
      {loading ? (
        <div className="space-y-3">
          {[1, 2, 3, 4, 5].map((i) => (
            <div
              key={i}
              className="animate-pulse rounded-lg border border-notion-border bg-notion-bg p-4"
            >
              <div className="mb-2 flex gap-2">
                <div className="h-5 w-20 rounded-full bg-notion-surface-hover" />
                <div className="h-5 w-16 rounded-full bg-notion-surface-hover" />
              </div>
              <div className="mb-2 h-5 w-3/4 rounded bg-notion-surface-hover" />
              <div className="h-4 w-1/2 rounded bg-notion-surface-hover" />
            </div>
          ))}
        </div>
      ) : myTickets.length === 0 ? (
        <div className="rounded-lg border border-notion-border bg-notion-bg p-12 text-center shadow-notion-sm">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="mx-auto mb-4 size-12 text-notion-text-tertiary"
          >
            <rect x="3" y="11" width="18" height="11" rx="2" ry="2" />
            <path d="M7 11V7a5 5 0 0 1 10 0v4" />
          </svg>
          <h3 className="mb-1 text-lg font-semibold text-notion-text">
            {hasActiveFilters ? "Không tìm thấy ticket" : "Chưa có ticket nào"}
          </h3>
          <p className="mb-6 text-sm text-notion-text-secondary">
            {hasActiveFilters
              ? "Thử thay đổi bộ lọc hoặc từ khóa tìm kiếm."
              : "Tạo ticket đầu tiên để bắt đầu nhận hỗ trợ."}
          </p>
          {!hasActiveFilters && (
            <Button
              variant="primary"
              size="md"
              icon={IconPlus as never}
              onClick={() => navigate("/support/create-ticket")}
            >
              Tạo ticket mới
            </Button>
          )}
        </div>
      ) : (
        <div className="space-y-3">
          {myTickets.map((ticket) => (
            <TicketCard key={ticket._id} ticket={ticket} />
          ))}
        </div>
      )}

      {/* Pagination */}
      {pagination && pagination.totalPages > 1 && (
        <div className="mt-8 flex items-center justify-center gap-2">
          <Button
            variant="secondary"
            size="sm"
            disabled={page <= 1}
            onClick={() => setPage((p) => Math.max(1, p - 1))}
          >
            Trước
          </Button>

          {Array.from({ length: pagination.totalPages }, (_, i) => i + 1).map(
            (pageNum) => (
              <button
                key={pageNum}
                type="button"
                onClick={() => setPage(pageNum)}
                className={`inline-flex h-8 w-8 items-center justify-center rounded-md text-sm font-medium transition-colors cursor-pointer ${
                  pageNum === page
                    ? "bg-notion-accent text-notion-accent-text"
                    : "text-notion-text-secondary hover:bg-notion-surface-hover hover:text-notion-text"
                }`}
              >
                {pageNum}
              </button>
            ),
          )}

          <Button
            variant="secondary"
            size="sm"
            disabled={page >= pagination.totalPages}
            onClick={() => setPage((p) => p + 1)}
          >
            Sau
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyTicketPage;
