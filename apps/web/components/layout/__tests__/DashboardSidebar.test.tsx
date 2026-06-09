import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { DashboardSidebar } from "../DashboardSidebar";

vi.mock("next/navigation", () => ({
  usePathname: vi.fn().mockReturnValue("/en/tasks/fill-the-gap"),
}));

vi.mock("@/i18n/routing", () => ({
  Link: ({
    href,
    children,
    className,
  }: {
    href: string;
    children: React.ReactNode;
    className?: string;
  }) => (
    <a href={href} className={className}>
      {children}
    </a>
  ),
}));

vi.mock("@/components/ui/button", () => ({
  Button: ({
    children,
    ...props
  }: {
    children: React.ReactNode;
    [key: string]: unknown;
  }) => <button {...props}>{children}</button>,
}));

vi.mock("@/components/ui/sheet", () => ({
  Sheet: ({ children }: { children: React.ReactNode }) => <div>{children}</div>,
  SheetTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  SheetContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
}));

describe("DashboardSidebar", () => {
  it("renders the Fill the Gap link", () => {
    render(<DashboardSidebar />);
    const links = screen.getAllByRole("link", { name: "Fill the Gap" });
    expect(links.length).toBeGreaterThan(0);
  });

  it("does not render unimplemented task links", () => {
    render(<DashboardSidebar />);
    expect(
      screen.queryByRole("link", { name: /image.*word/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /association/i }),
    ).not.toBeInTheDocument();
    expect(
      screen.queryByRole("link", { name: /vocabulary/i }),
    ).not.toBeInTheDocument();
  });

  it("applies active class to the current task link", () => {
    render(<DashboardSidebar />);
    const links = screen.getAllByRole("link", { name: "Fill the Gap" });
    const desktopLink = links[0]!;
    expect(desktopLink.className).toMatch(/bg-sidebar-accent/);
  });

  it("renders the Coming soon history placeholder", () => {
    render(<DashboardSidebar />);
    expect(screen.getAllByText("Coming soon").length).toBeGreaterThan(0);
  });
});
