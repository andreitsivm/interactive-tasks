import { SubscriptionPlanGuard, RequiresPlan } from './subscription-plan.guard';
import { Reflector } from '@nestjs/core';
import { ExecutionContext } from '@nestjs/common';
import type {
  IJwtPayload,
  UserRole,
  Permission,
  SubscriptionPlan,
} from '@workspace/types';

function mockContext(plan: SubscriptionPlan): ExecutionContext {
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
    expect(guard.canActivate(mockContext('free'))).toBe(true);
  });

  it('allows free user to access free endpoint', () => {
    jest.spyOn(reflector, 'get').mockReturnValue('free');
    expect(guard.canActivate(mockContext('free'))).toBe(true);
  });

  it('allows pro user to access starter endpoint', () => {
    jest.spyOn(reflector, 'get').mockReturnValue('starter');
    expect(guard.canActivate(mockContext('pro'))).toBe(true);
  });

  it('denies free user from starter endpoint', () => {
    jest.spyOn(reflector, 'get').mockReturnValue('starter');
    expect(guard.canActivate(mockContext('free'))).toBe(false);
  });

  it('denies starter user from pro endpoint', () => {
    jest.spyOn(reflector, 'get').mockReturnValue('pro');
    expect(guard.canActivate(mockContext('starter'))).toBe(false);
  });

  it('allows pro user to access pro endpoint', () => {
    jest.spyOn(reflector, 'get').mockReturnValue('pro');
    expect(guard.canActivate(mockContext('pro'))).toBe(true);
  });
});
