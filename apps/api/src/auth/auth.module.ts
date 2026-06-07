import { Module } from '@nestjs/common';
import { PassportModule } from '@nestjs/passport';
import { JwtStrategy } from './jwt.strategy';
import { JwtGuard } from './jwt.guard';
import { RolesGuard } from './roles.guard';
import { SubscriptionPlanGuard } from './subscription-plan.guard';

@Module({
  imports: [PassportModule],
  providers: [JwtStrategy, JwtGuard, RolesGuard, SubscriptionPlanGuard],
  exports: [JwtGuard, RolesGuard, SubscriptionPlanGuard],
})
export class AuthModule {}
