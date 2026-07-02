import { useTranslation } from "react-i18next";
import { Star, Quote } from "lucide-react";

const testimonials = [
  {
    key: "testimonial_1",
    nameKey: "testimonial_1_name",
    roleKey: "testimonial_1_role",
    avatar: "AK",
    rating: 5,
    bgColor: "bg-notion-blue-bg",
    textColor: "text-notion-blue-text",
  },
  {
    key: "testimonial_2",
    nameKey: "testimonial_2_name",
    roleKey: "testimonial_2_role",
    avatar: "MT",
    rating: 5,
    bgColor: "bg-notion-purple-bg",
    textColor: "text-notion-purple-text",
  },
  {
    key: "testimonial_3",
    nameKey: "testimonial_3_name",
    roleKey: "testimonial_3_role",
    avatar: "SL",
    rating: 4,
    bgColor: "bg-notion-green-bg",
    textColor: "text-notion-green-text",
  },
];

const RatingSection = () => {
  const { t } = useTranslation();

  return (
    <section className="border-b border-notion-border bg-notion-bg-secondary py-16 lg:py-20">
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        {/* ── Section heading ── */}
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-notion-text sm:text-3xl">
            {t("rating.title")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-notion-text-secondary">
            {t("rating.subtitle")}
          </p>
        </div>

        {/* ── Testimonials grid ── */}
        <div className="mt-12 grid gap-6 md:grid-cols-3">
          {testimonials.map((item) => (
            <div
              key={item.key}
              className="relative rounded-xl border border-notion-border bg-notion-surface p-6 shadow-notion-sm transition-all duration-200 hover:shadow-notion-md"
            >
              {/* ── Quote icon (decorative) ── */}
              <Quote className="absolute right-4 top-4 size-8 text-notion-text-tertiary/20" />

              {/* ── Stars ── */}
              <div className="flex gap-0.5">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    className={`size-4 ${
                      i < item.rating
                        ? "fill-notion-yellow-text text-notion-yellow-text"
                        : "text-notion-border"
                    }`}
                  />
                ))}
              </div>

              {/* ── Quote ── */}
              <p className="mt-4 text-sm leading-relaxed text-notion-text-secondary">
                &ldquo;{t(`rating.${item.key}`)}&rdquo;
              </p>

              {/* ── Author ── */}
              <div className="mt-5 flex items-center gap-3 border-t border-notion-border pt-4">
                <div
                  className={`flex size-9 items-center justify-center rounded-full text-xs font-semibold ${item.bgColor} ${item.textColor}`}
                >
                  {item.avatar}
                </div>
                <div>
                  <p className="text-sm font-medium text-notion-text">
                    {t(`rating.${item.nameKey}`)}
                  </p>
                  <p className="text-xs text-notion-text-tertiary">
                    {t(`rating.${item.roleKey}`)}
                  </p>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default RatingSection;
