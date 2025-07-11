import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import { RequestWithSession } from '../types/auth.types';

export const UserId = createParamDecorator(
  (_data: unknown, ctx: ExecutionContext) => {
    const request: RequestWithSession = ctx.switchToHttp().getRequest();
    return request.session?.user?.id;
  },
);
