"use client";

import { useState } from "react";
import { useLocale } from "next-intl";
import { experimental_useObject as useObject } from "@ai-sdk/react";
import { VocabularyForm } from "./VocabularyForm";
import { VocabularyStudy } from "./VocabularyStudy";
import { VocabularyTest } from "./VocabularyTest";
import {
  VocabularyResponseSchema,
  type VocabularyWordWithId,
} from "@/lib/tasks/vocabulary.schema";
import type { IVocabularyRequest } from "@workspace/types";

type VocabularyPhase = "idle" | "generating" | "studying" | "testing" | "error";

export function VocabularyContainer() {
  const locale = useLocale();
  const [phase, setPhase] = useState<VocabularyPhase>("idle");
  const [words, setWords] = useState<VocabularyWordWithId[]>([]);
  const [error, setError] = useState<string | null>(null);

  const { submit, stop, isLoading } = useObject({
    api: "/api/tasks/vocabulary/generate",
    schema: VocabularyResponseSchema,
    onFinish({ object, error: finishError }) {
      if (finishError || !object) {
        setError(finishError?.message ?? "Generation failed");
        setPhase("error");
        return;
      }
      const withIds: VocabularyWordWithId[] = object.words.map((w, i) => ({
        ...w,
        id: `word-${i}`,
      }));
      setWords(withIds);
      setPhase("studying");
    },
    onError(err) {
      setError(err.message);
      setPhase("error");
    },
  });

  function handleFormSubmit(
    data: Omit<IVocabularyRequest, "translationLanguage">,
  ) {
    setError(null);
    setPhase("generating");
    submit({ ...data, translationLanguage: locale });
  }

  function handleReconfigure() {
    stop();
    setWords([]);
    setError(null);
    setPhase("idle");
  }

  const showReconfigure = phase !== "idle";

  return (
    <div className="flex gap-6">
      {/* Left sidebar — form */}
      <aside className="w-[380px] shrink-0">
        <VocabularyForm
          translationLanguage={locale}
          onSubmit={handleFormSubmit}
          isLoading={isLoading}
          onStop={stop}
          onReconfigure={handleReconfigure}
          showReconfigure={showReconfigure}
        />
      </aside>

      {/* Right panel */}
      <main className="flex-1 min-w-0">
        {phase === "idle" && (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            Configure your task and click Generate
          </div>
        )}

        {phase === "generating" && (
          <div className="flex h-64 items-center justify-center rounded-lg border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Generating vocabulary...
            </div>
          </div>
        )}

        {phase === "error" && (
          <div className="flex h-64 flex-col items-center justify-center gap-3 rounded-lg border text-sm">
            <p className="text-destructive">{error ?? "An error occurred"}</p>
            <button
              type="button"
              onClick={() => setPhase("idle")}
              className="text-sm underline underline-offset-2"
            >
              Try again
            </button>
          </div>
        )}

        {phase === "studying" && (
          <VocabularyStudy
            words={words}
            onStartTest={() => setPhase("testing")}
          />
        )}

        {phase === "testing" && (
          <VocabularyTest
            key={words.map((w) => w.id).join(",")}
            words={words}
            onStudyAgain={() => setPhase("studying")}
            onNewTask={handleReconfigure}
          />
        )}
      </main>
    </div>
  );
}
