import { useState } from "react";
import { Outlet } from "react-router";
import { useTranslation } from "react-i18next";
import SupportSidebar from "../components/common/SupportSidebar";
import SupportNavbar from "../components/common/SupportNavbar";

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

// ── Main Layout ──

const SupportLayout = () => {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const { t } = useTranslation();

  const navItems = [
    {
      label: t("nav.portal"),
      path: "/support/portal",
      icon: IconPortal,
    },
    {
      label: t("nav.my_tickets"),
      path: "/support/my-tickets",
      icon: IconTicket,
    },
    {
      label: t("nav.new_ticket"),
      path: "/support/create-ticket",
      icon: IconPlus,
    },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-notion-bg text-notion-text">
      <SupportSidebar
        collapsed={sidebarCollapsed}
        onToggle={() => setSidebarCollapsed((c) => !c)}
        items={navItems}
      />

      <div className="flex flex-1 flex-col overflow-hidden">
        <SupportNavbar />

        <main className="flex-1 overflow-auto bg-notion-bg-secondary">
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default SupportLayout;
