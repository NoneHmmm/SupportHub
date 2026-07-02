import { useState, type ReactNode } from "react";
import { NavLink, Outlet, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { cn } from "../libs/cn";
import { Button } from "../components/ui/button";
import useAuthStore from "../stores/useAuthStore";
import LanguageSwitcher from "../components/common/LanguageSwitcher";
import ThemeToggle from "../components/common/ThemeToggle";
import Logo from "../components/common/Logo";

// ── Icons (inline SVG to avoid heavy imports) ──

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

const IconPortal = ({ className }: { className?: string }) => (
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
    <path d="M12 16v-4" />
    <path d="M12 8h.01" />
  </svg>
);

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

const IconChevronLeft = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="15 18 9 12 15 6" />
  </svg>
);

const IconChevronRight = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <polyline points="9 18 15 12 9 6" />
  </svg>
);

const IconSearch = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <circle cx="11" cy="11" r="8" />
    <line x1="21" y1="21" x2="16.65" y2="16.65" />
  </svg>
);

const IconLogOut = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    className={className}
  >
    <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
    <polyline points="16 17 21 12 16 7" />
    <line x1="21" y1="12" x2="9" y2="12" />
  </svg>
);

// ── Navigation items ──

interface NavItem {
  label: string;
  path: string;
  icon: (props: { className?: string }) => ReactNode;
  badge?: number;
}

// ── User avatar initials helper ──

function getInitials(name: string): string {
  return name
    .split(" ")
    .map((n) => n[0])
    .join("")
    .toUpperCase()
    .slice(0, 2);
}

// ── Collapsible sidebar ──

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
  items: NavItem[];
}

const Sidebar = ({ collapsed, onToggle, items }: SidebarProps) => {
  const { t } = useTranslation();
  const { user, logout } = useAuthStore();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <aside
      className={cn(
        "flex flex-col border-r border-notion-border bg-notion-bg transition-all duration-200 ease-in-out",
        collapsed ? "w-14" : "w-60",
      )}
    >
      {/* ── Logo / Brand ── */}
      <div
        className={cn(
          "flex h-14 items-center border-b border-notion-border px-3",
          collapsed ? "justify-center" : "justify-between",
        )}
      >
        <Logo
          showText={!collapsed}
          textClassName="text-sm"
          iconClassName="size-7 text-xs"
        />

        {!collapsed && (
          <button
            type="button"
            onClick={onToggle}
            className="flex size-6 cursor-pointer items-center justify-center rounded text-notion-text-tertiary hover:bg-notion-surface-hover hover:text-notion-text transition-colors"
            aria-label="Collapse sidebar"
          >
            <IconChevronLeft className="size-4" />
          </button>
        )}
      </div>

      {/* ── New Ticket button ── */}
      <div className={cn("px-2 pt-3", collapsed && "px-1")}>
        <Button
          variant="primary"
          size={collapsed ? "sm" : "md"}
          icon={IconPlus as never}
          iconPosition="left"
          className={cn(
            "w-full",
            collapsed ? "justify-center px-0" : "justify-start",
          )}
          onClick={() => navigate("/support/my-tickets")}
        >
          {!collapsed && "New Ticket"}
        </Button>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 overflow-y-auto px-1.5 py-3">
        <ul className="flex flex-col gap-0.5">
          {items.map((item) => (
            <li key={item.path}>
              <NavLink
                to={item.path}
                end
                className={({ isActive }) =>
                  cn(
                    "flex items-center gap-3 rounded-md px-3 py-2 text-sm font-medium transition-colors",
                    collapsed && "justify-center px-2",
                    isActive
                      ? "bg-notion-blue-bg text-notion-blue-text"
                      : "text-notion-text-secondary hover:bg-notion-surface-hover hover:text-notion-text",
                  )
                }
              >
                <item.icon className="size-4.5 shrink-0" />
                {!collapsed && (
                  <>
                    <span className="flex-1 truncate">{item.label}</span>
                    {item.badge !== undefined && item.badge > 0 && (
                      <span className="flex size-5 items-center justify-center rounded-full bg-notion-blue-text text-[11px] font-semibold text-white">
                        {item.badge}
                      </span>
                    )}
                  </>
                )}
                {collapsed && item.badge !== undefined && item.badge > 0 && (
                  <span className="absolute -top-1 -right-1 flex size-4 items-center justify-center rounded-full bg-notion-red-text text-[10px] font-semibold text-white">
                    {item.badge}
                  </span>
                )}
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      {/* ── Bottom section: user + collapse button when collapsed ── */}
      <div className="border-t border-notion-border p-2">
        {collapsed ? (
          <div className="flex flex-col items-center gap-1">
            {/* Collapse expand button */}
            <button
              type="button"
              onClick={onToggle}
              className="flex size-8 cursor-pointer items-center justify-center rounded-md text-notion-text-tertiary hover:bg-notion-surface-hover hover:text-notion-text transition-colors"
              aria-label="Expand sidebar"
            >
              <IconChevronRight className="size-4" />
            </button>
            {/* User avatar */}
            {user && (
              <button
                type="button"
                onClick={() => navigate("/support/my-tickets")}
                className="relative mt-1 flex size-8 cursor-pointer items-center justify-center rounded-full bg-notion-accent text-xs font-semibold text-notion-accent-text transition-opacity hover:opacity-80"
                title={user.fullName}
              >
                {getInitials(user.fullName)}
              </button>
            )}
          </div>
        ) : (
          <div className="flex items-center gap-2">
            {user ? (
              <>
                <span className="flex size-8 shrink-0 items-center justify-center rounded-full bg-notion-accent text-xs font-semibold text-notion-accent-text">
                  {getInitials(user.fullName)}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="truncate text-sm font-medium text-notion-text">
                    {user.fullName}
                  </p>
                  <p className="truncate text-xs text-notion-text-tertiary">
                    {user.email}
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleLogout}
                  className="flex cursor-pointer items-center justify-center rounded-md p-1.5 text-notion-text-tertiary hover:bg-notion-red-bg hover:text-notion-red-text transition-colors"
                  aria-label="Log out"
                >
                  <IconLogOut className="size-4" />
                </button>
              </>
            ) : (
              <Button
                variant="primary"
                size="sm"
                className="w-full"
                onClick={() => navigate("/login")}
              >
                {t("common.log_in")}
              </Button>
            )}
          </div>
        )}
      </div>
    </aside>
  );
};

// ── Main Layout ──

const SupportLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");

  const navItems: NavItem[] = [
    {
      label: "Portal",
      path: "/support/portal",
      icon: IconPortal,
    },
    {
      label: "My Tickets",
      path: "/support/my-tickets",
      icon: IconTicket,
      badge: 3, // example badge
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-notion-bg text-notion-text">
      {/* ── Sidebar ── */}
      <Sidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        items={navItems}
      />

      {/* ── Main content area ── */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* ── Top bar ── */}
        <header className="flex h-14 shrink-0 items-center gap-3 border-b border-notion-border bg-notion-bg px-4">
          {/* Search */}
          <div className="relative flex-1 max-w-md">
            <IconSearch className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-notion-text-tertiary" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search tickets..."
              className="block w-full rounded-md border border-notion-border bg-notion-surface py-1.5 pl-9 pr-3 text-sm text-notion-text placeholder:text-notion-text-tertiary transition-colors focus:border-notion-blue-text focus:outline-none focus:ring-1 focus:ring-notion-blue-text"
            />
          </div>

          <div className="flex items-center gap-2 ml-auto">
            <ThemeToggle variant="toggle" />

            {/* Language switcher */}
            <LanguageSwitcher />
          </div>
        </header>

        {/* ── Page content ── */}
        <main className="flex-1 overflow-auto bg-notion-bg-secondary">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SupportLayout;
