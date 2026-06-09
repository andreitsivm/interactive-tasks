import type { SubscriptionPlan } from "@workspace/types";
import { Badge } from "@/components/ui/badge";

type PlanConfig = {
  label: string;
  variant: "default" | "secondary" | "outline" | "destructive";
};

const PLAN_CONFIG: Record<SubscriptionPlan, PlanConfig> = {
  pro: { label: "Pro", variant: "default" },
  trial: { label: "Trial", variant: "secondary" },
  expired: { label: "Expired", variant: "destructive" },
};

const FREE_CONFIG: PlanConfig = { label: "Free", variant: "outline" };

export function SubscriptionBadge({ plan }: { plan: SubscriptionPlan | null }) {
  const config = plan !== null ? PLAN_CONFIG[plan] : FREE_CONFIG;
  return <Badge variant={config.variant}>{config.label}</Badge>;
}
