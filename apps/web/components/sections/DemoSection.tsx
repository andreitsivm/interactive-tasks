import { getTranslations } from "next-intl/server";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";

export async function DemoSection() {
  const t = await getTranslations("demo");

  return (
    <section className="py-24 px-4 bg-muted/40">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold mb-3">{t("title")}</h2>
          <p className="text-muted-foreground">{t("subtitle")}</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Configuration</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-1.5">
                <label className="text-sm font-medium">{t("topicLabel")}</label>
                <input
                  disabled
                  placeholder={t("topicPlaceholder")}
                  className="w-full rounded-md border bg-background px-3 py-2 text-sm text-muted-foreground"
                />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">{t("levelLabel")}</label>
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="A2 — Elementary" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="a1">A1 — Beginner</SelectItem>
                    <SelectItem value="a2">A2 — Elementary</SelectItem>
                    <SelectItem value="b1">B1 — Intermediate</SelectItem>
                    <SelectItem value="b2">B2 — Upper Intermediate</SelectItem>
                    <SelectItem value="c1">C1 — Advanced</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-medium">
                  {t("languageLabel")}
                </label>
                <Select disabled>
                  <SelectTrigger>
                    <SelectValue placeholder="English" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ua">Ukrainian</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <div className="flex items-center justify-between">
                <CardTitle className="text-base">{t("previewTitle")}</CardTitle>
                <Badge variant="secondary">Fill the Gap</Badge>
              </div>
            </CardHeader>
            <CardContent>
              <div className="space-y-4 text-sm">
                <p className="leading-relaxed">
                  The dog{" "}
                  <span className="inline-block min-w-[80px] border-b-2 border-primary text-center font-medium text-primary">
                    jumped
                  </span>{" "}
                  over the fence and{" "}
                  <span className="inline-block min-w-[80px] border-b-2 border-muted-foreground text-center text-muted-foreground">
                    ______
                  </span>{" "}
                  into the garden.
                </p>
                <p className="leading-relaxed">
                  She{" "}
                  <span className="inline-block min-w-[80px] border-b-2 border-muted-foreground text-center text-muted-foreground">
                    ______
                  </span>{" "}
                  the letter and put it in the{" "}
                  <span className="inline-block min-w-[80px] border-b-2 border-primary text-center font-medium text-primary">
                    envelope
                  </span>
                  .
                </p>
                <div className="flex flex-wrap gap-2 pt-2 border-t">
                  {["ran", "wrote", "jumped", "envelope", "garden"].map(
                    (word) => (
                      <Badge
                        key={word}
                        variant="outline"
                        className="cursor-default"
                      >
                        {word}
                      </Badge>
                    ),
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
