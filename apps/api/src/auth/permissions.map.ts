import { UserRole, Permission } from '@workspace/types';

export const ROLE_PERMISSIONS: Record<UserRole, Permission[]> = {
  [UserRole.Admin]: Object.values(Permission),
  [UserRole.Manager]: [Permission.ReadTasks, Permission.WriteTasks],
  [UserRole.Member]: [Permission.ReadTasks],
};

export function getRolePermissions(roles: UserRole[]): Permission[] {
  const perms = new Set(roles.flatMap((r) => ROLE_PERMISSIONS[r] ?? []));
  return [...perms];
}
