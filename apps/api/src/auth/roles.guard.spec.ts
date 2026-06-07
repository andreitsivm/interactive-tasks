import { RolesGuard } from './roles.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import type { IJwtPayload, UserRole } from '@workspace/types';

function mockContext(user: Partial<IJwtPayload>): ExecutionContext {
  return {
    switchToHttp: () => ({
      getRequest: () => ({ user }),
    }),
    getHandler: () => ({}),
  } as unknown as ExecutionContext;
}

describe('RolesGuard', () => {
  let guard: RolesGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new RolesGuard(reflector);
  });

  it('allows access when no roles are required', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);
    const ctx = mockContext({ roles: ['member' as UserRole] });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('allows access when user has required role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin' as UserRole]);
    const ctx = mockContext({ roles: ['admin' as UserRole] });
    expect(guard.canActivate(ctx)).toBe(true);
  });

  it('denies access when user lacks required role', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(['admin' as UserRole]);
    const ctx = mockContext({ roles: ['member' as UserRole] });
    expect(guard.canActivate(ctx)).toBe(false);
  });
});
