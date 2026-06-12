"use client";

import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  getWordState,
  scoreAssociations,
  type WordState,
} from "@/lib/tasks/associations.utils";
import { Check, X } from "lucide-react";

const wordStateClass: Record<WordState, string> = {
  correct:
    "bg-green-100 border-green-400 text-green-800 dark:bg-green-900/30 dark:border-green-600 dark:text-green-300",
  incorrect:
    "bg-red-100 border-red-400 text-red-800 dark:bg-red-900/30 dark:border-red-600 dark:text-red-300",
  missed:
    "bg-yellow-100 border-yellow-400 text-yellow-800 dark:bg-yellow-900/30 dark:border-yellow-600 dark:text-yellow-300",
  neutral: "bg-muted border-muted-foreground/20 text-muted-foreground",
};

interface ResultWordProps {
  word: string;
  state: WordState;
}

function ResultWord({ word, state }: ResultWordProps) {
  return (
    <div
      className={cn(
        "flex items-center gap-1.5 rounded-md border px-3 py-1.5 text-sm font-medium",
        wordStateClass[state],
      )}
    >
      {state === "correct" && <Check className="size-3.5" />}
      {state === "incorrect" && <X className="size-3.5" />}
      {word}
    </div>
  );
}

interface AssociationsResultsProps {
  centralConcept: string;
  poolWords: string[];
  associationWords: string[];
  associatedWords: string[];
  onTryAgain: () => void;
  onNewTask: () => void;
}

export function AssociationsResults({
  centralConcept,
  poolWords,
  associationWords,
  associatedWords,
  onTryAgain,
  onNewTask,
}: AssociationsResultsProps) {
  const score = scoreAssociations(associationWords, associatedWords);

  return (
    <div className="space-y-4">
      <div className="rounded-lg border bg-muted/30 px-4 py-3">
        <p className="text-xs font-semibold uppercase tracking-widest text-muted-foreground">
          Central concept
        </p>
        <p className="mt-0.5 text-xl font-bold">{centralConcept}</p>
      </div>

      <div className="flex flex-col gap-4 sm:flex-row">
        <div className="min-w-0 flex-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Word Pool
          </p>
          <div className="flex min-h-32 flex-wrap gap-2 rounded-lg border-2 border-dashed border-muted-foreground/20 p-3">
            {poolWords.map((word) => (
              <ResultWord
                key={word}
                word={word}
                state={getWordState(word, "pool", associatedWords)}
              />
            ))}
          </div>
        </div>

        <div className="min-w-0 flex-1">
          <p className="mb-2 text-xs font-semibold uppercase tracking-wide text-muted-foreground">
            Your Associations
          </p>
          <div className="flex min-h-32 flex-wrap gap-2 rounded-lg border-2 border-dashed border-muted-foreground/20 p-3">
            {associationWords.map((word) => (
              <ResultWord
                key={word}
                word={word}
                state={getWordState(word, "associations", associatedWords)}
              />
            ))}
          </div>
        </div>
      </div>

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium">
          {score.correct} / {score.total} correct — {score.percent}%
        </p>
        <div className="flex gap-2">
          <Button variant="outline" onClick={onTryAgain}>
            Try Again
          </Button>
          <Button onClick={onNewTask}>New Task</Button>
        </div>
      </div>
    </div>
  );
}
