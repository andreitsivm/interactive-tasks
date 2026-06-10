import { z } from "zod";
import type { IFillTheGapRequest } from "@workspace/types";

export const FillTheGapRequestSchema = z.object({
  grammarFocus: z.string().min(3),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  language: z.enum(["en", "ua", "de", "fr"]),
  sentenceCount: z.number().int().min(3).max(10),
  ageGroup: z.enum(["child", "teen", "adult"]),
}) satisfies z.ZodType<IFillTheGapRequest>;

const BlankSchema = z.object({
  id: z.string(),
  correctAnswer: z.string(),
  options: z.array(z.string()).min(4).max(5),
});

const SentenceSchema = z.object({
  id: z.string(),
  segments: z.array(
    z.union([
      z.object({ type: z.literal("text"), value: z.string() }),
      z.object({ type: z.literal("blank"), blankId: z.string() }),
    ]),
  ),
  blanks: z.array(BlankSchema).min(1).max(2),
});

export const FillTheGapResponseSchema = z.object({
  title: z.string(),
  instructions: z.string(),
  sentences: z.array(SentenceSchema),
});

export type IFillTheGapResponse = z.infer<typeof FillTheGapResponseSchema>;
export type ISentence = z.infer<typeof SentenceSchema>;
export type IBlank = z.infer<typeof BlankSchema>;
