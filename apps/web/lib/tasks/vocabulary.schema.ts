import { z } from "zod";
import type { IVocabularyRequest, IVocabularyResponse } from "@workspace/types";

export const VocabularyRequestSchema = z.object({
  topic: z.string().min(1).max(200),
  level: z.enum(["A1", "A2", "B1", "B2", "C1", "C2"]),
  targetLanguage: z.enum(["en", "ua", "de", "fr"]),
  translationLanguage: z.string().min(1),
  wordList: z.array(z.string().min(1)).max(10).optional(),
}) satisfies z.ZodType<IVocabularyRequest>;

const VocabularyWordSchema = z.object({
  word: z.string().min(1),
  translation: z.string().min(1),
  exampleSentence: z.string().min(1),
});

export const VocabularyResponseSchema = z.object({
  title: z.string().min(1),
  words: z.array(VocabularyWordSchema),
}) satisfies z.ZodType<IVocabularyResponse>;

export type VocabularyWordWithId = z.infer<typeof VocabularyWordSchema> & {
  id: string;
};
