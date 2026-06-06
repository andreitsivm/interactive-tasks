import { getTranslations } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";

export async function HeroSection() {
  const t = await getTranslations("hero");

  return (
    <section className="relative flex flex-col items-center text-center px-4 pt-28 pb-16 overflow-hidden">
      {/* Atmospheric glow */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-0 flex items-center justify-center"
      >
        <div className="h-120 w-225 rounded-full bg-primary/10 blur-[120px]" />
      </div>

      <div className="relative max-w-3xl mx-auto space-y-7">
        <h1
          className="animate-fade-up text-5xl sm:text-6xl lg:text-7xl tracking-tight"
          style={{ animationDelay: "0ms" }}
        >
          {t("headline")}
        </h1>
        <p
          className="animate-fade-up text-lg sm:text-xl text-muted-foreground max-w-2xl mx-auto leading-relaxed"
          style={{ animationDelay: "140ms" }}
        >
          {t("subheadline")}
        </p>
        <div
          className="animate-fade-up flex flex-col sm:flex-row gap-3 justify-center pt-2"
          style={{ animationDelay: "280ms" }}
        >
          <Button asChild size="lg" className="text-base px-8">
            <Link href="/pricing">{t("cta")}</Link>
          </Button>
          <Button
            asChild
            variant="outline"
            size="lg"
            className="text-base px-8"
          >
            <a href="#how-it-works">{t("ctaSecondary")}</a>
          </Button>
        </div>
      </div>

      {/* Browser-chrome product mockup */}
      <div
        className="relative mt-14 w-full max-w-5xl animate-fade-up"
        style={{ animationDelay: "420ms" }}
      >
        <div className="relative overflow-hidden rounded-2xl border border-border/60 bg-card shadow-[0_32px_80px_rgba(0,0,0,0.12)] dark:shadow-[0_32px_80px_rgba(0,0,0,0.5)]">
          {/* Browser titlebar */}
          <div className="flex items-center gap-2 border-b border-border/40 bg-muted/60 px-4 py-2.5">
            <div className="flex gap-1.5 shrink-0">
              <span className="h-2.5 w-2.5 rounded-full bg-red-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-amber-400/70" />
              <span className="h-2.5 w-2.5 rounded-full bg-green-400/70" />
            </div>
            <div className="flex-1 mx-4">
              <div className="rounded-md bg-background/70 px-3 py-1 text-center text-xs text-muted-foreground">
                app.taskgen.ai / tasks / fill-the-gap
              </div>
            </div>
          </div>

          {/* App UI */}
          <div className="bg-background px-6 py-6 sm:px-10 sm:py-8">
            <div className="mx-auto max-w-2xl space-y-5">
              {/* Task header row */}
              <div className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-semibold text-primary">
                    Fill the Gap
                  </span>
                  <span className="rounded-full bg-muted px-2.5 py-1 text-xs text-muted-foreground">
                    B1 · Present Perfect
                  </span>
                </div>
                <span className="text-xs text-muted-foreground">
                  2 of 4 answered
                </span>
              </div>

              {/* Exercise sentences */}
              <div className="space-y-3 text-left text-[15px] leading-loose">
                <p>
                  She{" "}
                  <span className="inline-flex items-center justify-center rounded border-b-2 border-emerald-500 bg-emerald-50 px-2 py-0.5 font-semibold text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400">
                    has lived
                  </span>{" "}
                  in Paris for five years.
                </p>
                <p>
                  Yesterday, he{" "}
                  <span className="inline-flex min-w-24 items-center justify-center rounded border-b-2 border-primary/60 bg-primary/5 px-2 py-0.5 text-sm text-muted-foreground">
                    &nbsp;
                  </span>{" "}
                  to the concert.
                </p>
                <p>
                  They{" "}
                  <span className="inline-flex min-w-28 items-center justify-center rounded border-b-2 border-border px-2 py-0.5 text-sm text-muted-foreground">
                    &nbsp;
                  </span>{" "}
                  the project last week.
                </p>
              </div>

              {/* Word bank */}
              <div className="flex flex-wrap gap-2 border-t border-border/40 pt-4">
                {["went", "have finished", "completed", "was visiting"].map(
                  (w) => (
                    <span
                      key={w}
                      className="cursor-default rounded-lg border bg-card px-3 py-1.5 text-sm transition-colors hover:bg-muted"
                    >
                      {w}
                    </span>
                  ),
                )}
              </div>

              {/* Progress bar */}
              <div className="h-1.5 overflow-hidden rounded-full bg-muted">
                <div className="h-full w-2/4 rounded-full bg-primary" />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div
        id="hero-bottom-sentinel"
        className="absolute bottom-0 left-0 w-full h-px"
      />
    </section>
  );
}
