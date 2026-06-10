import { describe, it, expect } from "vitest";
import {
  getDifficultyGuidelines,
  getAgeGroupModifiers,
  buildPrompt,
} from "../tasks/fill-the-gap.prompt";
import type { CefrLevel, AgeGroup, IFillTheGapRequest } from "@workspace/types";

describe("getDifficultyGuidelines", () => {
  const levels: CefrLevel[] = ["A1", "A2", "B1", "B2", "C1", "C2"];

  it.each(levels)("returns a non-empty string for level %s", (level) => {
    expect(getDifficultyGuidelines(level).length).toBeGreaterThan(0);
  });

  it("A1 output contains low-complexity signals", () => {
    const output = getDifficultyGuidelines("A1");
    expect(output).toMatch(/present simple|100|simple/i);
  });

  it("C2 output contains high-complexity signals", () => {
    const output = getDifficultyGuidelines("C2");
    expect(output).toMatch(/sophisticated|rare|10,000|10000/i);
  });

  it("A1 and C2 return distinct content", () => {
    expect(getDifficultyGuidelines("A1")).not.toBe(
      getDifficultyGuidelines("C2"),
    );
  });
});

describe("getAgeGroupModifiers", () => {
  const groups: AgeGroup[] = ["child", "teen", "adult"];

  it.each(groups)("returns a non-empty string for age group %s", (group) => {
    expect(getAgeGroupModifiers(group).length).toBeGreaterThan(0);
  });

  it("child output contains child-context signals", () => {
    expect(getAgeGroupModifiers("child")).toMatch(/children|school|family/i);
  });

  it("teen output contains teen-context signals", () => {
    expect(getAgeGroupModifiers("teen")).toMatch(
      /social media|school life|sports/i,
    );
  });

  it("adult output contains adult-context signals", () => {
    expect(getAgeGroupModifiers("adult")).toMatch(
      /professional|academic|work/i,
    );
  });

  it("child output differs from adult output", () => {
    expect(getAgeGroupModifiers("child")).not.toBe(
      getAgeGroupModifiers("adult"),
    );
  });
});

describe("buildPrompt", () => {
  const base: IFillTheGapRequest = {
    grammarFocus: "Present simple (habits & facts)",
    level: "B1",
    language: "en",
    sentenceCount: 5,
    ageGroup: "adult",
  };

  it("includes the grammar focus", () => {
    expect(buildPrompt(base)).toContain("Present simple");
  });

  it("includes the CEFR level label", () => {
    expect(buildPrompt(base)).toContain("B1");
  });

  it("includes the sentence count in context and rules", () => {
    const output = buildPrompt(base);
    expect(output).toContain("Number of sentences: 5");
    expect(output).toContain("Generate exactly 5 sentences");
  });

  it("includes the language", () => {
    expect(buildPrompt(base)).toContain("en");
  });

  it("includes the difficulty guidelines section", () => {
    expect(buildPrompt(base)).toContain("INTERMEDIATE LEVEL");
  });

  it("includes the age group modifiers section", () => {
    expect(buildPrompt(base)).toContain("AGE GROUP MODIFIERS");
  });

  it("includes the blank placement rule requiring verb-form blanks", () => {
    expect(buildPrompt(base)).toContain("BLANK PLACEMENT RULE");
    expect(buildPrompt(base)).toContain("complete verb phrase");
  });
});
