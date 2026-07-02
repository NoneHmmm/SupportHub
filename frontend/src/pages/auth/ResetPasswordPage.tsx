import { useState } from "react";
import { useParams, Link } from "react-router";
import { useTranslation } from "react-i18next";
import useAuthStore from "../../stores/useAuthStore";

const ResetPasswordPage = () => {
  const { t } = useTranslation();
  const { token } = useParams<{ token: string }>();
  const { resetPassword, isLoading } = useAuthStore();

  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [reset, setReset] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [expired, setExpired] = useState(false);

  // ── No token in URL → show error ──
  if (!token || token.trim() === "") {
    return (
      <div className="flex min-h-screen items-center justify-center bg-notion-bg-secondary p-5">
        <CardShell>
          <ExpiredState t={t} />
        </CardShell>
      </div>
    );
  }

  // ── Success state ──
  if (reset) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-notion-bg-secondary p-5">
        <CardShell>
          <div className="text-center">
            <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-notion-green-bg">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="size-8 text-notion-green-text"
              >
                <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14" />
                <polyline points="22 4 12 14.01 9 11.01" />
              </svg>
            </div>

            <h1 className="text-2xl font-bold tracking-tight text-notion-text">
              {t("auth.reset_password_success_title")}
            </h1>
            <p className="mt-2 text-sm text-notion-text-secondary">
              {t("auth.reset_password_success_subtitle")}
            </p>

            <Link
              to="/login"
              className="mt-8 inline-flex items-center justify-center gap-1.5 rounded-md bg-notion-accent px-5 py-2.5 text-sm font-medium text-notion-accent-text transition-colors hover:bg-notion-accent-hover active:opacity-85"
            >
              {t("auth.reset_password_to_login")}
            </Link>
          </div>
        </CardShell>
      </div>
    );
  }

  // ── Expired / invalid token state ──
  if (expired) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-notion-bg-secondary p-5">
        <CardShell>
          <ExpiredState t={t} />
        </CardShell>
      </div>
    );
  }

  // ── Form state ──
  const validate = () => {
    if (!password) {
      setError(t("auth.error_required"));
      return false;
    }
    if (password.length < 8) {
      setError(t("auth.error_password_min"));
      return false;
    }
    if (!confirmPassword) {
      setError(t("auth.error_required"));
      return false;
    }
    if (password !== confirmPassword) {
      setError(t("auth.error_password_mismatch"));
      return false;
    }
    setError(undefined);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await resetPassword(token, password);
      setReset(true);
    } catch {
      setExpired(true);
    }
  };

  return (
    <div className="flex min-h-screen items-center justify-center bg-notion-bg-secondary p-5">
      <CardShell>
        {/* Heading */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold tracking-tight text-notion-text">
            {t("auth.reset_password_title")}
          </h1>
          <p className="mt-1.5 text-sm text-notion-text-secondary">
            {t("auth.reset_password_subtitle")}
          </p>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="space-y-4">
          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-notion-text">
              {t("auth.password_label")}
            </span>
            <input
              name="password"
              type="password"
              placeholder={t("auth.password_placeholder")}
              value={password}
              onChange={(e) => {
                setPassword(e.target.value);
                if (error) setError(undefined);
              }}
              autoComplete="new-password"
              className="block w-full rounded-md border border-notion-border bg-notion-surface px-3 py-2 text-sm text-notion-text placeholder:text-notion-text-tertiary transition-colors duration-100 ease-in focus:border-notion-blue-text focus:outline-none focus:ring-1 focus:ring-notion-blue-text"
            />
          </label>

          <label className="flex flex-col gap-1">
            <span className="text-sm font-medium text-notion-text">
              {t("auth.confirm_password_label")}
            </span>
            <input
              name="confirmPassword"
              type="password"
              placeholder={t("auth.confirm_password_placeholder")}
              value={confirmPassword}
              onChange={(e) => {
                setConfirmPassword(e.target.value);
                if (error) setError(undefined);
              }}
              autoComplete="new-password"
              className="block w-full rounded-md border border-notion-border bg-notion-surface px-3 py-2 text-sm text-notion-text placeholder:text-notion-text-tertiary transition-colors duration-100 ease-in focus:border-notion-blue-text focus:outline-none focus:ring-1 focus:ring-notion-blue-text"
            />
          </label>

          {error && <p className="text-xs text-notion-red-text">{error}</p>}

          <button
            type="submit"
            disabled={isLoading}
            className="inline-flex w-full items-center justify-center rounded-md bg-notion-accent px-4 py-2.5 text-sm font-medium text-notion-accent-text transition-colors duration-100 ease-in hover:bg-notion-accent-hover active:opacity-85 disabled:opacity-40 disabled:cursor-not-allowed cursor-pointer"
          >
            {isLoading ? (
              <svg
                className="h-4 w-4 animate-spin"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
              </svg>
            ) : (
              t("auth.reset_password_submit")
            )}
          </button>
        </form>
      </CardShell>
    </div>
  );
};

// ── Shared card wrapper ──
const CardShell = ({ children }: { children: React.ReactNode }) => (
  <div className="w-full max-w-sm rounded-xl border border-notion-border bg-notion-bg p-8 shadow-notion-md">
    {/* Logo */}
    <Link
      to="/"
      className="mb-8 inline-flex items-center gap-1.5 text-lg font-semibold tracking-tight text-notion-text"
    >
      <span className="flex size-7 items-center justify-center rounded-md bg-notion-text text-xs font-bold text-notion-bg">
        S
      </span>
      SupportHub
    </Link>
    {children}
  </div>
);

// ── Expired/invalid token state ──
const ExpiredState = ({ t }: { t: (key: string) => string }) => (
  <div className="text-center">
    <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-notion-red-bg">
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="round"
        strokeLinejoin="round"
        className="size-8 text-notion-red-text"
      >
        <circle cx="12" cy="12" r="10" />
        <path d="M12 16v-4" />
        <path d="M12 8h.01" />
      </svg>
    </div>

    <h1 className="text-2xl font-bold tracking-tight text-notion-text">
      {t("auth.reset_password_expired")}
    </h1>
    <p className="mt-2 text-sm text-notion-text-secondary">
      {t("auth.reset_password_expired_hint")}
    </p>

    <Link
      to="/forgot-password"
      className="mt-8 inline-flex items-center justify-center gap-1.5 rounded-md bg-notion-accent px-5 py-2.5 text-sm font-medium text-notion-accent-text transition-colors hover:bg-notion-accent-hover active:opacity-85"
    >
      {t("auth.forgot_password_back_to_login")}
    </Link>
  </div>
);

export default ResetPasswordPage;
