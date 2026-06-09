import Image from "next/image";
import { auth } from "@/auth";
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
          <Image src="/logo.svg" alt={siteConfig.name} width={32} height={32} />
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
