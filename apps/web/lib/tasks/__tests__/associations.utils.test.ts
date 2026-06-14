import { describe, it, expect } from "vitest";
import { scoreAssociations, getWordState } from "../associations.utils";

describe("scoreAssociations", () => {
  it("returns perfect score when all associated words are selected", () => {
    const result = scoreAssociations(["waves", "coral"], ["waves", "coral"]);
    expect(result).toEqual({ correct: 2, total: 2, percent: 100 });
  });

  it("returns partial score when some words are missed", () => {
    const result = scoreAssociations(["waves"], ["waves", "coral", "tide"]);
    expect(result).toEqual({ correct: 1, total: 3, percent: 33 });
  });

  it("does not count distractors dragged into the zone as correct", () => {
    const result = scoreAssociations(["waves", "desert"], ["waves", "coral"]);
    expect(result).toEqual({ correct: 1, total: 2, percent: 50 });
  });

  it("returns zero score when nothing is dragged", () => {
    const result = scoreAssociations([], ["waves", "coral"]);
    expect(result).toEqual({ correct: 0, total: 2, percent: 0 });
  });
});

describe("getWordState", () => {
  const associatedWords = ["waves", "coral"];

  it("returns correct for an associated word placed in the associations zone", () => {
    expect(getWordState("waves", "associations", associatedWords)).toBe(
      "correct",
    );
  });

  it("returns incorrect for a distractor placed in the associations zone", () => {
    expect(getWordState("desert", "associations", associatedWords)).toBe(
      "incorrect",
    );
  });

  it("returns missed for an associated word left in the pool", () => {
    expect(getWordState("coral", "pool", associatedWords)).toBe("missed");
  });

  it("returns neutral for a distractor left in the pool", () => {
    expect(getWordState("volcano", "pool", associatedWords)).toBe("neutral");
  });
});
