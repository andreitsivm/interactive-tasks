import { describe, it, expect } from "vitest";
import {
  getVocabularyLevelGuidelines,
  buildVocabularyPrompt,
} from "../tasks/vocabulary.prompt";
import type { CefrLevel, IVocabularyRequest } from "@workspace/types";

describe("getVocabularyLevelGuidelines", () => {
  const levels: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

  it.each(levels)("returns a non-empty string for level %s", (level) => {
    expect(getVocabularyLevelGuidelines(level).length).toBeGreaterThan(0);
  });

  it("A1 and C2 return distinct content", () => {
    expect(getVocabularyLevelGuidelines("A1")).not.toBe(
      getVocabularyLevelGuidelines("C2"),
    );
  });

  it("A1 output mentions beginner signals", () => {
    expect(getVocabularyLevelGuidelines("A1")).toMatch(/beginner|A1|100/i);
  });

  it("C2 output mentions proficiency signals", () => {
    expect(getVocabularyLevelGuidelines("C2")).toMatch(
      /proficiency|C2|native/i,
    );
  });
});

describe("buildVocabularyPrompt", () => {
  const base: IVocabularyRequest = {
    topic: "space travel",
    level: "B1",
    targetLanguage: "en",
    translationLanguage: "ua",
  };

  it("includes the topic", () => {
    expect(buildVocabularyPrompt(base)).toContain("space travel");
  });

  it("includes the CEFR level", () => {
    expect(buildVocabularyPrompt(base)).toContain("B1");
  });

  it("includes targetLanguage", () => {
    expect(buildVocabularyPrompt(base)).toContain("en");
  });

  it("includes translationLanguage", () => {
    expect(buildVocabularyPrompt(base)).toContain("ua");
  });

  it("instructs to generate 10 words", () => {
    expect(buildVocabularyPrompt(base)).toContain("10");
  });

  it("without wordList, instructs AI to select words", () => {
    const output = buildVocabularyPrompt(base);
    expect(output).toMatch(/select 10 words|most useful/i);
  });

  it("with wordList, includes the provided words", () => {
    const output = buildVocabularyPrompt({
      ...base,
      wordList: ["orbit", "asteroid"],
    });
    expect(output).toContain("orbit");
    expect(output).toContain("asteroid");
  });

  it("with wordList shorter than 10, instructs to fill remaining slots", () => {
    const output = buildVocabularyPrompt({
      ...base,
      wordList: ["orbit"],
    });
    expect(output).toMatch(/fill|remaining|reach exactly 10/i);
  });

  it("includes difficulty guidelines section", () => {
    expect(buildVocabularyPrompt(base)).toContain("INTERMEDIATE");
  });
});
