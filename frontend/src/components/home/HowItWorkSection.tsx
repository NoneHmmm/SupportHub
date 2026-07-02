import { useTranslation } from "react-i18next";
import {
  SendHorizonal,
  ArrowLeftRight,
  MessageCircleMore,
  CircleCheckBig,
} from "lucide-react";

const steps = [
  {
    key: "submit",
    icon: SendHorizonal,
    bgColor: "bg-notion-blue-bg",
    textColor: "text-notion-blue-text",
    stepNumber: 1,
  },
  {
    key: "assign",
    icon: ArrowLeftRight,
    bgColor: "bg-notion-green-bg",
    textColor: "text-notion-green-text",
    stepNumber: 2,
  },
  {
    key: "respond",
    icon: MessageCircleMore,
    bgColor: "bg-notion-yellow-bg",
    textColor: "text-notion-yellow-text",
    stepNumber: 3,
  },
  {
    key: "resolve",
    icon: CircleCheckBig,
    bgColor: "bg-notion-purple-bg",
    textColor: "text-notion-purple-text",
    stepNumber: 4,
  },
];

const HowItWorkSection = () => {
  const { t } = useTranslation();

  return (
    <section
      id="how-it-works"
      className="border-b border-notion-border bg-notion-bg py-16 lg:py-20"
    >
      <div className="mx-auto max-w-6xl px-5 lg:px-8">
        {/* ── Section heading ── */}
        <div className="mx-auto max-w-xl text-center">
          <h2 className="text-2xl font-bold tracking-tight text-notion-text sm:text-3xl">
            {t("how_it_works.title")}
          </h2>
          <p className="mt-3 text-sm leading-relaxed text-notion-text-secondary">
            {t("how_it_works.subtitle")}
          </p>
        </div>

        {/* ── Steps ── */}
        <div className="mt-14 grid grid-cols-1 gap-8 md:grid-cols-4 md:gap-0">
          {steps.map((step, index) => {
            const Icon = step.icon;
            const isLast = index === steps.length - 1;

            return (
              <div key={step.key} className="relative flex md:flex-col">
                {/* ── Connector line (hidden on last item) ── */}
                {!isLast && (
                  <div className="absolute left-6 top-10 h-[calc(100%+2rem)] w-px bg-notion-border md:left-1/2 md:top-8 md:h-px md:w-[calc(100%-2rem)] md:-translate-y-1/2" />
                )}

                {/* ── Step card ── */}
                <div className="relative flex gap-5 md:flex-col md:items-center md:text-center">
                  {/* Icon with number badge */}
                  <div className="relative shrink-0">
                    <div
                      className={`flex size-13 items-center justify-center rounded-2xl md:size-14 ${step.bgColor}`}
                    >
                      <Icon className={`size-6 md:size-7 ${step.textColor}`} />
                    </div>
                    {/* Step number */}
                    <div className="absolute -top-2 -right-2 flex size-5 items-center justify-center rounded-full border-2 border-notion-bg bg-notion-text text-[10px] font-bold text-notion-bg md:-top-2 md:-right-2">
                      {step.stepNumber}
                    </div>
                  </div>

                  {/* Content */}
                  <div className="md:mt-4">
                    <h3 className="text-base font-semibold text-notion-text sm:text-lg">
                      {t(`how_it_works.${step.key}.title`)}
                    </h3>
                    <p className="mt-1.5 text-sm leading-relaxed text-notion-text-secondary">
                      {t(`how_it_works.${step.key}.desc`)}
                    </p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
};

export default HowItWorkSection;
