import { useState } from "react";
import { useTranslation } from "react-i18next";
import { ChevronDown, HelpCircle } from "lucide-react";
import { cn } from "../../libs/cn";

const faqItems = [
  { key: "faq_1" },
  { key: "faq_2" },
  { key: "faq_3" },
  { key: "faq_4" },
  { key: "faq_5" },
  { key: "faq_6" },
];

const FAQSection = () => {
  const { t } = useTranslation();
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggle = (index: number) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <section
      id="faq"
      className="border-b border-notion-border bg-notion-bg py-16 lg:py-20"
    >
      <div className="mx-auto max-w-3xl px-5 lg:px-8">
        {/* ── Section heading ── */}
        <div className="mx-auto max-w-xl text-center">
          <div className="mb-4 flex justify-center">
            <div className="flex size-11 items-center justify-center rounded-xl bg-notion-green-bg sm:size-12">
              <HelpCircle className="size-5 text-notion-green-text sm:size-6" />
            </div>
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-notion-text sm:text-3xl">
            {t("faq.title")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-notion-text-secondary">
            {t("faq.subtitle")}
          </p>
        </div>

        {/* ── Accordion ── */}
        <div className="mt-12 space-y-2">
          {faqItems.map((item, index) => {
            const isOpen = openIndex === index;
            return (
              <div
                key={item.key}
                className={cn(
                  "rounded-xl border border-notion-border bg-notion-surface transition-shadow duration-200",
                  isOpen && "shadow-notion-sm",
                )}
              >
                <button
                  type="button"
                  onClick={() => toggle(index)}
                  className="flex w-full items-center justify-between gap-3 px-5 py-4 text-left text-sm font-medium text-notion-text transition-colors hover:text-notion-accent sm:px-6 sm:text-base cursor-pointer"
                >
                  <span className="flex-1">{t(`faq.${item.key}.q`)}</span>
                  <ChevronDown
                    className={cn(
                      "size-4 shrink-0 text-notion-text-tertiary transition-transform duration-200",
                      isOpen && "rotate-180 text-notion-accent",
                    )}
                  />
                </button>
                <div
                  className={cn(
                    "overflow-hidden transition-all duration-200 ease-in-out",
                    isOpen ? "max-h-96" : "max-h-0",
                  )}
                >
                  <p className="border-t border-notion-border px-5 py-4 text-sm leading-relaxed text-notion-text-secondary sm:px-6">
                    {t(`faq.${item.key}.a`)}
                  </p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default FAQSection;
