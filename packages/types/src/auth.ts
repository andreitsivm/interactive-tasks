import type { IUser } from "./user.js";
import type { UserRole, Permission } from "./user.js";

export interface IJwtPayload {
  sub: string;
  email: string;
  roles: UserRole[];
  permissions: Permission[];
  iat?: number;
  exp?: number;
}

export interface IAuthSession {
  user: Pick<IUser, "id" | "email" | "name" | "roles" | "permissions">;
  accessToken: string;
}
