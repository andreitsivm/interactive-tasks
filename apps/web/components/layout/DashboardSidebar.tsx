"use client";

import { usePathname } from "next/navigation";
import { Menu } from "lucide-react";
import { cn } from "@/lib/utils";
import { Link } from "@/i18n/routing";
import { Button } from "@/components/ui/button";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";

const IMPLEMENTED_TASKS = [
  { slug: "fill-the-gap", label: "Fill the Gap" },
] as const;

function SidebarLinks({ pathname }: { pathname: string }) {
  return (
    <div className="flex flex-col h-full px-3 py-4">
      <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/50">
        Tasks
      </p>
      <ul className="flex-1 space-y-1">
        {IMPLEMENTED_TASKS.map((task) => {
          const isActive = pathname.includes(`/tasks/${task.slug}`);
          return (
            <li key={task.slug}>
              <Link
                href={`/tasks/${task.slug}`}
                className={cn(
                  "block rounded-md px-3 py-2 text-sm font-medium transition-colors",
                  isActive
                    ? "bg-sidebar-accent text-sidebar-accent-foreground"
                    : "text-sidebar-foreground hover:bg-sidebar-accent/50 hover:text-sidebar-accent-foreground",
                )}
              >
                {task.label}
              </Link>
            </li>
          );
        })}
      </ul>
      <div className="mt-6">
        <p className="mb-2 px-2 text-xs font-semibold uppercase tracking-widest text-sidebar-foreground/30">
          History
        </p>
        <p className="px-3 text-xs text-sidebar-foreground/30">Coming soon</p>
      </div>
    </div>
  );
}

export function DashboardSidebar() {
  const pathname = usePathname();

  return (
    <>
      {/* Desktop: always-visible sidebar */}
      <aside className="hidden md:flex w-[220px] shrink-0 flex-col border-r border-border bg-sidebar min-h-full">
        <SidebarLinks pathname={pathname} />
      </aside>

      {/* Mobile: nav bar with Sheet trigger */}
      <div className="md:hidden flex items-center h-12 border-b border-border bg-background px-4">
        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" aria-label="Open sidebar">
              <Menu className="h-5 w-5" />
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="w-[220px] p-0 bg-sidebar">
            <SidebarLinks pathname={pathname} />
          </SheetContent>
        </Sheet>
      </div>
    </>
  );
}
