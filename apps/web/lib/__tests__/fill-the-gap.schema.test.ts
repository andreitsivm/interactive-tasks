import { describe, it, expect } from "vitest";
import {
  FillTheGapRequestSchema,
  FillTheGapResponseSchema,
} from "../tasks/fill-the-gap.schema";

describe("FillTheGapRequestSchema", () => {
  const valid = {
    grammarFocus: ["Present simple"],
    level: "B1",
    language: "en",
    sentenceCount: 5,
    ageGroup: "adult",
  };

  it("accepts a valid request with one grammar point", () => {
    expect(FillTheGapRequestSchema.safeParse(valid).success).toBe(true);
  });

  it("accepts a valid request with multiple grammar points", () => {
    expect(
      FillTheGapRequestSchema.safeParse({
        ...valid,
        grammarFocus: ["Present simple", "Past simple (completed actions)"],
      }).success,
    ).toBe(true);
  });

  it("rejects an empty grammarFocus array", () => {
    expect(
      FillTheGapRequestSchema.safeParse({ ...valid, grammarFocus: [] }).success,
    ).toBe(false);
  });

  it("rejects sentenceCount below 3", () => {
    expect(
      FillTheGapRequestSchema.safeParse({ ...valid, sentenceCount: 2 }).success,
    ).toBe(false);
  });

  it("rejects sentenceCount above 10", () => {
    expect(
      FillTheGapRequestSchema.safeParse({ ...valid, sentenceCount: 11 })
        .success,
    ).toBe(false);
  });

  it("rejects unknown CEFR level", () => {
    expect(
      FillTheGapRequestSchema.safeParse({ ...valid, level: "D1" }).success,
    ).toBe(false);
  });
});

describe("FillTheGapResponseSchema", () => {
  const validResponse = {
    title: "Animals in Nature",
    instructions: "Fill in the blanks with the correct word.",
    sentences: [
      {
        id: "s1",
        segments: [
          { type: "text", value: "The dog " },
          { type: "blank", blankId: "b1" },
          { type: "text", value: " over the fence." },
        ],
        blanks: [
          {
            id: "b1",
            correctAnswer: "jumped",
            options: ["jumped", "ran", "flew", "swam"],
          },
        ],
      },
    ],
  };

  it("accepts a valid response", () => {
    expect(FillTheGapResponseSchema.safeParse(validResponse).success).toBe(
      true,
    );
  });

  it("rejects blanks with fewer than 4 options", () => {
    const invalid = {
      ...validResponse,
      sentences: [
        {
          ...validResponse.sentences[0],
          blanks: [
            {
              id: "b1",
              correctAnswer: "jumped",
              options: ["jumped", "ran", "flew"],
            },
          ],
        },
      ],
    };
    expect(FillTheGapResponseSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects blanks with more than 5 options", () => {
    const invalid = {
      ...validResponse,
      sentences: [
        {
          ...validResponse.sentences[0],
          blanks: [
            {
              id: "b1",
              correctAnswer: "jumped",
              options: ["jumped", "ran", "flew", "swam", "walked", "hopped"],
            },
          ],
        },
      ],
    };
    expect(FillTheGapResponseSchema.safeParse(invalid).success).toBe(false);
  });

  it("rejects segment with unknown type", () => {
    const invalid = {
      ...validResponse,
      sentences: [
        {
          ...validResponse.sentences[0],
          segments: [{ type: "unknown", value: "foo" }],
        },
      ],
    };
    expect(FillTheGapResponseSchema.safeParse(invalid).success).toBe(false);
  });

  it("requires title and instructions", () => {
    const withoutTitle = Object.fromEntries(
      Object.entries(validResponse).filter(([key]) => key !== "title"),
    );
    expect(FillTheGapResponseSchema.safeParse(withoutTitle).success).toBe(
      false,
    );
  });
});
