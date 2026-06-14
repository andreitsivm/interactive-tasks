import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { AssociationsResults } from "../AssociationsResults";

const defaultProps = {
  centralConcept: "The Ocean",
  poolWords: ["desert", "tide"],
  associationWords: ["waves", "lava"],
  associatedWords: ["waves", "coral", "tide"],
  distractors: ["desert", "lava"],
  onTryAgain: vi.fn(),
  onNewTask: vi.fn(),
};

describe("AssociationsResults", () => {
  it("shows the central concept", () => {
    render(<AssociationsResults {...defaultProps} />);
    expect(screen.getByText("The Ocean")).toBeInTheDocument();
  });

  it("shows the correct score fraction and percentage", () => {
    render(<AssociationsResults {...defaultProps} />);
    // waves is correct (1/3), lava is wrong. tide is missed. desert is neutral.
    expect(screen.getByText(/1 \/ 3 correct/)).toBeInTheDocument();
    expect(screen.getByText(/33%/)).toBeInTheDocument();
  });

  it("renders all words from both zones", () => {
    render(<AssociationsResults {...defaultProps} />);
    expect(screen.getByText("desert")).toBeInTheDocument();
    expect(screen.getByText("tide")).toBeInTheDocument();
    expect(screen.getByText("waves")).toBeInTheDocument();
    expect(screen.getByText("lava")).toBeInTheDocument();
  });

  it("renders Try Again and New Task buttons", () => {
    render(<AssociationsResults {...defaultProps} />);
    expect(
      screen.getByRole("button", { name: "Try Again" }),
    ).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: "New Task" }),
    ).toBeInTheDocument();
  });

  it("calls onTryAgain when Try Again is clicked", () => {
    const onTryAgain = vi.fn();
    render(<AssociationsResults {...defaultProps} onTryAgain={onTryAgain} />);
    screen.getByRole("button", { name: "Try Again" }).click();
    expect(onTryAgain).toHaveBeenCalledOnce();
  });

  it("calls onNewTask when New Task is clicked", () => {
    const onNewTask = vi.fn();
    render(<AssociationsResults {...defaultProps} onNewTask={onNewTask} />);
    screen.getByRole("button", { name: "New Task" }).click();
    expect(onNewTask).toHaveBeenCalledOnce();
  });
});
