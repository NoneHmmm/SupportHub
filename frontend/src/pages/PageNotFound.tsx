import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import { Button } from "../components/ui";

const PageNotFound = () => {
  const { t } = useTranslation();

  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-notion-bg px-5">
      {/* Large 404 graphic */}
      <div className="relative mb-6 select-none">
        <h1 className="text-[10rem] font-black leading-none tracking-tighter text-notion-text/5 sm:text-[14rem]">
          404
        </h1>
        <div className="absolute inset-0 flex items-center justify-center">
          <span className="size-24 rounded-full border-4 border-notion-border sm:size-32" />
        </div>
      </div>

      {/* Message */}
      <h2 className="text-xl font-bold text-notion-text sm:text-2xl">
        {t("pagenotfound.title", "Page not found")}
      </h2>
      <p className="mt-2 max-w-xs text-center text-sm text-notion-text-secondary">
        {t(
          "pagenotfound.subtitle",
          "The page you're looking for doesn't exist or has been moved.",
        )}
      </p>

      {/* Actions */}
      <div className="mt-8 flex items-center gap-3">
        <Link to="/">
          <Button variant="primary" size="lg">
            {t("pagenotfound.go_home", "Go home")}
          </Button>
        </Link>
        <Button
          variant="secondary"
          size="lg"
          onClick={() => window.history.back()}
        >
          {t("pagenotfound.go_back", "Go back")}
        </Button>
      </div>
    </div>
  );
};

export default PageNotFound;
