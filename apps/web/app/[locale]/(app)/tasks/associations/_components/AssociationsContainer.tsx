"use client";

import { useState } from "react";
import { AssociationsForm } from "./AssociationsForm";
import { AssociationsExercise } from "./AssociationsExercise";
import { AssociationsResults } from "./AssociationsResults";
import {
  AssociationsResponseSchema,
  type AssociationsResponse,
} from "@/lib/tasks/associations.schema";
import type { IAssociationsRequest } from "@workspace/types";

type AssociationsPhase =
  | "idle"
  | "generating"
  | "exercise"
  | "results"
  | "error";

interface CheckResult {
  poolWords: string[];
  associationWords: string[];
}

export function AssociationsContainer() {
  const [phase, setPhase] = useState<AssociationsPhase>("idle");
  const [data, setData] = useState<AssociationsResponse | null>(null);
  const [checkResult, setCheckResult] = useState<CheckResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exerciseKey, setExerciseKey] = useState(0);
  const [abortController, setAbortController] =
    useState<AbortController | null>(null);

  async function handleFormSubmit(req: IAssociationsRequest) {
    const controller = new AbortController();
    setAbortController(controller);
    setError(null);
    setData(null);
    setCheckResult(null);
    setPhase("generating");

    try {
      const res = await fetch("/api/tasks/associations/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(req),
        signal: controller.signal,
      });

      if (!res.ok) {
        throw new Error(`Generation failed (${res.status})`);
      }

      const json: unknown = await res.json();
      const parsed = AssociationsResponseSchema.safeParse(json);
      if (!parsed.success) {
        throw new Error("Unexpected response from AI");
      }

      setData(parsed.data);
      setExerciseKey((k) => k + 1);
      setPhase("exercise");
    } catch (err) {
      if (err instanceof Error && err.name === "AbortError") {
        setPhase("idle");
        return;
      }
      setError(err instanceof Error ? err.message : "Generation failed");
      setPhase("error");
    }
  }

  function handleStop() {
    abortController?.abort();
  }

  function handleReconfigure() {
    abortController?.abort();
    setData(null);
    setCheckResult(null);
    setError(null);
    setPhase("idle");
  }

  function handleCheck(poolWords: string[], associationWords: string[]) {
    setCheckResult({ poolWords, associationWords });
    setPhase("results");
  }

  function handleTryAgain() {
    setCheckResult(null);
    setExerciseKey((k) => k + 1);
    setPhase("exercise");
  }

  const showReconfigure = phase !== "idle";

  return (
    <div className="flex gap-6">
      <aside className="w-80 shrink-0 self-start sticky top-8">
        <AssociationsForm
          onSubmit={handleFormSubmit}
          isLoading={phase === "generating"}
          onStop={handleStop}
          onReconfigure={handleReconfigure}
          showReconfigure={showReconfigure}
        />
      </aside>

      <main className="min-w-0 flex-1">
        {phase === "idle" && (
          <div className="flex h-64 items-center justify-center rounded-lg border border-dashed text-sm text-muted-foreground">
            Configure your task and click Generate
          </div>
        )}

        {phase === "generating" && (
          <div className="flex h-64 items-center justify-center rounded-lg border">
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
              <span className="size-4 animate-spin rounded-full border-2 border-current border-t-transparent" />
              Generating associations...
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

        {phase === "exercise" && data && (
          <AssociationsExercise
            key={exerciseKey}
            centralConcept={data.centralConcept}
            associatedWords={data.associatedWords}
            distractors={data.distractors}
            onCheck={handleCheck}
          />
        )}

        {phase === "results" && data && checkResult && (
          <AssociationsResults
            centralConcept={data.centralConcept}
            poolWords={checkResult.poolWords}
            associationWords={checkResult.associationWords}
            associatedWords={data.associatedWords}
            onTryAgain={handleTryAgain}
            onNewTask={handleReconfigure}
          />
        )}
      </main>
    </div>
  );
}
