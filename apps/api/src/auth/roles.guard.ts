import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { IJwtPayload, UserRole } from '@workspace/types';

export const Roles = (...roles: UserRole[]) => SetMetadata('roles', roles);

@Injectable()
export class RolesGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.get<UserRole[]>('roles', ctx.getHandler());
    if (!required?.length) return true;
    const user = ctx.switchToHttp().getRequest<{ user: IJwtPayload }>().user;
    return required.some((role) => user.roles.includes(role));
  }
}
