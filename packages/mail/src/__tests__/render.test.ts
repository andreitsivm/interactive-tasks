import { describe, it, expect } from "vitest";
import { renderOtpEmail } from "../render/otp";
import { renderWelcomeEmail } from "../render/welcome";

describe("renderOtpEmail", () => {
  it("returns an HTML string containing the code", async () => {
    const html = await renderOtpEmail("483920");
    expect(typeof html).toBe("string");
    expect(html).toContain("483920");
    expect(html.toLowerCase()).toContain("<!doctype html");
  });
});

describe("renderWelcomeEmail", () => {
  it("returns an HTML string containing the user name", async () => {
    const html = await renderWelcomeEmail("Alice");
    expect(typeof html).toBe("string");
    expect(html).toContain("Alice");
    expect(html.toLowerCase()).toContain("<!doctype html");
  });
});
