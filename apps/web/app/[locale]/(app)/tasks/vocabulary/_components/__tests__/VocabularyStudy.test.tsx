import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { describe, it, expect, vi, beforeEach } from "vitest";
import { VocabularyStudy } from "../VocabularyStudy";
import type { VocabularyWordWithId } from "@/lib/tasks/vocabulary.schema";

const words: VocabularyWordWithId[] = [
  {
    id: "word-0",
    word: "apple",
    translation: "яблуко",
    exampleSentence: "I eat an apple every day.",
  },
  {
    id: "word-1",
    word: "book",
    translation: "книга",
    exampleSentence: "She reads a book before bed.",
  },
];

describe("VocabularyStudy", () => {
  const onStartTest = vi.fn();

  beforeEach(() => {
    onStartTest.mockClear();
  });

  it("shows first word on front by default", () => {
    render(<VocabularyStudy words={words} onStartTest={onStartTest} />);
    expect(screen.getByText("apple")).toBeInTheDocument();
    expect(screen.queryByText("яблуко")).not.toBeInTheDocument();
  });

  it("shows progress as 1 / N", () => {
    render(<VocabularyStudy words={words} onStartTest={onStartTest} />);
    expect(screen.getByText("1 / 2")).toBeInTheDocument();
  });

  it("reveals translation and example on flip", async () => {
    const user = userEvent.setup();
    render(<VocabularyStudy words={words} onStartTest={onStartTest} />);
    await user.click(screen.getByRole("button", { name: /flip card/i }));
    expect(screen.getByText("яблуко")).toBeInTheDocument();
    expect(screen.getByText("I eat an apple every day.")).toBeInTheDocument();
  });

  it("resets flip when navigating to next card", async () => {
    const user = userEvent.setup();
    render(<VocabularyStudy words={words} onStartTest={onStartTest} />);
    await user.click(screen.getByRole("button", { name: /flip card/i }));
    expect(screen.getByText("яблуко")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Next card" }));
    expect(screen.getByText("book")).toBeInTheDocument();
    expect(screen.queryByText("книга")).not.toBeInTheDocument();
  });

  it("resets flip when navigating back", async () => {
    const user = userEvent.setup();
    render(<VocabularyStudy words={words} onStartTest={onStartTest} />);
    await user.click(screen.getByRole("button", { name: "Next card" }));
    await user.click(screen.getByRole("button", { name: /flip card/i }));
    expect(screen.getByText("книга")).toBeInTheDocument();
    await user.click(screen.getByRole("button", { name: "Previous card" }));
    expect(screen.getByText("apple")).toBeInTheDocument();
    expect(screen.queryByText("яблуко")).not.toBeInTheDocument();
  });

  it("disables Previous on first card", () => {
    render(<VocabularyStudy words={words} onStartTest={onStartTest} />);
    expect(
      screen.getByRole("button", { name: "Previous card" }),
    ).toBeDisabled();
  });

  it("disables Next on last card", async () => {
    const user = userEvent.setup();
    render(<VocabularyStudy words={words} onStartTest={onStartTest} />);
    await user.click(screen.getByRole("button", { name: "Next card" }));
    expect(screen.getByRole("button", { name: "Next card" })).toBeDisabled();
  });

  it("calls onStartTest when Start Test is clicked", async () => {
    const user = userEvent.setup();
    render(<VocabularyStudy words={words} onStartTest={onStartTest} />);
    await user.click(screen.getByRole("button", { name: "Start Test" }));
    expect(onStartTest).toHaveBeenCalledOnce();
  });
});
