import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();

  return (
    <footer className="border-t border-notion-border bg-notion-bg py-6 px-6">
      <div className="mx-auto max-w-6xl">
        <p className="text-center text-sm text-notion-text-tertiary">
          {t("footer.copyright", { year: new Date().getFullYear() })}
        </p>
      </div>
    </footer>
  );
};

export default Footer;
