import { createParamDecorator, ExecutionContext } from '@nestjs/common';
import type { Request } from 'express';
import type { Session } from '@infra/auth/auth';

type AuthRequest = Request & {
  user: Session['user'];
  session: Session['session'];
};

export const CurrentUser = createParamDecorator(
  (_: unknown, ctx: ExecutionContext): Session['user'] => {
    const req = ctx.switchToHttp().getRequest<AuthRequest>();
    return req.user;
  },
);
