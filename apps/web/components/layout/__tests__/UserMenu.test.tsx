import { render, screen } from "@testing-library/react";
import { describe, it, expect, vi } from "vitest";
import { UserMenu } from "../UserMenu";

vi.mock("next-auth/react", () => ({ signOut: vi.fn() }));

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

vi.mock("@/components/ui/dropdown-menu", () => ({
  DropdownMenu: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuTrigger: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuContent: ({ children }: { children: React.ReactNode }) => (
    <div>{children}</div>
  ),
  DropdownMenuItem: ({
    children,
    onClick,
    className,
  }: {
    children: React.ReactNode;
    onClick?: () => void;
    className?: string;
  }) => (
    <button onClick={onClick} className={className}>
      {children}
    </button>
  ),
  DropdownMenuSeparator: () => <hr />,
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

describe("UserMenu", () => {
  it("renders the uppercase initial of the email", () => {
    render(<UserMenu email="alice@example.com" />);
    expect(screen.getByText("A")).toBeInTheDocument();
  });

  it("renders a Profile link", () => {
    render(<UserMenu email="alice@example.com" />);
    expect(screen.getByText("Profile")).toBeInTheDocument();
  });

  it("renders a Log out option", () => {
    render(<UserMenu email="alice@example.com" />);
    expect(screen.getByText("Log out")).toBeInTheDocument();
  });
});
