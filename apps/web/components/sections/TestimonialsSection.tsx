import { getTranslations } from "next-intl/server";
import { Card, CardContent } from "@/components/ui/card";
import { Quote } from "lucide-react";

const testimonials = [
  { quoteKey: "quote1", authorKey: "author1" },
  { quoteKey: "quote2", authorKey: "author2" },
  { quoteKey: "quote3", authorKey: "author3" },
] as const;

export async function TestimonialsSection() {
  const t = await getTranslations("testimonials");

  return (
    <section className="py-24 px-4 bg-muted/60">
      <div className="mx-auto max-w-5xl">
        <div className="text-center mb-16">
          <p className="mb-3 text-xs font-bold uppercase tracking-widest text-primary">
            Social proof
          </p>
          <h2 className="text-4xl lg:text-5xl font-bold">{t("title")}</h2>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {testimonials.map(({ quoteKey, authorKey }) => (
            <Card key={quoteKey}>
              <CardContent className="pt-6 space-y-4">
                <Quote className="h-6 w-6 text-primary" />
                <p className="text-muted-foreground">{t(quoteKey)}</p>
                <p className="text-sm font-medium">{t(authorKey)}</p>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </section>
  );
}
