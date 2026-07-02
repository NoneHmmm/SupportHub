import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { cn } from "../../libs/cn";

interface LogoProps {
  className?: string;
  textClassName?: string;
  iconClassName?: string;
  showText?: boolean;
}

const Logo = ({
  className,
  textClassName,
  iconClassName,
  showText = true,
}: LogoProps) => {
  const { t } = useTranslation();

  return (
    <Link
      to="/"
      className={cn(
        "flex items-center gap-1.5 text-lg font-semibold tracking-tight text-notion-text",
        className,
      )}
    >
      <span
        className={cn(
          "flex size-7 shrink-0 items-center justify-center rounded-md bg-notion-text text-xs font-bold text-notion-bg",
          iconClassName,
        )}
      >
        <img
          src="/supporthub.png"
          alt={t("common.brand")}
          title={t("common.brand")}
        />
      </span>
      {showText && (
        <span className={cn(textClassName)}>{t("common.brand")}</span>
      )}
    </Link>
  );
};

export default Logo;
