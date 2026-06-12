import { z } from "zod";
import type { IAssociationsRequest } from "@workspace/types";

export const AssociationsRequestSchema = z.object({
  topic: z.string().min(3).max(200),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  language: z.enum(["en", "ua", "de", "fr"]),
  wordCount: z.number().int().min(6).max(16),
}) satisfies z.ZodType<IAssociationsRequest>;

export const AssociationsResponseSchema = z.object({
  centralConcept: z.string(),
  associatedWords: z.array(z.string()),
  distractors: z.array(z.string()),
});

export type AssociationsResponse = z.infer<typeof AssociationsResponseSchema>;
