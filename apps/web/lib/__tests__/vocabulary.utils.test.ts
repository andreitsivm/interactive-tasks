import { describe, it, expect } from "vitest";
import { parseWordList, shuffleArray } from "../tasks/vocabulary.utils";

describe("parseWordList", () => {
  it("splits text by newline and trims whitespace", () => {
    expect(parseWordList("apple\n  book  \ncat")).toEqual([
      "apple",
      "book",
      "cat",
    ]);
  });

  it("filters out blank lines", () => {
    expect(parseWordList("apple\n\nbook\n   \ncat")).toEqual([
      "apple",
      "book",
      "cat",
    ]);
  });

  it("takes at most 10 items", () => {
    const input = Array.from({ length: 15 }, (_, i) => `word${i}`).join("\n");
    expect(parseWordList(input)).toHaveLength(10);
  });

  it("returns all items when fewer than 10", () => {
    expect(parseWordList("apple\nbook\ncat")).toHaveLength(3);
  });

  it("returns empty array for blank input", () => {
    expect(parseWordList("   \n\n  ")).toEqual([]);
  });
});

describe("shuffleArray", () => {
  it("returns array of same length", () => {
    const arr = [1, 2, 3, 4, 5];
    expect(shuffleArray(arr)).toHaveLength(5);
  });

  it("contains same elements as input", () => {
    const arr = [1, 2, 3, 4, 5];
    const result = shuffleArray(arr);
    expect(result.sort()).toEqual([...arr].sort());
  });

  it("does not mutate the original array", () => {
    const arr = [1, 2, 3, 4, 5];
    const copy = [...arr];
    shuffleArray(arr);
    expect(arr).toEqual(copy);
  });
});
