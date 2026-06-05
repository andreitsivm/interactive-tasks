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
        <h2 className="text-3xl font-bold text-center mb-16">{t("title")}</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {steps.map(({ titleKey, descKey, icon: Icon }, idx) => (
            <div
              key={titleKey}
              className="flex flex-col items-center text-center gap-4"
            >
              <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-primary-foreground">
                <Icon className="h-5 w-5" />
              </div>
              <div className="flex items-center gap-2">
                <span className="text-4xl font-bold text-muted-foreground/30">
                  {idx + 1}
                </span>
                <h3 className="text-xl font-semibold">{t(titleKey)}</h3>
              </div>
              <p className="text-muted-foreground">{t(descKey)}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
