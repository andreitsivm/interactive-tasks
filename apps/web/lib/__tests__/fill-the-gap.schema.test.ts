import { describe, it, expect } from "vitest";
import {
  FillTheGapRequestSchema,
  FillTheGapResponseSchema,
} from "../tasks/fill-the-gap.schema";

describe("FillTheGapRequestSchema", () => {
  const valid = {
    topic: "animals",
    level: "B1",
    language: "en",
    sentenceCount: 5,
    ageGroup: "adult",
  };

  it("accepts a valid request", () => {
    expect(FillTheGapRequestSchema.safeParse(valid).success).toBe(true);
  });

  it("rejects topic shorter than 3 characters", () => {
    expect(
      FillTheGapRequestSchema.safeParse({ ...valid, topic: "ab" }).success,
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

  it("accepts optional customWords array", () => {
    const result = FillTheGapRequestSchema.safeParse({
      ...valid,
      customWords: ["jump", "run"],
    });
    expect(result.success).toBe(true);
    if (result.success) {
      expect(result.data.customWords).toEqual(["jump", "run"]);
    }
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

  it("rejects blanks with fewer than 3 options", () => {
    const invalid = {
      ...validResponse,
      sentences: [
        {
          ...validResponse.sentences[0],
          blanks: [
            { id: "b1", correctAnswer: "jumped", options: ["jumped", "ran"] },
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
    const { title: _t, ...withoutTitle } = validResponse;
    expect(FillTheGapResponseSchema.safeParse(withoutTitle).success).toBe(
      false,
    );
  });
});
