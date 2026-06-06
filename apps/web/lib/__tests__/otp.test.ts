import { describe, it, expect, beforeEach, vi } from "vitest";

beforeEach(() => {
  vi.stubEnv("AUTH_SECRET", "test-secret-that-is-32-chars-long!!");
});

const { generateOtp, hashOtp, verifyOtp } = await import("../otp");

describe("generateOtp", () => {
  it("returns exactly 6 characters", () => {
    expect(generateOtp()).toHaveLength(6);
  });

  it("contains only digits", () => {
    for (let i = 0; i < 20; i++) {
      expect(generateOtp()).toMatch(/^\d{6}$/);
    }
  });
});

describe("hashOtp + verifyOtp", () => {
  it("verifies the correct code against its hash", () => {
    const code = "123456";
    const hash = hashOtp(code);
    expect(verifyOtp(code, hash)).toBe(true);
  });

  it("rejects a wrong code", () => {
    const hash = hashOtp("123456");
    expect(verifyOtp("654321", hash)).toBe(false);
  });

  it("rejects an empty string", () => {
    const hash = hashOtp("123456");
    expect(verifyOtp("", hash)).toBe(false);
  });

  it("is not vulnerable to hash length extension (different lengths return false)", () => {
    const hash = hashOtp("123456");
    expect(verifyOtp("1234567", hash)).toBe(false);
  });
});
