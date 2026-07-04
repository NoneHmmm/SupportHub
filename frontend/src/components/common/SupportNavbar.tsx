import { useState } from "react";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";

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

const SupportNavbar = () => {
  const [searchQuery, setSearchQuery] = useState("");

  return (
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
        <ThemeToggle variant="dropdown" />
        <LanguageSwitcher />
      </div>
    </header>
  );
};

export default SupportNavbar;
