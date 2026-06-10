"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import type { ISentence } from "@/lib/tasks/fill-the-gap.schema";

interface SentenceCardProps {
  sentence: ISentence;
  index: number;
}

export function SentenceCard({ sentence, index }: SentenceCardProps) {
  const [selections, setSelections] = useState<Record<string, string>>({});

  const blankMap = Object.fromEntries(sentence.blanks.map((b) => [b.id, b]));
  const allFilled = sentence.blanks.every(
    (b) => selections[b.id] !== undefined,
  );
  const score = sentence.blanks.filter(
    (b) => selections[b.id] === b.correctAnswer,
  ).length;
  const total = sentence.blanks.length;

  function handleReset() {
    setSelections({});
  }

  return (
    <div className="rounded-lg ring-1 ring-foreground/10 bg-card p-4 space-y-3 animate-in fade-in duration-300">
      <p className="text-xs font-medium text-muted-foreground">
        Sentence {index + 1}
      </p>
      <div className="flex flex-wrap items-baseline gap-x-1 gap-y-2 text-sm leading-relaxed">
        {sentence.segments.map((seg, i) => {
          if (seg.type === "text") {
            return <span key={i}>{seg.value}</span>;
          }

          const blank = blankMap[seg.blankId];
          if (!blank) return null;
          const selected = selections[blank.id];
          const isCorrect =
            selected !== undefined && selected === blank.correctAnswer;
          const isWrong =
            selected !== undefined && selected !== blank.correctAnswer;

          return (
            <span key={i} className="inline-flex flex-col items-center gap-0.5">
              <Select
                value={selected ?? ""}
                onValueChange={(val) => {
                  setSelections((prev) => ({ ...prev, [blank.id]: val }));
                }}
              >
                <SelectTrigger
                  className={cn(
                    "min-w-24 h-7",
                    isCorrect && "border-green-500 text-green-600",
                    isWrong && "border-destructive text-destructive",
                  )}
                >
                  <SelectValue placeholder="___" />
                </SelectTrigger>
                <SelectContent position="popper">
                  {blank.options
                    .filter((opt) => opt.length > 0)
                    .map((opt, i) => (
                      <SelectItem key={`${blank.id}-${i}`} value={opt}>
                        {opt}
                      </SelectItem>
                    ))}
                </SelectContent>
              </Select>
              {isWrong && (
                <span className="text-xs text-green-600">
                  {blank.correctAnswer}
                </span>
              )}
            </span>
          );
        })}
      </div>
      <div className="flex items-center gap-3 pt-1">
        {allFilled && (
          <p
            className={cn(
              "text-xs font-medium",
              score === total ? "text-green-600" : "text-amber-600",
            )}
          >
            {score} / {total} correct
          </p>
        )}
        {Object.keys(selections).length > 0 && (
          <Button size="sm" variant="ghost" onClick={handleReset}>
            Reset
          </Button>
        )}
      </div>
    </div>
  );
}
