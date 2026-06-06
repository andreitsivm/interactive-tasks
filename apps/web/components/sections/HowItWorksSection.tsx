import { getTranslations } from "next-intl/server";
import { Settings, Zap, Share2 } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type StepTitleKey = "step1Title" | "step2Title" | "step3Title";
type StepDescKey = "step1Description" | "step2Description" | "step3Description";

const steps: Array<{
  titleKey: StepTitleKey;
  descKey: StepDescKey;
  icon: LucideIcon;
}> = [
  { titleKey: "step1Title", descKey: "step1Description", icon: Settings },
  { titleKey: "step2Title", descKey: "step2Description", icon: Zap },
  { titleKey: "step3Title", descKey: "step3Description", icon: Share2 },
];

export async function HowItWorksSection() {
  const t = await getTranslations("howItWorks");

  return (
    <section id="how-it-works" className="py-24 px-4 bg-muted/40">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
            How it works
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold">{t("title")}</h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-10 lg:gap-16">
          {steps.map(({ titleKey, descKey, icon: Icon }, idx) => (
            <div
              key={titleKey}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="flex flex-col items-center gap-2">
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-primary text-primary-foreground shadow-lg shadow-primary/25">
                  <Icon className="h-6 w-6" />
                </div>
                <span className="text-xs font-bold uppercase tracking-widest text-muted-foreground/60">
                  Step {idx + 1}
                </span>
              </div>
              <h3 className="text-xl font-bold">{t(titleKey)}</h3>
              <p className="text-muted-foreground leading-relaxed">
                {t(descKey)}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
