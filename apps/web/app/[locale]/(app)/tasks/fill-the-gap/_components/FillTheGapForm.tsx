"use client";

import { useForm, Controller, useWatch } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Square } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { IFillTheGapRequest } from "@workspace/types";
import { GRAMMAR_POINTS } from "@/lib/tasks/fill-the-gap.grammar-points";

const formSchema = z.object({
  grammarFocus: z
    .string()
    .min(1, "Select a grammar point")
    .refine((val) => GRAMMAR_POINTS.some((p) => p.label === val), {
      message: "Select a valid grammar point",
    }),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  language: z.enum(["en", "ua", "de", "fr"]),
  sentenceCount: z
    .string()
    .transform(Number)
    .pipe(z.number().int().min(3, "Minimum 3").max(10, "Maximum 10")),
  ageGroup: z.enum(["child", "teen", "adult"]),
});

// Input type: sentenceCount is string (from HTML number input) → transformed to number by schema
type FormValues = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

const LEVEL_GROUPS = [
  { label: "A1 – A2", levels: ["A1", "A2"] as const },
  { label: "B1 – B2", levels: ["B1", "B2"] as const },
  { label: "C1 – C2", levels: ["C1", "C2"] as const },
] as const;

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
      grammarFocus: "Present perfect (experience & recent past)",
      sentenceCount: "5",
      level: "B1",
      language: "en",
      ageGroup: "adult",
    },
  });

  const watchedLevel = useWatch({ control, name: "level", defaultValue: "B1" });

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
          <div className="space-y-1.5">
            <label htmlFor="ftg-grammar-focus" className="text-sm font-medium">
              Grammar Focus
            </label>
            <Controller
              name="grammarFocus"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="ftg-grammar-focus" className="w-full">
                    <SelectValue placeholder="Select a grammar point" />
                  </SelectTrigger>
                  <SelectContent>
                    {(() => {
                      const activeGroup = LEVEL_GROUPS.find((g) =>
                        g.levels.some((l) => l === watchedLevel),
                      );
                      if (!activeGroup) return null;
                      return (
                        <SelectGroup>
                          <SelectLabel>{activeGroup.label}</SelectLabel>
                          {availablePoints.map((p) => (
                            <SelectItem key={p.value} value={p.label}>
                              {p.label}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      );
                    })()}
                  </SelectContent>
                </Select>
              )}
            />
            {errors.grammarFocus && (
              <p className="text-xs text-destructive">
                {errors.grammarFocus.message}
              </p>
            )}
          </div>

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
                    setValue("grammarFocus", "");
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
