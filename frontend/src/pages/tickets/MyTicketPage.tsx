import { useEffect, useState, useCallback } from "react";
import { useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import useTicketStore from "../../stores/useTicketStore";
import { Button, Select } from "../../components/ui";
import { TicketCard } from "../../components/tickets/TicketCard";
import type {
  TicketStatus,
  TicketPriority,
  TicketType,
} from "../../types/Ticket";

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

const IconFilter = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polygon points="22 3 2 3 10 12.46 10 19 14 21 14 12.46 22 3" />
  </svg>
);

const IconRefresh = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="23 4 23 10 17 10" />
    <path d="M20.49 15a9 9 0 1 1-2.12-9.36L23 10" />
  </svg>
);

const MyTicketPage = () => {
  const navigate = useNavigate();
  const { t } = useTranslation();
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
            {t("ticket.title_my_tickets")}
          </h1>
          <p className="mt-1 text-sm text-notion-text-secondary">
            {t("ticket.subtitle_my_tickets")}
          </p>
        </div>
        <Button
          variant="primary"
          size="md"
          icon={IconPlus as never}
          onClick={() => navigate("/support/create-ticket")}
        >
          {t("ticket.create_new")}
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
              placeholder={t("ticket.search_placeholder")}
              className="block w-full rounded-md border border-notion-border bg-notion-surface py-2 pl-10 pr-3 text-sm text-notion-text placeholder:text-notion-text-tertiary transition-colors focus:border-notion-blue-text focus:outline-none focus:ring-1 focus:ring-notion-blue-text"
            />
          </div>
          <Button variant="secondary" size="md" type="submit">
            {t("ticket.filter_search")}
          </Button>
        </form>

        {/* Filter dropdowns */}
        <div className="flex flex-wrap items-center gap-3">
          <div className="flex items-center gap-1.5 text-sm text-notion-text-secondary">
            <IconFilter className="size-4" />
            <span>{t("ticket.filter_label")}</span>
          </div>

          <Select
            value={status}
            onChange={(e) => {
              setStatus(e.target.value);
              setPage(1);
            }}
            className="w-40"
            placeholder={t("ticket.filter_status_all")}
          >
            <option value="pending">{t("ticket.filter_status_pending")}</option>
            <option value="in_progress">
              {t("ticket.filter_status_in_progress")}
            </option>
            <option value="resolved">
              {t("ticket.filter_status_resolved")}
            </option>
            <option value="closed">{t("ticket.filter_status_closed")}</option>
          </Select>

          <Select
            value={priority}
            onChange={(e) => {
              setPriority(e.target.value);
              setPage(1);
            }}
            className="w-40"
            placeholder={t("ticket.filter_priority_all")}
          >
            <option value="low">{t("ticket.filter_priority_low")}</option>
            <option value="medium">{t("ticket.filter_priority_medium")}</option>
            <option value="high">{t("ticket.filter_priority_high")}</option>
          </Select>

          <Select
            value={type}
            onChange={(e) => {
              setType(e.target.value);
              setPage(1);
            }}
            className="w-40"
            placeholder={t("ticket.filter_type_all")}
          >
            <option value="bug">{t("ticket.filter_type_bug")}</option>
            <option value="feature">{t("ticket.filter_type_feature")}</option>
            <option value="task">{t("ticket.filter_type_task")}</option>
            <option value="other">{t("ticket.filter_type_other")}</option>
          </Select>

          <Select
            value={sort}
            onChange={(e) => {
              setSort(e.target.value);
              setPage(1);
            }}
            className="w-44"
          >
            <option value="-createdAt">{t("ticket.filter_sort_newest")}</option>
            <option value="createdAt">{t("ticket.filter_sort_oldest")}</option>
            <option value="-priority">
              {t("ticket.filter_sort_priority")}
            </option>
            <option value="-updatedAt">{t("ticket.filter_sort_recent")}</option>
          </Select>

          {hasActiveFilters && (
            <button
              type="button"
              onClick={handleResetFilters}
              className="inline-flex items-center gap-1 rounded-md px-3 py-1.5 text-sm text-notion-red-text hover:bg-notion-red-bg transition-colors cursor-pointer"
            >
              <IconRefresh className="size-3.5" />
              {t("ticket.filter_reset")}
            </button>
          )}

          {pagination && (
            <span className="ml-auto text-xs text-notion-text-tertiary">
              {t("ticket.pagination_total", { count: pagination.total })}
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
            {hasActiveFilters
              ? t("ticket.empty_filter_title")
              : t("ticket.empty_title")}
          </h3>
          <p className="mb-6 text-sm text-notion-text-secondary">
            {hasActiveFilters
              ? t("ticket.empty_filter_subtitle")
              : t("ticket.empty_subtitle")}
          </p>
          {!hasActiveFilters && (
            <Button
              variant="primary"
              size="md"
              icon={IconPlus as never}
              onClick={() => navigate("/support/create-ticket")}
            >
              {t("ticket.create_new")}
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
            {t("ticket.prev_page")}
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
            {t("ticket.next_page")}
          </Button>
        </div>
      )}
    </div>
  );
};

export default MyTicketPage;
