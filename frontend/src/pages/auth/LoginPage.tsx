import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import useAuthStore from "../../stores/useAuthStore";
import { Button } from "../../components/ui";
import { Input } from "../../components/ui";

const LoginPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { login, isLoading } = useAuthStore();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState<{ email?: string; password?: string }>(
    {},
  );

  const validate = () => {
    const next: { email?: string; password?: string } = {};
    if (!email.trim()) {
      next.email = t("auth.error_required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = t("auth.error_invalid_email");
    }
    if (!password) {
      next.password = t("auth.resolved_count");
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await login(email, password);
      navigate("/");
    } catch {
      // error is handled by AuthService toast
    }
  };

  return (
    <div className="w-full max-w-sm">
      {/* Heading */}
      <div className="mb-8">
        <h1 className="text-2xl font-bold tracking-tight text-notion-text">
          {t("auth.login_title")}
        </h1>
        <p className="mt-1.5 text-sm text-notion-text-secondary">
          {t("auth.login_subtitle")}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t("auth.email_label")}
          name="email"
          type="email"
          placeholder={t("auth.email_placeholder")}
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          error={errors.email}
          autoComplete="email"
        />

        <div>
          <Input
            label={t("auth.password_label")}
            name="password"
            type="password"
            placeholder={t("auth.password_placeholder")}
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            error={errors.password}
            autoComplete="current-password"
          />
          <div className="mt-1 flex justify-end">
            <Link
              to="/forgot-password"
              className="text-xs font-medium text-notion-blue-text hover:text-notion-blue-text-hover hover:underline transition-colors"
            >
              {t("auth.forgot_password")}
            </Link>
          </div>
        </div>

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={isLoading}
          disabled={isLoading}
        >
          {t("auth.submit_login")}
        </Button>
      </form>

      {/* Sign up link */}
      <p className="mt-8 text-center text-sm text-notion-text-secondary">
        {t("auth.no_account")}{" "}
        <Link
          to="/register"
          className="font-medium text-notion-blue-text hover:text-notion-blue-text-hover hover:underline transition-colors"
        >
          {t("auth.sign_up_link")}
        </Link>
      </p>
    </div>
  );
};

export default LoginPage;
