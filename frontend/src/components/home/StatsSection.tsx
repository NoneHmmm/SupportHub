import { useTranslation } from "react-i18next";
import { TicketCheck, Clock, Star, Users } from "lucide-react";

const stats = [
  {
    key: "tickets_resolved",
    icon: TicketCheck,
    value: "10,000+",
    bgColor: "bg-notion-blue-bg",
    textColor: "text-notion-blue-text",
  },
  {
    key: "avg_response",
    icon: Clock,
    value: "< 5 min",
    bgColor: "bg-notion-green-bg",
    textColor: "text-notion-green-text",
  },
  {
    key: "satisfaction",
    icon: Star,
    value: "98%",
    bgColor: "bg-notion-yellow-bg",
    textColor: "text-notion-yellow-text",
  },
  {
    key: "active_agents",
    icon: Users,
    value: "500+",
    bgColor: "bg-notion-purple-bg",
    textColor: "text-notion-purple-text",
  },
];

const StatsSection = () => {
  const { t } = useTranslation();

  return (
    <section
      id="stats"
      className="border-b border-notion-border bg-notion-bg py-16 lg:py-20"
    >
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        {/* ── Section heading ── */}
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-notion-text sm:text-3xl">
            {t("stats.title")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-notion-text-secondary">
            {t("stats.subtitle")}
          </p>
        </div>

        {/* ── Stats grid ── */}
        <div className="mt-12 grid grid-cols-2 gap-4 lg:grid-cols-4 lg:gap-6">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.key}
                className="rounded-xl border border-notion-border bg-notion-surface p-5 text-center shadow-notion-sm transition-shadow duration-200 hover:shadow-notion-md sm:p-6"
              >
                {/* Icon */}
                <div
                  className={`mx-auto flex size-11 items-center justify-center rounded-xl sm:size-12 ${stat.bgColor}`}
                >
                  <Icon className={`size-5 sm:size-6 ${stat.textColor}`} />
                </div>

                {/* Value */}
                <p className="mt-4 text-2xl font-bold tracking-tight text-notion-text sm:text-3xl">
                  {stat.value}
                </p>

                {/* Label */}
                <p className="mt-1 text-xs leading-relaxed text-notion-text-secondary sm:text-sm">
                  {t(`stats.${stat.key}`)}
                </p>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default StatsSection;
