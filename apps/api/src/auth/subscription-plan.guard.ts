import {
  Injectable,
  CanActivate,
  ExecutionContext,
  SetMetadata,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import type { IJwtPayload, SubscriptionPlan } from '@workspace/types';

const PLAN_HIERARCHY: Record<SubscriptionPlan, number> = {
  free: 0,
  starter: 1,
  pro: 2,
};

export const RequiresPlan = (plan: SubscriptionPlan) =>
  SetMetadata('requiredPlan', plan);

@Injectable()
export class SubscriptionPlanGuard implements CanActivate {
  constructor(private readonly reflector: Reflector) {}

  canActivate(ctx: ExecutionContext): boolean {
    const required = this.reflector.get<SubscriptionPlan | undefined>(
      'requiredPlan',
      ctx.getHandler(),
    );
    if (!required) return true;
    const user = ctx.switchToHttp().getRequest<{ user: IJwtPayload }>().user;
    return PLAN_HIERARCHY[user.subscriptionPlan] >= PLAN_HIERARCHY[required];
  }
}
