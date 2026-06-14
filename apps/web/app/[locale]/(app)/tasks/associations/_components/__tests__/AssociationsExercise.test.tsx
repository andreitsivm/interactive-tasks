import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AssociationsExercise } from "../AssociationsExercise";

describe("AssociationsExercise", () => {
  const defaultProps = {
    centralConcept: "The Ocean",
    associatedWords: ["waves", "coral", "tide"],
    distractors: ["desert", "lava"],
    onCheck: vi.fn(),
  };

  it("shows the central concept", () => {
    render(<AssociationsExercise {...defaultProps} />);
    expect(screen.getByText("The Ocean")).toBeInTheDocument();
  });

  it("renders all words from both lists", () => {
    render(<AssociationsExercise {...defaultProps} />);
    expect(screen.getByText("waves")).toBeInTheDocument();
    expect(screen.getByText("coral")).toBeInTheDocument();
    expect(screen.getByText("tide")).toBeInTheDocument();
    expect(screen.getByText("desert")).toBeInTheDocument();
    expect(screen.getByText("lava")).toBeInTheDocument();
  });

  it("disables Check Answers when no words are in the associations zone", () => {
    render(<AssociationsExercise {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: "Check Answers" }),
    ).toBeDisabled();
  });
});
