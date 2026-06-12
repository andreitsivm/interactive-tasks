import { describe, it, expect } from "vitest";
import {
  VocabularyRequestSchema,
  VocabularyResponseSchema,
} from "../tasks/vocabulary.schema";

describe("VocabularyRequestSchema", () => {
  const valid = {
    topic: "space travel",
    level: "B1",
    targetLanguage: "en",
    translationLanguage: "ua",
  };

  it("accepts a valid request without wordList", () => {
    expect(VocabularyRequestSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts a valid request with wordList", () => {
    expect(
      VocabularyRequestSchema.safeParse({
        ...valid,
        wordList: ["orbit", "asteroid"],
      }).success,
    ).toBe(true);
  });

  it("rejects empty topic", () => {
    expect(
      VocabularyRequestSchema.safeParse({ ...valid, topic: "" }).success,
    ).toBe(false);
  });

  it("rejects unknown CEFR level", () => {
    expect(
      VocabularyRequestSchema.safeParse({ ...valid, level: "D1" }).success,
    ).toBe(false);
  });

  it("rejects unknown targetLanguage", () => {
    expect(
      VocabularyRequestSchema.safeParse({ ...valid, targetLanguage: "jp" })
        .success,
    ).toBe(false);
  });

  it("rejects wordList with more than 10 items", () => {
    expect(
      VocabularyRequestSchema.safeParse({
        ...valid,
        wordList: Array.from({ length: 11 }, (_, i) => `word${i}`),
      }).success,
    ).toBe(false);
  });

  it("accepts wordList with exactly 10 items", () => {
    expect(
      VocabularyRequestSchema.safeParse({
        ...valid,
        wordList: Array.from({ length: 10 }, (_, i) => `word${i}`),
      }).success,
    ).toBe(true);
  });
});

describe("VocabularyResponseSchema", () => {
  const makeWord = (n: number) => ({
    word: `word${n}`,
    translation: `переклад${n}`,
    exampleSentence: `Example sentence ${n}.`,
  });

  const valid = {
    title: "Space Travel — B1 English",
    words: Array.from({ length: 10 }, (_, i) => makeWord(i)),
  };

  it("accepts a valid response with 10 words", () => {
    expect(VocabularyResponseSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects a response with empty title", () => {
    expect(
      VocabularyResponseSchema.safeParse({ ...valid, title: "" }).success,
    ).toBe(false);
  });

  it("rejects a word with empty word field", () => {
    const badWords = [
      { word: "", translation: "test", exampleSentence: "test" },
      ...valid.words.slice(1),
    ];
    expect(
      VocabularyResponseSchema.safeParse({ ...valid, words: badWords }).success,
    ).toBe(false);
  });

  it("rejects a word missing exampleSentence", () => {
    const badWords = [
      { word: "orbit", translation: "орбіта" },
      ...valid.words.slice(1),
    ];
    expect(
      VocabularyResponseSchema.safeParse({ ...valid, words: badWords }).success,
    ).toBe(false);
  });
});
