import { Outlet, useLocation } from "react-router";
import { useTranslation } from "react-i18next";
import LanguageSwitcher from "../components/common/LanguageSwitcher";
import ThemeToggle from "../components/common/ThemeToggle";
import Logo from "../components/common/Logo";

const AuthLayout = () => {
  const { t } = useTranslation();
  const location = useLocation();
  const isRegister = location.pathname === "/register";

  return (
    <div className="min-h-screen bg-notion-bg-secondary">
      <div className="flex min-h-screen">
        {/* ── Left panel: Branding ── */}
        <div className="relative hidden w-1/2 flex-col justify-between overflow-hidden border-r border-notion-border bg-notion-bg p-8 lg:flex xl:p-12">
          {/* Ambient blobs */}
          <div className="pointer-events-none absolute inset-0">
            <div className="absolute -top-24 -right-24 h-100 w-100 rounded-full bg-notion-blue-bg/40 blur-3xl" />
            <div className="absolute -bottom-24 -left-24 h-80 w-80 rounded-full bg-notion-green-bg/40 blur-3xl" />
          </div>

          {/* Logo */}
          <div className="relative">
            <Logo />
          </div>

          {/* Hero messaging */}
          <div className="relative max-w-md">
            <div className="inline-flex items-center gap-1.5 rounded-full border border-notion-border bg-notion-bg-secondary px-3 py-1 text-xs font-medium text-notion-text-secondary">
              <span className="size-1.5 rounded-full bg-notion-green-text" />
              {t("hero.eyebrow")}
            </div>

            <h2 className="mt-6 text-2xl font-bold leading-snug tracking-tight text-notion-text xl:text-3xl">
              {isRegister
                ? t("auth.left_title_register")
                : t("auth.left_title_login")}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-notion-text-secondary">
              {t("auth.left_subtitle")}
            </p>

            {/* Trust indicators */}
            <div className="mt-8 space-y-4">
              {[
                {
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-5 text-notion-green-text"
                    >
                      <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                      <polyline points="22 4 12 14.01 9 11.01" />
                    </svg>
                  ),
                  text: t("common.ticket_routing"),
                },
                {
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-5 text-notion-blue-text"
                    >
                      <circle cx="12" cy="12" r="10" />
                      <polyline points="12 6 12 12 16 14" />
                    </svg>
                  ),
                  text: t("common.response_time"),
                },
                {
                  icon: (
                    <svg
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="size-5 text-notion-purple-text"
                    >
                      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
                      <circle cx="9" cy="7" r="4" />
                      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
                      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
                    </svg>
                  ),
                  text: t("common.resolved_count"),
                },
              ].map((item, i) => (
                <div key={i} className="flex items-center gap-3">
                  {item.icon}
                  <span className="text-sm text-notion-text-secondary">
                    {item.text}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Footer */}
          <p className="relative text-xs text-notion-text-tertiary">
            {t("footer.copyright", { year: new Date().getFullYear() })}
          </p>
        </div>

        {/* ── Right panel: Auth form ── */}
        <div className="flex w-full flex-col lg:w-1/2">
          {/* Top bar (mobile) */}
          <nav className="flex h-14 items-center justify-between border-b border-notion-border bg-notion-bg/95 px-5 backdrop-blur-md lg:hidden">
            <Logo textClassName="text-sm" />
            <div className="flex items-center gap-1">
              <LanguageSwitcher />
              <ThemeToggle variant="toggle" />
            </div>
          </nav>

          {/* Top-right controls (desktop) */}
          <div className="hidden lg:flex lg:absolute lg:right-6 lg:top-4 lg:z-10 lg:items-center lg:gap-1">
            <LanguageSwitcher />
            <ThemeToggle variant="toggle" />
          </div>

          {/* Form area — centered */}
          <div className="flex flex-1 items-center justify-center px-5 py-12 sm:px-8">
            <Outlet />
          </div>
        </div>
      </div>
    </div>
  );
};

export default AuthLayout;
