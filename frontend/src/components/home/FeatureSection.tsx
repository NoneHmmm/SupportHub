import { useTranslation } from "react-i18next";
import {
  TicketPlus,
  ArrowLeftRight,
  MessageCircleMore,
  BarChart3,
  Bell,
  ShieldCheck,
} from "lucide-react";

const features = [
  {
    key: "ticket_management",
    icon: TicketPlus,
    bgColor: "bg-notion-blue-bg",
    textColor: "text-notion-blue-text",
  },
  {
    key: "smart_routing",
    icon: ArrowLeftRight,
    bgColor: "bg-notion-green-bg",
    textColor: "text-notion-green-text",
  },
  {
    key: "real_time_collab",
    icon: MessageCircleMore,
    bgColor: "bg-notion-purple-bg",
    textColor: "text-notion-purple-text",
  },
  {
    key: "analytics",
    icon: BarChart3,
    bgColor: "bg-notion-yellow-bg",
    textColor: "text-notion-yellow-text",
  },
  {
    key: "notifications",
    icon: Bell,
    bgColor: "bg-notion-orange-bg",
    textColor: "text-notion-orange-text",
  },
  {
    key: "security",
    icon: ShieldCheck,
    bgColor: "bg-notion-pink-bg",
    textColor: "text-notion-pink-text",
  },
];

const FeatureSection = () => {
  const { t } = useTranslation();

  return (
    <section
      id="features"
      className="border-b border-notion-border bg-notion-bg-secondary py-16 lg:py-20"
    >
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        {/* ── Section heading ── */}
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-notion-text sm:text-3xl">
            {t("features.title")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-notion-text-secondary">
            {t("features.subtitle")}
          </p>
        </div>

        {/* ── Feature grid ── */}
        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {features.map((feature) => {
            const Icon = feature.icon;
            return (
              <div
                key={feature.key}
                className="group rounded-xl border border-notion-border bg-notion-surface p-6 shadow-notion-sm transition-all duration-200 hover:shadow-notion-md hover:-translate-y-0.5"
              >
                {/* Icon */}
                <div
                  className={`flex size-11 items-center justify-center rounded-xl sm:size-12 ${feature.bgColor}`}
                >
                  <Icon className={`size-5 sm:size-6 ${feature.textColor}`} />
                </div>

                {/* Title */}
                <h3 className="mt-4 text-base font-semibold text-notion-text sm:text-lg">
                  {t(`features.${feature.key}.title`)}
                </h3>

                {/* Description */}
                <p className="mt-2 text-sm leading-relaxed text-notion-text-secondary">
                  {t(`features.${feature.key}.desc`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FeatureSection;
