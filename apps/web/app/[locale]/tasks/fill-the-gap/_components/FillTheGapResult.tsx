"use client";

import type { DeepPartial } from "ai";
import { SentenceCard } from "./SentenceCard";
import type {
  IFillTheGapResponse,
  ISentence,
  IBlank,
} from "@/lib/tasks/fill-the-gap.schema";

interface FillTheGapResultProps {
  object: DeepPartial<IFillTheGapResponse> | undefined;
  isLoading: boolean;
  error: Error | undefined;
}

function isSentenceReady(
  s: DeepPartial<ISentence> | undefined,
): s is ISentence {
  return (
    s !== undefined &&
    typeof s.id === "string" &&
    Array.isArray(s.segments) &&
    s.segments.length > 0 &&
    s.segments.every(
      (seg) => seg !== undefined && typeof seg.type === "string",
    ) &&
    Array.isArray(s.blanks) &&
    s.blanks.length > 0 &&
    s.blanks.every(
      (b): b is IBlank =>
        b !== undefined &&
        typeof b.id === "string" &&
        typeof b.correctAnswer === "string" &&
        Array.isArray(b.options) &&
        b.options.length >= 3 &&
        b.options.every((o) => typeof o === "string"),
    )
  );
}

export function FillTheGapResult({
  object,
  isLoading,
  error,
}: FillTheGapResultProps) {
  if (error) {
    return (
      <div className="rounded-lg ring-1 ring-destructive/30 bg-destructive/5 p-4 text-sm text-destructive">
        Failed to generate task. Please try again.
      </div>
    );
  }

  if (!object && !isLoading) {
    return (
      <div className="flex items-center justify-center h-48 rounded-lg ring-1 ring-foreground/10 bg-muted/40">
        <p className="text-sm text-muted-foreground">
          Configure your task and click Generate
        </p>
      </div>
    );
  }

  const readySentences = (object?.sentences ?? []).filter(isSentenceReady);

  return (
    <div className="space-y-4">
      {object?.title && (
        <div className="animate-in fade-in duration-300">
          <h2 className="text-base font-semibold">{object.title}</h2>
          {object.instructions && (
            <p className="text-sm text-muted-foreground mt-1">
              {object.instructions}
            </p>
          )}
        </div>
      )}

      {readySentences.map((sentence, i) => (
        <SentenceCard key={sentence.id} sentence={sentence} index={i} />
      ))}

      {isLoading && readySentences.length === 0 && (
        <div className="space-y-3">
          {Array.from({ length: 3 }).map((_, i) => (
            <div
              key={i}
              className="h-20 rounded-lg ring-1 ring-foreground/10 bg-muted/40 animate-pulse"
            />
          ))}
        </div>
      )}
    </div>
  );
}
