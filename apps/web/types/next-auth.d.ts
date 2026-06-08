import type { UserRole, Permission, SubscriptionPlan } from "@workspace/types";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      email: string;
      name: string | null;
      roles: UserRole[];
      permissions: Permission[];
      subscriptionPlan: SubscriptionPlan | null;
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roles: UserRole[];
    permissions: Permission[];
    accessToken: string;
    subscriptionPlan: SubscriptionPlan | null;
  }
}
