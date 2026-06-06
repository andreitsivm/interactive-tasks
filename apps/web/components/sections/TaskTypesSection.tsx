import { getTranslations, getLocale } from "next-intl/server";
import { Link } from "@/i18n/routing";
import { siteConfig } from "@/config/site";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { FileText, Image, Link2, BookOpen } from "lucide-react";
import type { LucideIcon } from "lucide-react";

type TaskDescKey = "fillTheGap" | "imageWord" | "association" | "vocabulary";

const taskIcons: Record<string, LucideIcon> = {
  "fill-the-gap": FileText,
  "image-word": Image,
  association: Link2,
  vocabulary: BookOpen,
};

const descriptionKeys: Record<string, TaskDescKey> = {
  "fill-the-gap": "fillTheGap",
  "image-word": "imageWord",
  association: "association",
  vocabulary: "vocabulary",
};

export async function TaskTypesSection() {
  const t = await getTranslations("taskTypes");
  const locale = await getLocale();

  return (
    <section className="py-24 px-4">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
            What you can build
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold">{t("title")}</h2>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
          {siteConfig.taskTypes.map((task) => {
            const Icon = taskIcons[task.slug] ?? FileText;
            const descKey = descriptionKeys[task.slug];
            if (!descKey) return null;
            return (
              <Link key={task.slug} href={`/tasks/${task.slug}`}>
                <Card className="h-full p-2 hover:shadow-lg transition-all duration-200 hover:-translate-y-0.5 cursor-pointer">
                  <CardHeader className="pb-2 pt-6 px-6">
                    <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-primary/10 mb-3">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <CardTitle className="text-lg">
                      {task.label[locale]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="px-6 pb-6">
                    <p className="text-muted-foreground leading-relaxed">
                      {t(descKey)}
                    </p>
                  </CardContent>
                </Card>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
