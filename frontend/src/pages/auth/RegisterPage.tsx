import { useState } from "react";
import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { useNavigate } from "react-router";
import useAuthStore from "../../stores/useAuthStore";
import { Button } from "../../components/ui";
import { Input } from "../../components/ui";

const RegisterPage = () => {
  const { t } = useTranslation();
  const navigate = useNavigate();
  const { register, isLoading } = useAuthStore();

  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState<{
    fullName?: string;
    email?: string;
    password?: string;
    confirmPassword?: string;
  }>({});

  const validate = () => {
    const next: typeof errors = {};
    if (!fullName.trim()) {
      next.fullName = t("auth.error_required");
    }
    if (!email.trim()) {
      next.email = t("auth.error_required");
    } else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      next.email = t("auth.error_invalid_email");
    }
    if (!password) {
      next.password = t("auth.error_required");
    } else if (password.length < 8) {
      next.password = t("auth.error_password_min");
    }
    if (!confirmPassword) {
      next.confirmPassword = t("auth.error_required");
    } else if (password !== confirmPassword) {
      next.confirmPassword = t("auth.error_password_mismatch");
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validate()) return;
    try {
      await register(fullName, email, password);
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
          {t("auth.register_title")}
        </h1>
        <p className="mt-1.5 text-sm text-notion-text-secondary">
          {t("auth.register_subtitle")}
        </p>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-4">
        <Input
          label={t("auth.name_label")}
          name="fullName"
          type="text"
          placeholder={t("auth.name_placeholder")}
          value={fullName}
          onChange={(e) => setFullName(e.target.value)}
          error={errors.fullName}
          autoComplete="name"
        />

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

        <Input
          label={t("auth.password_label")}
          name="password"
          type="password"
          placeholder={t("auth.password_placeholder")}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          error={errors.password}
          autoComplete="new-password"
        />

        <Input
          label={t("auth.confirm_password_label")}
          name="confirmPassword"
          type="password"
          placeholder={t("auth.confirm_password_placeholder")}
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          error={errors.confirmPassword}
          autoComplete="new-password"
        />

        <Button
          type="submit"
          variant="primary"
          size="lg"
          className="w-full"
          loading={isLoading}
          disabled={isLoading}
        >
          {t("auth.submit_register")}
        </Button>
      </form>

      {/* Log in link */}
      <p className="mt-8 text-center text-sm text-notion-text-secondary">
        {t("auth.has_account")}{" "}
        <Link
          to="/login"
          className="font-medium text-notion-blue-text hover:text-notion-blue-text-hover hover:underline transition-colors"
        >
          {t("auth.sign_in_link")}
        </Link>
      </p>
    </div>
  );
};

export default RegisterPage;
