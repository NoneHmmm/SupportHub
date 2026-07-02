import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import useAuthStore from "../../stores/useAuthStore";

const ForgotPasswordPage = () => {
  const { t } = useTranslation();
  const { forgotPassword, isLoading } = useAuthStore();

  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [error, setError] = useState<string | undefined>();

  const validate = () => {
    if (!email.trim()) {
      setError(t("auth.error_required"));
      return false;
    }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError(t("auth.error_invalid_email"));
      return false;
    }
    setError(undefined);
    return true;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await forgotPassword(email);
      setSent(true);
    } catch {
      setError(t("auth.forgot_password_error"));
    }
  };

  // ── Success state ──
  if (sent) {
    return (
      <div className="w-full max-w-sm text-center">
        {/* Mail icon */}
        <div className="mx-auto mb-6 flex size-16 items-center justify-center rounded-full bg-notion-blue-bg">
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            className="size-8 text-notion-blue-text"
          >
            <rect x="2" y="4" width="20" height="16" rx="2" />
            <path d="M22 7l-10 7L2 7" />
          </svg>
        </div>

        <h1 className="text-2xl font-bold tracking-tight text-notion-text">
          {t("auth.forgot_password_success_title")}
        </h1>
        <p className="mt-2 text-sm text-notion-text-secondary">
          {t("auth.forgot_password_success_subtitle")}
        </p>
        <p className="mt-1 text-sm font-medium text-notion-text">{email}</p>

        {/* Hints */}
        <div className="mt-8 space-y-3 rounded-lg border border-notion-border bg-notion-bg-secondary p-4 text-left text-xs text-notion-text-secondary">
          <div className="flex items-start gap-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 size-4 shrink-0 text-notion-orange-text"
            >
              <circle cx="12" cy="12" r="10" />
              <path d="M12 16v-4" />
              <path d="M12 8h.01" />
            </svg>
            <span>{t("auth.forgot_password_hint_spam")}</span>
          </div>
          <div className="flex items-start gap-2">
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
              className="mt-0.5 size-4 shrink-0 text-notion-blue-text"
            >
              <circle cx="12" cy="12" r="10" />
              <polyline points="12 6 12 12 16 14" />
            </svg>
            <span>{t("auth.forgot_password_hint_resend")}</span>
          </div>
        </div>

        {/* Back to login */}
        <Link
          to="/login"
          className="mt-8 inline-flex items-center gap-1.5 text-sm font-medium text-notion-blue-text hover:text-notion-blue-text-hover hover:underline transition-colors"
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
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {t("auth.forgot_password_back_to_login")}
        </Link>
      </div>
    );
  }

  // ── Form state ──
  return (
    <div className="w-full max-w-sm">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-notion-text">
          {t("auth.forgot_password_title")}
        </h1>
        <p className="mt-1.5 text-sm text-notion-text-secondary">
          {t("auth.forgot_password_subtitle")}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <label className="flex flex-col gap-1">
          <span className="text-sm font-medium text-notion-text">
            {t("auth.email_label")}
          </span>
          <input
            name="email"
            type="email"
            placeholder={t("auth.email_placeholder")}
            value={email}
            onChange={(e) => {
              setEmail(e.target.value);
              if (error) setError(undefined);
            }}
            autoComplete="email"
            className="block w-full rounded-md border border-notion-border bg-notion-surface px-3 py-2 text-sm text-notion-text placeholder:text-notion-text-tertiary transition-colors duration-100 ease-in focus:border-notion-blue-text focus:outline-none focus:ring-1 focus:ring-notion-blue-text disabled:cursor-not-allowed disabled:bg-notion-bg-secondary disabled:text-notion-text-tertiary"
          />
          {error && <p className="text-xs text-notion-red-text">{error}</p>}
        </label>

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
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"
              />
            </svg>
          ) : (
            t("auth.forgot_password_submit")
          )}
        </button>
      </form>

      {/* Back to login */}
      <p className="mt-8 text-center text-sm text-notion-text-secondary">
        <Link
          to="/login"
          className="inline-flex items-center gap-1.5 font-medium text-notion-blue-text hover:text-notion-blue-text-hover hover:underline transition-colors"
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
            <path d="M19 12H5" />
            <polyline points="12 19 5 12 12 5" />
          </svg>
          {t("auth.forgot_password_back_to_login")}
        </Link>
      </p>
    </div>
  );
};

export default ForgotPasswordPage;
