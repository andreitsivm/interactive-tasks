import { SubscriptionPlanGuard, RequiresPlan } from './subscription-plan.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import type {
  IJwtPayload,
  UserRole,
  Permission,
  SubscriptionPlan,
} from '@workspace/types';

function mockContext(plan: SubscriptionPlan | null): ExecutionContext {
  const user: Partial<IJwtPayload> = {
    sub: 'user-1',
    email: 'test@example.com',
    roles: ['member' as UserRole],
    permissions: ['read:tasks' as Permission],
    subscriptionPlan: plan,
  };
  return {
    switchToHttp: () => ({ getRequest: () => ({ user }) }),
    getHandler: () => ({}),
  } as unknown as ExecutionContext;
}

describe('SubscriptionPlanGuard', () => {
  let guard: SubscriptionPlanGuard;
  let reflector: Reflector;

  beforeEach(() => {
    reflector = new Reflector();
    guard = new SubscriptionPlanGuard(reflector);
  });

  it('allows access when no plan is required', () => {
    jest.spyOn(reflector, 'get').mockReturnValue(undefined);
    expect(guard.canActivate(mockContext(null))).toBe(true);
  });

  it('denies access when subscriptionPlan is null', () => {
    jest.spyOn(reflector, 'get').mockReturnValue('trial');
    expect(guard.canActivate(mockContext(null))).toBe(false);
  });

  it('denies expired user from trial endpoint', () => {
    jest.spyOn(reflector, 'get').mockReturnValue('trial');
    expect(guard.canActivate(mockContext('expired'))).toBe(false);
  });

  it('allows trial user to access trial endpoint', () => {
    jest.spyOn(reflector, 'get').mockReturnValue('trial');
    expect(guard.canActivate(mockContext('trial'))).toBe(true);
  });

  it('denies trial user from pro endpoint', () => {
    jest.spyOn(reflector, 'get').mockReturnValue('pro');
    expect(guard.canActivate(mockContext('trial'))).toBe(false);
  });

  it('allows pro user to access trial endpoint', () => {
    jest.spyOn(reflector, 'get').mockReturnValue('trial');
    expect(guard.canActivate(mockContext('pro'))).toBe(true);
  });

  it('allows pro user to access pro endpoint', () => {
    jest.spyOn(reflector, 'get').mockReturnValue('pro');
    expect(guard.canActivate(mockContext('pro'))).toBe(true);
  });
});
