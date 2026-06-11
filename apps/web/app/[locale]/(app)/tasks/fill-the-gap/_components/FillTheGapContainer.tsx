"use client";

import { experimental_useObject as useObject } from "@ai-sdk/react";
import { FillTheGapForm } from "./FillTheGapForm";
import { FillTheGapResult } from "./FillTheGapResult";
import { FillTheGapResponseSchema } from "@/lib/tasks/fill-the-gap.schema";
import type { IFillTheGapRequest } from "@workspace/types";

export function FillTheGapContainer() {
  const { object, submit, isLoading, stop, error } = useObject({
    api: "/api/tasks/fill-the-gap/generate",
    schema: FillTheGapResponseSchema,
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-[380px_1fr] gap-6 items-start">
      <div className="lg:sticky lg:top-6">
        <FillTheGapForm
          onSubmit={(data: IFillTheGapRequest) => submit(data)}
          isLoading={isLoading}
          onStop={stop}
        />
      </div>
      <FillTheGapResult
        object={object}
        isLoading={isLoading}
        error={error instanceof Error ? error : undefined}
      />
    </div>
  );
}
