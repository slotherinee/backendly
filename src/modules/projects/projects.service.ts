import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import { MAX_PROJECTS_PER_USER } from './constants/projects.constants';

@Injectable()
export class ProjectsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(ownerId: string, dto: CreateProjectDto) {
    const [exists, count] = await Promise.all([
      this.prisma.project.findUnique({
        where: { slug: dto.slug },
        select: { id: true },
      }),
      this.prisma.project.count({ where: { ownerId } }),
    ]);

    if (exists) throw new ConflictException('Slug already taken');
    if (count >= MAX_PROJECTS_PER_USER) {
      throw new ForbiddenException(
        `Project limit reached (max ${MAX_PROJECTS_PER_USER})`,
      );
    }

    return this.prisma.project.create({
      data: { ...dto, ownerId },
    });
  }

  async findAllByOwner(ownerId: string) {
    return this.prisma.project.findMany({
      where: { ownerId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findBySlug(slug: string) {
    const project = await this.prisma.project.findUnique({ where: { slug } });
    if (!project) throw new NotFoundException('Project not found');
    return project;
  }

  async update(slug: string, dto: UpdateProjectDto) {
    return this.prisma.project.update({
      where: { slug },
      data: dto,
    });
  }

  async delete(slug: string) {
    await this.prisma.project.delete({ where: { slug } });
  }
}
