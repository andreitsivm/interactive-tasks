import { render, screen, fireEvent, act } from "@testing-library/react";
import { describe, it, expect, vi, beforeEach, afterEach } from "vitest";
import { VocabularyTest } from "../VocabularyTest";
import type { VocabularyWordWithId } from "@/lib/tasks/vocabulary.schema";

// Deterministic shuffle: return input order unchanged
vi.mock("@/lib/tasks/vocabulary.utils", () => ({
  shuffleArray: <T,>(arr: T[]) => [...arr],
}));

const words: VocabularyWordWithId[] = [
  {
    id: "word-0",
    word: "apple",
    translation: "яблуко",
    exampleSentence: "I eat an apple.",
  },
  {
    id: "word-1",
    word: "book",
    translation: "книга",
    exampleSentence: "A good book.",
  },
];

describe("VocabularyTest", () => {
  const onStudyAgain = vi.fn();
  const onNewTask = vi.fn();

  beforeEach(() => {
    vi.useFakeTimers();
    onStudyAgain.mockClear();
    onNewTask.mockClear();
  });

  afterEach(() => {
    vi.useRealTimers();
  });

  it("renders all words in left column and all translations in right column", () => {
    render(
      <VocabularyTest
        words={words}
        onStudyAgain={onStudyAgain}
        onNewTask={onNewTask}
      />,
    );
    expect(screen.getByRole("button", { name: "apple" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "book" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "яблуко" })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "книга" })).toBeInTheDocument();
  });

  it("shows progress 0 / N initially", () => {
    render(
      <VocabularyTest
        words={words}
        onStudyAgain={onStudyAgain}
        onNewTask={onNewTask}
      />,
    );
    expect(screen.getByText("0 / 2 matched")).toBeInTheDocument();
  });

  it("selecting a word deselects it on second click", () => {
    render(
      <VocabularyTest
        words={words}
        onStudyAgain={onStudyAgain}
        onNewTask={onNewTask}
      />,
    );
    const appleBtn = screen.getByRole("button", { name: "apple" });
    fireEvent.click(appleBtn);
    expect(appleBtn).toHaveAttribute("aria-pressed", "true");
    fireEvent.click(appleBtn);
    expect(appleBtn).toHaveAttribute("aria-pressed", "false");
  });

  it("correct match increments progress and disables matched items", () => {
    render(
      <VocabularyTest
        words={words}
        onStudyAgain={onStudyAgain}
        onNewTask={onNewTask}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "apple" }));
    fireEvent.click(screen.getByRole("button", { name: "яблуко" }));
    expect(screen.getByText("1 / 2 matched")).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "apple" })).toBeDisabled();
    expect(screen.getByRole("button", { name: "яблуко" })).toBeDisabled();
  });

  it("incorrect match deselects both after 600 ms", () => {
    render(
      <VocabularyTest
        words={words}
        onStudyAgain={onStudyAgain}
        onNewTask={onNewTask}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "apple" }));
    fireEvent.click(screen.getByRole("button", { name: "книга" })); // wrong
    expect(screen.getByText("0 / 2 matched")).toBeInTheDocument();
    act(() => {
      vi.advanceTimersByTime(600);
    });
    expect(screen.getByRole("button", { name: "apple" })).toHaveAttribute(
      "aria-pressed",
      "false",
    );
  });

  it("shows completion banner when all matched", () => {
    render(
      <VocabularyTest
        words={words}
        onStudyAgain={onStudyAgain}
        onNewTask={onNewTask}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "apple" }));
    fireEvent.click(screen.getByRole("button", { name: "яблуко" }));
    fireEvent.click(screen.getByRole("button", { name: "book" }));
    fireEvent.click(screen.getByRole("button", { name: "книга" }));
    expect(screen.getByText(/all matched|2 \/ 2/i)).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "Study again" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "New task" }),
    ).toBeInTheDocument();
  });

  it("calls onStudyAgain from completion banner", () => {
    render(
      <VocabularyTest
        words={words}
        onStudyAgain={onStudyAgain}
        onNewTask={onNewTask}
      />,
    );
    fireEvent.click(screen.getByRole("button", { name: "apple" }));
    fireEvent.click(screen.getByRole("button", { name: "яблуко" }));
    fireEvent.click(screen.getByRole("button", { name: "book" }));
    fireEvent.click(screen.getByRole("button", { name: "книга" }));
    fireEvent.click(screen.getByRole("button", { name: "Study again" }));
    expect(onStudyAgain).toHaveBeenCalledOnce();
  });
});
