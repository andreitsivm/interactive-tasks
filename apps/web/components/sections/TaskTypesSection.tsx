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
        <h2 className="text-3xl font-bold text-center mb-16">{t("title")}</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
          {siteConfig.taskTypes.map((task) => {
            const Icon = taskIcons[task.slug] ?? FileText;
            const descKey = descriptionKeys[task.slug];
            if (!descKey) return null;
            return (
              <Link key={task.slug} href={`/tasks/${task.slug}`}>
                <Card className="h-full hover:shadow-md transition-shadow cursor-pointer">
                  <CardHeader className="pb-2">
                    <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-primary/10 mb-2">
                      <Icon className="h-5 w-5 text-primary" />
                    </div>
                    <CardTitle className="text-base">
                      {task.label[locale]}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-muted-foreground">
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
