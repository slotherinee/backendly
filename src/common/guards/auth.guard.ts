import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { Reflector } from '@nestjs/core';
import { auth } from '@infra/auth/auth';
import { PrismaService } from '@infra/database/prisma.service';
import { IS_PUBLIC_KEY } from '@common/decorators/allow-anonymous.decorator';
import { fromNodeHeaders } from 'better-auth/node';
import type { Request } from 'express';

@Injectable()
export class AuthGuard implements CanActivate {
  constructor(
    private readonly prisma: PrismaService,
    private readonly reflector: Reflector,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const isPublic = this.reflector.getAllAndOverride<boolean>(IS_PUBLIC_KEY, [
      context.getHandler(),
      context.getClass(),
    ]);

    if (isPublic) return true;

    const req = context.switchToHttp().getRequest<Request>();

    const session = await auth.api.getSession({
      headers: fromNodeHeaders(req.headers),
    });

    if (!session?.user) {
      throw new UnauthorizedException();
    }

    const user = await this.prisma.user.findUnique({
      where: { id: session.user.id },
      select: { deletedAt: true },
    });

    if (!user || user.deletedAt) {
      throw new UnauthorizedException();
    }

    Object.assign(req, { user: session.user, session: session.session });

    return true;
  }
}
