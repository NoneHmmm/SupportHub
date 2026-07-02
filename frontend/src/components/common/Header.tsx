import { useState, useEffect, useRef } from "react";
import { Link, useLocation, useNavigate } from "react-router";
import { useTranslation } from "react-i18next";
import { cn } from "../../libs/cn";
import { Button } from "../ui/button";
import useAuthStore from "../../stores/useAuthStore";
import LanguageSwitcher from "./LanguageSwitcher";
import ThemeToggle from "./ThemeToggle";
import Logo from "./Logo";

const NAV_ITEMS = [
  { labelKey: "common.features", href: "/#features" },
  { labelKey: "common.how_it_works", href: "/#how-it-works" },
  { labelKey: "common.faq", href: "/#faq" },
  { labelKey: "common.stats", href: "/#stats" },
];

// ── User dropdown (authenticated) ──
const UserMenu = () => {
  const { user, logout } = useAuthStore();
  const { t } = useTranslation();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
      }
    };
    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [open]);

  const initials = user?.fullName
    ? user.fullName
        .split(" ")
        .map((n) => n[0])
        .join("")
        .toUpperCase()
        .slice(0, 2)
    : "?";

  const handleLogout = () => {
    logout();
    setOpen(false);
    navigate("/");
  };

  return (
    <div ref={dropdownRef} className="relative">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="flex cursor-pointer items-center gap-2 rounded-md p-1.5 text-sm text-notion-text-secondary transition-colors hover:bg-notion-surface-hover hover:text-notion-text"
      >
        {user?.avatar ? (
          <img
            src={user.avatar}
            alt={user.fullName}
            className="size-7 rounded-full object-cover"
          />
        ) : (
          <span className="flex size-7 items-center justify-center rounded-full bg-notion-accent text-xs font-semibold text-notion-accent-text">
            {initials}
          </span>
        )}
        <span className="hidden xl:inline max-w-28 truncate font-medium">
          {user?.fullName}
        </span>
      </button>

      {open && (
        <div className="absolute right-0 top-full z-50 mt-1 min-w-48 rounded-lg border border-notion-border bg-notion-bg p-1 shadow-notion-md">
          {/* User info header */}
          <div className="border-b border-notion-border px-3 py-2.5">
            <p className="text-sm font-medium text-notion-text truncate">
              {user?.fullName}
            </p>
            <p className="text-xs text-notion-text-tertiary truncate">
              {user?.email}
            </p>
          </div>

          <button
            type="button"
            onClick={handleLogout}
            className="flex w-full cursor-pointer items-center gap-2 rounded-md px-3 py-2 text-sm text-notion-red-text transition-colors hover:bg-notion-red-bg my-0.5"
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
              <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
              <polyline points="16 17 21 12 16 7" />
              <line x1="21" y1="12" x2="9" y2="12" />
            </svg>
            {t("common.log_out")}
          </button>
        </div>
      )}
    </div>
  );
};

const Header = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuthStore();
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const location = useLocation();
  const menuRef = useRef<HTMLDivElement>(null);

  // Close menu on outside click
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) {
        setMenuOpen(false);
      }
    };
    if (menuOpen) {
      document.addEventListener("mousedown", handleClickOutside);
      return () =>
        document.removeEventListener("mousedown", handleClickOutside);
    }
  }, [menuOpen]);

  // Track scroll for subtle shadow
  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 8);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement>,
    href: string,
  ) => {
    if (!href.startsWith("/#")) return;
    const id = href.slice(2);
    if (location.pathname === "/") {
      e.preventDefault();
      const el = document.getElementById(id);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
        setMenuOpen(false);
      }
    }
  };

  return (
    <header
      className={cn(
        "sticky top-0 z-50 h-14 border-b border-notion-border bg-notion-bg/95 backdrop-blur-md transition-shadow duration-200",
        scrolled && "shadow-notion-sm",
      )}
    >
      <div className="mx-auto flex h-full max-w-6xl items-center justify-between px-5 lg:px-8">
        {/* ── Logo (left) ── */}
        <Logo textClassName="hidden sm:inline" />

        {/* ── Nav Items (center, desktop only) ── */}
        <nav className="hidden md:flex items-center gap-1">
          {NAV_ITEMS.map((item) => (
            <a
              key={item.href}
              href={item.href}
              onClick={(e) => handleNavClick(e, item.href)}
              className="rounded-md px-3 py-1.5 text-sm font-medium text-notion-text-secondary transition-colors hover:bg-notion-surface-hover hover:text-notion-text"
            >
              {t(item.labelKey)}
            </a>
          ))}
        </nav>

        {/* ── Right side (desktop) ── */}
        <div className="hidden md:flex items-center gap-2">
          <LanguageSwitcher />
          <ThemeToggle />
          {isAuthenticated && user ? (
            <>
              <Button
                asChild
                variant="primary"
                size="sm"
                className="rounded-md px-4 text-sm font-medium shadow-notion-sm"
              >
                <Link to="/support/my-tickets">{t("common.create_ticket")}</Link>
              </Button>
              <UserMenu />
            </>
          ) : (
            <>
              <Link
                to="/login"
                className="text-sm font-medium text-notion-text-secondary transition-colors hover:text-notion-text"
              >
                {t("common.log_in")}
              </Link>
              <Button
                asChild
                variant="primary"
                size="sm"
                className="rounded-md px-4 text-sm font-medium shadow-notion-sm"
              >
                <Link to="/register">{t("common.get_started")}</Link>
              </Button>
            </>
          )}
        </div>

        {/* ── Mobile right section ── */}
        <div className="flex md:hidden items-center gap-1">
          <LanguageSwitcher />
          <ThemeToggle />
          {isAuthenticated && user ? (
            <>
              <Button
                asChild
                variant="primary"
                size="sm"
                className="rounded-md px-2 text-xs font-medium shadow-notion-sm h-8"
              >
                <Link to="/support/my-tickets">{t("common.create_ticket")}</Link>
              </Button>
              <UserMenu />
            </>
          ) : (
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              className="flex items-center justify-center rounded-md p-2 text-notion-text-secondary transition-colors hover:bg-notion-surface-hover hover:text-notion-text"
              aria-label={menuOpen ? "Close menu" : "Open menu"}
            >
              {menuOpen ? (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="size-5"
                >
                  <path d="M18 6L6 18" />
                  <path d="M6 6l12 12" />
                </svg>
              ) : (
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="2"
                  strokeLinecap="round"
                  className="size-5"
                >
                  <path d="M4 6h16" />
                  <path d="M4 12h16" />
                  <path d="M4 18h16" />
                </svg>
              )}
            </button>
          )}
        </div>
      </div>

      {/* ── Mobile menu (guest only) ── */}
      <div
        ref={menuRef}
        className={cn(
          "absolute left-0 right-0 top-14 border-b border-notion-border bg-notion-bg shadow-notion-md md:hidden",
          "transition-all duration-200 ease-in-out overflow-hidden",
          menuOpen ? "max-h-96 opacity-100" : "max-h-0 opacity-0",
        )}
      >
        {!isAuthenticated && (
          <div className="flex flex-col gap-0.5 px-5 py-4">
            {NAV_ITEMS.map((item) => (
              <a
                key={item.href}
                href={item.href}
                onClick={(e) => handleNavClick(e, item.href)}
                className="rounded-md px-3 py-2.5 text-sm font-medium text-notion-text-secondary transition-colors hover:bg-notion-surface-hover hover:text-notion-text"
              >
                {t(item.labelKey)}
              </a>
            ))}
            <hr className="my-3 border-notion-border" />
            <Link
              to="/login"
              className="rounded-md px-3 py-2.5 text-sm font-medium text-notion-text-secondary transition-colors hover:bg-notion-surface-hover hover:text-notion-text"
            >
              {t("common.log_in")}
            </Link>
            <Button
              asChild
              variant="primary"
              size="sm"
              className="mt-1 w-full justify-center rounded-md text-sm font-medium shadow-notion-sm"
            >
              <Link to="/register">{t("common.get_started")}</Link>
            </Button>
          </div>
        )}
      </div>
    </header>
  );
};

export default Header;
