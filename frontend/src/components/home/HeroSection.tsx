import { Link } from "react-router";
import { useTranslation } from "react-i18next";
import {
  ArrowRight,
  Info,
  CheckCircle,
  Clock,
  Users,
  MessageCircle,
} from "lucide-react";
import { Button } from "../ui/button";
import useAuthStore from "../../stores/useAuthStore";

const HeroSection = () => {
  const { t } = useTranslation();
  const { isAuthenticated, user } = useAuthStore();

  return (
    <section className="relative overflow-hidden border-b border-notion-border bg-notion-bg">
      {/* Ambient background blobs — very subtle notion-style color wash */}
      <div className="pointer-events-none absolute inset-0">
        <div className="absolute -top-24 right-0 h-125 w-125 rounded-full bg-notion-yellow-bg/40 blur-3xl" />
        <div className="absolute -bottom-24 left-0 h-100 w-100 rounded-full bg-notion-blue-bg/40 blur-3xl" />
      </div>

      <div className="relative mx-auto max-w-6xl px-5 pb-24 pt-20 lg:px-8 lg:pb-32 lg:pt-28">
        {/* ── Eyebrow badge ── */}
        <div className="mb-6 flex justify-center">
          <div className="inline-flex items-center gap-1.5 rounded-full border border-notion-border bg-notion-bg-secondary px-3 py-1 text-xs font-medium text-notion-text-secondary">
            <Info className="size-3.5" />
            {t("hero.eyebrow")}
          </div>
        </div>

        {/* ── Main heading with notion-style marker highlight ── */}
        <h1 className="text-center text-4xl font-bold leading-10 md:leading-15 lg:leading-20 tracking-tight text-notion-accent sm:text-5xl lg:text-6xl">
          {t("hero.title_line1")}
          <br />
          <span className="marker-yellow px-1 text-notion-text">
            {t("hero.title_highlight")}
          </span>
        </h1>

        {/* ── Subtitle ── */}
        <p className="mx-auto mt-6 max-w-2xl text-center text-lg leading-relaxed text-notion-text-secondary">
          {t("hero.subtitle")}
        </p>

        {/* ── CTA Buttons ── */}
        <div className="mt-8 flex justify-center gap-3">
          {isAuthenticated && user ? (
            <>
              <Button
                asChild
                variant="primary"
                size="lg"
                className="rounded-lg px-6 shadow-notion-sm"
              >
                <Link to="/support/my-tickets">
                  {t("common.create_ticket")}
                  <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="rounded-lg px-6"
              >
                <Link to="/support/portal">Portal</Link>
              </Button>
            </>
          ) : (
            <>
              <Button
                asChild
                variant="primary"
                size="lg"
                className="rounded-lg px-6 shadow-notion-sm"
              >
                <Link to="/login">
                  {t("common.log_in")}
                  <ArrowRight className="ml-1.5 size-4" />
                </Link>
              </Button>
              <Button
                asChild
                variant="secondary"
                size="lg"
                className="rounded-lg px-6"
              >
                <Link to="/register">{t("common.get_started")}</Link>
              </Button>
            </>
          )}
        </div>

        {/* ── Trust indicators (notion-style compact) ── */}
        <div className="mt-10 flex flex-wrap items-center justify-center gap-6 text-sm text-notion-text-tertiary">
          <span className="inline-flex items-center gap-1.5">
            <CheckCircle className="size-4 text-notion-green-text" />
            {t("common.ticket_routing")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Clock className="size-4 text-notion-blue-text" />
            {t("common.response_time")}
          </span>
          <span className="inline-flex items-center gap-1.5">
            <Users className="size-4 text-notion-purple-text" />
            {t("common.resolved_count")}
          </span>
        </div>

        {/* ── Product preview mockup (notion-style window + dashboard) ── */}
        <div className="mt-16 overflow-hidden rounded-xl border border-notion-border bg-notion-bg-secondary shadow-notion-lg">
          {/* macOS-style window chrome */}
          <div className="flex items-center gap-1.5 border-b border-notion-border px-4 py-2.5">
            <div className="size-3 rounded-full bg-notion-red-text" />
            <div className="size-3 rounded-full bg-notion-yellow-text" />
            <div className="size-3 rounded-full bg-notion-green-text" />
            <span className="ml-3 text-xs font-medium text-notion-text-tertiary">
              {t("common.brand")} — {t("common.dashboard")}
            </span>
          </div>

          {/* Dashboard content */}
          <div className="p-5 sm:p-8">
            <div className="grid gap-4 sm:grid-cols-3">
              {/* ── Ticket card ── */}
              <div className="rounded-lg border border-notion-border bg-notion-surface p-4">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5">
                    <div className="flex size-8 items-center justify-center rounded-full bg-notion-blue-bg text-xs font-semibold text-notion-blue-text">
                      AK
                    </div>
                    <div>
                      <p className="text-sm font-medium text-notion-text">
                        Alice Kim
                      </p>
                      <p className="text-xs text-notion-text-tertiary">
                        {t("hero.premium_plan")}
                      </p>
                    </div>
                  </div>
                  <span className="rounded-md bg-notion-green-bg px-2 py-0.5 text-xs font-medium text-notion-green-text">
                    {t("hero.open_status")}
                  </span>
                </div>
                <p className="mt-3 text-sm font-medium text-notion-text">
                  {t("hero.ticket_title")}
                </p>
                <p className="mt-1 line-clamp-2 text-xs text-notion-text-tertiary">
                  {t("hero.ticket_body")}
                </p>
                <div className="mt-3 flex items-center gap-1.5 text-xs text-notion-text-tertiary">
                  <MessageCircle className="size-3.5" />
                  <span>{t("hero.ticket_messages")}</span>
                  <span className="ml-auto">{t("hero.ticket_time")}</span>
                </div>
              </div>

              {/* ── AI Suggested Reply (takes 2 cols) ── */}
              <div className="rounded-lg border border-notion-border bg-notion-surface p-4 sm:col-span-2">
                <div className="flex items-center gap-2 text-sm font-medium text-notion-text">
                  <Info className="size-4 text-notion-yellow-text" />
                  {t("hero.ai_suggested")}
                </div>
                <div className="mt-2 rounded-lg bg-notion-bg-secondary p-3">
                  <p className="text-sm leading-relaxed text-notion-text">
                    {t("hero.ai_reply")}
                  </p>
                </div>
                <div className="mt-3 flex items-center justify-between">
                  <div className="flex items-center gap-2 text-xs text-notion-text-tertiary">
                    <CheckCircle className="size-3.5 text-notion-green-text" />
                    <span>{t("hero.confidence")}</span>
                  </div>
                  <div className="flex gap-2">
                    <Button variant="secondary" size="sm">
                      {t("common.edit")}
                    </Button>
                    <Button variant="primary" size="sm">
                      {t("common.send_reply")}
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default HeroSection;
