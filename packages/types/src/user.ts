export enum UserRole {
  Admin = "admin",
  Manager = "manager",
  Member = "member",
}

export enum Permission {
  ReadTasks = "read:tasks",
  WriteTasks = "write:tasks",
  ManageUsers = "manage:users",
}

export interface IUser {
  id: string;
  email: string;
  name: string | null;
  roles: UserRole[];
  permissions: Permission[];
  createdAt: Date;
}
