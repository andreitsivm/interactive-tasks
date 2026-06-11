"use client";

import { useRef, useState } from "react";
import { useForm, Controller } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { z } from "zod";
import { Square, Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { parseWordList } from "@/lib/tasks/vocabulary.utils";
import type { IVocabularyRequest } from "@workspace/types";

const formSchema = z.object({
  topic: z.string().min(1, "Topic is required"),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  targetLanguage: z.enum(["en", "ua", "de", "fr"]),
});

type FormValues = z.infer<typeof formSchema>;

interface VocabularyFormProps {
  translationLanguage: string;
  onSubmit: (data: Omit<IVocabularyRequest, "translationLanguage">) => void;
  isLoading: boolean;
  onStop: () => void;
  onReconfigure: () => void;
  showReconfigure: boolean;
}

export function VocabularyForm({
  translationLanguage: _translationLanguage,
  onSubmit,
  isLoading,
  onStop,
  onReconfigure,
  showReconfigure,
}: VocabularyFormProps) {
  const [wordList, setWordList] = useState<string[] | undefined>(undefined);
  const [fileName, setFileName] = useState<string | undefined>(undefined);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isValid },
  } = useForm<FormValues>({
    resolver: zodResolver(formSchema),
    mode: "onChange",
    defaultValues: {
      level: "B1",
      targetLanguage: "en",
    },
  });

  function handleFileChange(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    setFileName(file.name);
    const reader = new FileReader();
    reader.onload = (event) => {
      const text = event.target?.result;
      if (typeof text === "string") {
        setWordList(parseWordList(text));
      }
    };
    reader.readAsText(file);
  }

  function clearFile() {
    setWordList(undefined);
    setFileName(undefined);
    if (fileInputRef.current) fileInputRef.current.value = "";
  }

  function handleValid(values: FormValues) {
    onSubmit({ ...values, wordList });
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Configuration</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit(handleValid)} className="space-y-4">
          {/* Topic */}
          <div className="space-y-1.5">
            <label htmlFor="vocab-topic" className="text-sm font-medium">
              Topic
            </label>
            <input
              id="vocab-topic"
              {...register("topic")}
              type="text"
              placeholder="e.g. space travel, cooking, business"
              className="w-full rounded-md border bg-background px-3 py-2 text-sm outline-none focus-visible:ring-2 focus-visible:ring-ring/30"
            />
            {errors.topic && (
              <p className="text-xs text-destructive">{errors.topic.message}</p>
            )}
          </div>

          {/* CEFR Level */}
          <div className="space-y-1.5">
            <label htmlFor="vocab-level" className="text-sm font-medium">
              CEFR Level
            </label>
            <Controller
              name="level"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="vocab-level" className="w-full">
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

          {/* Target Language */}
          <div className="space-y-1.5">
            <label
              htmlFor="vocab-target-language"
              className="text-sm font-medium"
            >
              Target Language
            </label>
            <Controller
              name="targetLanguage"
              control={control}
              render={({ field }) => (
                <Select value={field.value} onValueChange={field.onChange}>
                  <SelectTrigger id="vocab-target-language" className="w-full">
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

          {/* Word List File */}
          <div className="space-y-1.5">
            <div className="flex items-center gap-1.5">
              <span className="text-sm font-medium">Word List</span>
              <TooltipProvider>
                <Tooltip>
                  <TooltipTrigger asChild>
                    <Info className="size-3.5 text-muted-foreground cursor-help" />
                  </TooltipTrigger>
                  <TooltipContent side="right" className="max-w-[200px]">
                    One word per line. The first 10 words will be used.
                  </TooltipContent>
                </Tooltip>
              </TooltipProvider>
              <span className="text-xs text-muted-foreground">(optional)</span>
            </div>

            {fileName ? (
              <div className="flex items-center gap-2 rounded-md border bg-muted/40 px-3 py-2 text-sm">
                <span className="flex-1 truncate text-xs">{fileName}</span>
                <button
                  type="button"
                  onClick={clearFile}
                  className="text-muted-foreground hover:text-foreground"
                  aria-label="Clear file"
                >
                  <X className="size-3.5" />
                </button>
              </div>
            ) : (
              <>
                <input
                  ref={fileInputRef}
                  type="file"
                  accept=".txt"
                  onChange={handleFileChange}
                  className="sr-only"
                  id="vocab-file"
                  aria-label="Upload word list"
                />
                <label
                  htmlFor="vocab-file"
                  className="flex cursor-pointer items-center justify-center rounded-md border border-dashed px-3 py-2 text-xs text-muted-foreground hover:bg-accent"
                >
                  Upload .txt file
                </label>
              </>
            )}
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

          {showReconfigure && (
            <button
              type="button"
              onClick={onReconfigure}
              className="w-full text-xs text-muted-foreground underline underline-offset-2"
            >
              ← Reconfigure
            </button>
          )}
        </form>
      </CardContent>
    </Card>
  );
}
