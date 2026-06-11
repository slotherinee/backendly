import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma.service';
import type { Request } from 'express';
import type { Session } from '@infra/auth/auth';
import type { Project } from '@prisma/generated/prisma/client';

type AuthRequest = Request & {
  user: Session['user'];
  resolvedProject: Project;
};

@Injectable()
export class ProjectOwnerGuard implements CanActivate {
  constructor(private readonly prisma: PrismaService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<AuthRequest>();
    const slug = req.params.slug as string;

    const project = await this.prisma.project.findUnique({ where: { slug } });

    if (!project) throw new NotFoundException('Project not found');
    if (project.ownerId !== req.user.id) throw new ForbiddenException();

    req.resolvedProject = project;

    return true;
  }
}
