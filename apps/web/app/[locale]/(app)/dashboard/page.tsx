import { getLocale } from "next-intl/server";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Link } from "@/i18n/routing";
import { siteConfig } from "@/config/site";

const IMPLEMENTED_SLUGS = new Set([
  "fill-the-gap",
  "vocabulary",
  "associations",
]);

const TASK_DESCRIPTIONS: Record<string, string> = {
  "fill-the-gap": "Generate interactive fill-in-the-blank exercises.",
  associations: "Build vocabulary through word association exercises.",
  vocabulary: "Expand vocabulary with context-rich exercises.",
};

export default async function DashboardPage() {
  const locale = await getLocale();
  return (
    <div className="mx-auto max-w-5xl px-4 py-8">
      <div className="mb-8">
        <h1 className="text-2xl font-bold">
          What do you want to practice today?
        </h1>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
        {siteConfig.taskTypes.map((task) => {
          const isImplemented = IMPLEMENTED_SLUGS.has(task.slug);
          const description = TASK_DESCRIPTIONS[task.slug] ?? "";
          return (
            <Card key={task.slug} className={isImplemented ? "" : "opacity-60"}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base">
                    {task.label[locale as keyof typeof task.label] ??
                      task.label.en}
                  </CardTitle>
                  {!isImplemented && (
                    <Badge variant="secondary">Coming soon</Badge>
                  )}
                </div>
                <CardDescription>{description}</CardDescription>
              </CardHeader>
              <CardContent>
                {isImplemented ? (
                  <Button asChild size="sm">
                    <Link href={`/tasks/${task.slug}`}>Start</Link>
                  </Button>
                ) : (
                  <Button size="sm" disabled>
                    Start
                  </Button>
                )}
              </CardContent>
            </Card>
          );
        })}
      </div>
    </div>
  );
}
