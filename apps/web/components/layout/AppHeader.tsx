import { auth } from "@/auth";
import { Logo } from "@/components/Logo";
import { siteConfig } from "@/config/site";
import { Link } from "@/i18n/routing";
import { LocaleSwitcher } from "./LocaleSwitcher";
import { ThemeToggle } from "./ThemeToggle";
import { UserMenu } from "./UserMenu";
import { SubscriptionBadge } from "./SubscriptionBadge";

export async function AppHeader() {
  const session = await auth();
  const email = session?.user.email ?? "";
  const plan = session?.user.subscriptionPlan ?? null;

  return (
    <header className="sticky top-0 z-50 w-full border-b border-border bg-background/95 backdrop-blur-md">
      <div className="flex h-16 items-center justify-between px-4 sm:px-6">
        <Link href="/dashboard" className="flex items-center gap-2">
          <Logo size={32} />
          <span className="font-semibold">{siteConfig.name}</span>
        </Link>
        <div className="flex items-center gap-3">
          <SubscriptionBadge plan={plan} />
          <ThemeToggle />
          <LocaleSwitcher />
          <UserMenu email={email} />
        </div>
      </div>
    </header>
  );
}
