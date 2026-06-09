import { render, screen } from "@testing-library/react";
import { describe, it, expect } from "vitest";
import { SubscriptionBadge } from "../SubscriptionBadge";

describe("SubscriptionBadge", () => {
  it('shows "Pro" for pro plan', () => {
    render(<SubscriptionBadge plan="pro" />);
    expect(screen.getByText("Pro")).toBeInTheDocument();
  });

  it('shows "Trial" for trial plan', () => {
    render(<SubscriptionBadge plan="trial" />);
    expect(screen.getByText("Trial")).toBeInTheDocument();
  });

  it('shows "Expired" for expired plan', () => {
    render(<SubscriptionBadge plan="expired" />);
    expect(screen.getByText("Expired")).toBeInTheDocument();
  });

  it('shows "Free" when plan is null', () => {
    render(<SubscriptionBadge plan={null} />);
    expect(screen.getByText("Free")).toBeInTheDocument();
  });
});
