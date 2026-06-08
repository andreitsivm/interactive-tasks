import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { IJwtPayload } from '@workspace/types';

export const CurrentUser = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext): IJwtPayload =>
    ctx.switchToHttp().getRequest<{ user: IJwtPayload }>().user,
);
