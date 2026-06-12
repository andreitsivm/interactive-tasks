"use client";

import { useForm, Controller } from "react-hook-form";
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
import type { IAssociationsRequest } from "@workspace/types";

const formSchema = z.object({
  topic: z.string().min(3, "At least 3 characters required"),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  language: z.enum(["en", "ua", "de", "fr"]),
  wordCount: z.string().transform(Number).pipe(z.number().int().min(6).max(16)),
});

type FormValues = z.input<typeof formSchema>;
type FormOutput = z.output<typeof formSchema>;

interface AssociationsFormProps {
  onSubmit: (data: IAssociationsRequest) => void;
  isLoading: boolean;
  onStop: () => void;
  onReconfigure: () => void;
  showReconfigure: boolean;
}

export function AssociationsForm({
  onSubmit,
  isLoading,
  onStop,
  onReconfigure,
  showReconfigure,
}: AssociationsFormProps) {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues, unknown, FormOutput>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      level: "B1",
      language: "en",
      wordCount: "10",
    },
  });

  function handleValid(values: FormOutput) {
    onSubmit(values);
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-base">Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleValid)} className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-sm font-medium">Topic</label>
            <input
              {...register("topic")}
              type="text"
              placeholder="e.g. marine biology, cooking, space"
              disabled={isLoading}
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30 disabled:opacity-50"
            />
            {errors.topic && (
              <p className="text-xs text-destructive">{errors.topic.message}</p>
            )}
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-medium">Level</label>
            <Controller
              name="level"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
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
            <label className="text-sm font-medium">Language</label>
            <Controller
              name="language"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
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
            <label className="text-sm font-medium">Word count</label>
            <Controller
              name="wordCount"
              control={control}
              render={({ field }) => (
                <Select
                  value={field.value}
                  onValueChange={field.onChange}
                  disabled={isLoading}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    {["6", "8", "10", "12", "16"].map((n) => (
                      <SelectItem key={n} value={n}>
                        {n} words
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              )}
            />
          </div>

          <div className="flex gap-2 pt-2">
            {isLoading ? (
              <Button
                type="button"
                variant="outline"
                onClick={onStop}
                className="flex-1"
              >
                <Square className="mr-2 size-3.5" />
                Stop
              </Button>
            ) : (
              <Button type="submit" disabled={!isValid} className="flex-1">
                Generate
              </Button>
            )}
            {showReconfigure && !isLoading && (
              <Button type="button" variant="outline" onClick={onReconfigure}>
                Reconfigure
              </Button>
            )}
          </div>
        </form>
      </CardContent>
    </Card>
  );
}
