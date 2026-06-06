import type { IUser } from "./user";
import type { UserRole, Permission } from "./user";

export type SubscriptionPlan = "free" | "starter" | "pro";

export interface IJwtPayload {
  sub: string;
  email: string;
  roles: UserRole[];
  permissions: Permission[];
  subscriptionPlan: SubscriptionPlan;
  iat?: number;
  exp?: number;
}

export interface IAuthSession {
  user: Pick<IUser, "id" | "email" | "name" | "roles" | "permissions">;
  accessToken: string;
}
