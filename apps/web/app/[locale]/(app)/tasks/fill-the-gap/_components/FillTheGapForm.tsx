"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { IFillTheGapRequest } from "@workspace/types";
import { GRAMMAR_POINTS } from "@/lib/tasks/fill-the-gap.grammar-points";

const formSchema = z.object({
  grammarFocus: z
    .array(z.string())
    .min(1, "Select at least one grammar point")
    .refine(
      (arr) => arr.every((val) => GRAMMAR_POINTS.some((p) => p.label === val)),
      { message: "Invalid grammar point selected" },
    ),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  language: z.enum(["en", "ua", "de", "fr"]),
  sentenceCount: z
    .string()
    .transform(Number)
    .pipe(z.number().int().min(3, "Minimum 3").max(10, "Maximum 10")),
  ageGroup: z.enum(["child", "teen", "adult"]),
});

type FormValues = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

interface FillTheGapFormProps {
  onSubmit: (data: IFillTheGapRequest) => void;
  isLoading: boolean;
  onStop: () => void;
}

export function FillTheGapForm({
  onSubmit,
  isLoading,
  onStop,
}: FillTheGapFormProps) {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    formState: { errors, isValid },
  } = useForm<FormValues, unknown, FormOutput>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      grammarFocus: ["Present perfect (experience & recent past)"],
      sentenceCount: "5",
      level: "B1",
      language: "en",
      ageGroup: "adult",
    },
  });

  const watchedLevel = useWatch({ control, name: "level", defaultValue: "B1" });
  const watchedGrammarFocus = useWatch({
    control,
    name: "grammarFocus",
    defaultValue: ["Present perfect (experience & recent past)"],
  });

  const availablePoints = GRAMMAR_POINTS.filter((p) =>
    p.levels.includes(watchedLevel),
  );

  function handleValid(values: FormOutput) {
    onSubmit({
      grammarFocus: values.grammarFocus,
      level: values.level,
      language: values.language,
      sentenceCount: values.sentenceCount,
      ageGroup: values.ageGroup,
    });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleValid)} className="space-y-4">
          {/* Grammar Focus — chip grid */}
          <div className="space-y-1.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-medium">Grammar Focus</span>
              {watchedGrammarFocus.length > 0 && (
                <div className="flex items-center gap-2">
                  <span className="text-xs text-muted-foreground">
                    {watchedGrammarFocus.length} selected
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setValue("grammarFocus", [], { shouldValidate: true })
                    }
                    className="text-xs text-muted-foreground underline underline-offset-2"
                  >
                    Clear
                  </button>
                </div>
              )}
            </div>

            <div className="flex flex-wrap gap-2">
              {availablePoints.map((p) => {
                const isSelected = watchedGrammarFocus.includes(p.label);
                return (
                  <button
                    key={p.value}
                    type="button"
                    onClick={() => {
                      const next = isSelected
                        ? watchedGrammarFocus.filter((l) => l !== p.label)
                        : [...watchedGrammarFocus, p.label];
                      setValue("grammarFocus", next, { shouldValidate: true });
                    }}
                    className={cn(
                      "rounded-full border px-3 py-1 text-xs font-medium transition-colors",
                      isSelected
                        ? "bg-primary text-primary-foreground border-primary"
                        : "bg-background text-foreground border-input hover:bg-accent",
                    )}
                  >
                    {p.label}
                  </button>
                );
              })}
            </div>

            <button
              type="button"
              onClick={() =>
                setValue(
                  "grammarFocus",
                  availablePoints.map((p) => p.label),
                  { shouldValidate: true },
                )
              }
              className="text-xs text-muted-foreground underline underline-offset-2"
            >
              Select all
            </button>

            {errors.grammarFocus?.root?.message && (
              <p className="text-xs text-destructive">
                {errors.grammarFocus.root.message}
              </p>
            )}
          </div>

          {/* CEFR Level */}
          <div className="space-y-1.5">
            <label htmlFor="ftg-level" className="text-sm font-medium">
              CEFR Level
            </label>
            <Controller
              name="level"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={(val) => {
                    field.onChange(val);
                    setValue("grammarFocus", [], { shouldValidate: true });
                  }}
                >
                  <SelectTrigger id="ftg-level" className="w-full">
                    <SelectValue placeholder="Select level" />
                  </SelectTrigger>
                  <SelectContent>
                    {(["A1", "A2", "B1", "B2", "C1", "C2"] as const).map(
                      (l) => (
                        <SelectItem key={l} value={l}>
                          {l}
                        </SelectItem>
                      ),
                    )}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Language */}
          <div className="space-y-1.5">
            <label htmlFor="ftg-language" className="text-sm font-medium">
              Language
            </label>
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="ftg-language" className="w-full">
                    <SelectValue placeholder="Select language" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="en">English</SelectItem>
                    <SelectItem value="ua">Ukrainian</SelectItem>
                    <SelectItem value="de">German</SelectItem>
                    <SelectItem value="fr">French</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {/* Sentence count */}
          <div className="space-y-1.5">
            <label htmlFor="ftg-sentence-count" className="text-sm font-medium">
              Sentences (3–10)
            </label>
            <input
              id="ftg-sentence-count"
              {...register("sentenceCount")}
              type="number"
              min={3}
              max={10}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            />
            {errors.sentenceCount && (
              <p className="text-xs text-destructive">
                {errors.sentenceCount.message}
              </p>
            )}
          </div>

          {/* Age group */}
          <div className="space-y-1.5">
            <label htmlFor="ftg-age-group" className="text-sm font-medium">
              Age Group
            </label>
            <Controller
              name="ageGroup"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="ftg-age-group" className="w-full">
                    <SelectValue placeholder="Select age group" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="child">Child</SelectItem>
                    <SelectItem value="teen">Teen</SelectItem>
                    <SelectItem value="adult">Adult</SelectItem>
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          {isLoading ? (
            <Button
              type="button"
              variant="outline"
              className="w-full"
              onClick={onStop}
            >
              <Square className="size-3.5 mr-2" />
              Stop
            </Button>
          ) : (
            <Button type="submit" className="w-full" disabled={!isValid}>
              Generate
            </Button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
