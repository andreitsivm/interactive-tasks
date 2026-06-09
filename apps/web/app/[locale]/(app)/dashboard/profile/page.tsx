import { auth } from "@/auth";
import { SubscriptionBadge } from "@/components/layout/SubscriptionBadge";

const PLAN_STATUS: Record<string, string> = {
  pro: "Active",
  trial: "Trial",
  expired: "Expired",
};

export default async function ProfilePage() {
  const session = await auth();
  if (!session) return null; // unreachable — parent (app)/layout.tsx redirects

  const email = session.user.email;
  const plan = session.user.subscriptionPlan;
  const statusLabel = plan !== null ? (PLAN_STATUS[plan] ?? "Unknown") : "Free";

  return (
    <div className="mx-auto max-w-2xl px-4 py-8">
      <h1 className="mb-6 text-2xl font-bold">Profile</h1>
      <div className="space-y-6">
        <div>
          <p className="mb-1 text-sm font-medium text-muted-foreground">
            Email
          </p>
          <p className="text-sm">{email}</p>
        </div>
        <div>
          <p className="mb-1 text-sm font-medium text-muted-foreground">
            Subscription
          </p>
          <div className="flex items-center gap-2">
            <SubscriptionBadge plan={plan} />
            <span className="text-sm text-muted-foreground">{statusLabel}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
