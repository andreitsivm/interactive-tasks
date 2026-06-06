import type { UserRole, Permission } from "@workspace/types";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      id: string;
      email: string;
      name: string | null;
      roles: UserRole[];
      permissions: Permission[];
    };
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    id: string;
    roles: UserRole[];
    permissions: Permission[];
    accessToken: string;
  }
}
