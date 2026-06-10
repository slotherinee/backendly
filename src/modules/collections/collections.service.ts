import {
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
  UnprocessableEntityException,
} from '@nestjs/common';
import { Prisma } from '@prisma/generated/prisma/client';
import { PrismaService } from '@infra/database/prisma.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';
import { MAX_COLLECTIONS_PER_PROJECT } from './constants/collections.constants';

@Injectable()
export class CollectionsService {
  constructor(private readonly prisma: PrismaService) {}

  async create(projectId: string, dto: CreateCollectionDto) {
    this.assertMethodsNoOverlap(dto.publicMethods, dto.protectedMethods);

    const [exists, count] = await Promise.all([
      this.prisma.collection.findUnique({
        where: { projectId_slug: { projectId, slug: dto.slug } },
        select: { id: true },
      }),
      this.prisma.collection.count({ where: { projectId } }),
    ]);

    if (exists) throw new ConflictException('Collection slug already taken');
    if (count >= MAX_COLLECTIONS_PER_PROJECT) {
      throw new ForbiddenException(
        `Collection limit reached (max ${MAX_COLLECTIONS_PER_PROJECT})`,
      );
    }

    return this.prisma.collection.create({
      data: {
        ...dto,
        projectId,
        validationSchema: dto.validationSchema as
          | Prisma.InputJsonValue
          | undefined,
      },
    });
  }

  async findAll(projectId: string) {
    return this.prisma.collection.findMany({
      where: { projectId },
      orderBy: { createdAt: 'desc' },
    });
  }

  async findOne(projectId: string, slug: string) {
    const collection = await this.prisma.collection.findUnique({
      where: { projectId_slug: { projectId, slug } },
    });
    if (!collection) throw new NotFoundException('Collection not found');
    return collection;
  }

  async update(projectId: string, slug: string, dto: UpdateCollectionDto) {
    await this.findOne(projectId, slug);
    this.assertMethodsNoOverlap(dto.publicMethods, dto.protectedMethods);

    return this.prisma.collection.update({
      where: { projectId_slug: { projectId, slug } },
      data: {
        ...dto,
        validationSchema: dto.validationSchema as
          | Prisma.InputJsonValue
          | undefined,
      },
    });
  }

  async delete(projectId: string, slug: string) {
    await this.findOne(projectId, slug);
    await this.prisma.collection.delete({
      where: { projectId_slug: { projectId, slug } },
    });
  }

  private assertMethodsNoOverlap(
    publicMethods?: string[],
    protectedMethods?: string[],
  ) {
    if (!publicMethods || !protectedMethods) return;
    const overlap = publicMethods.filter((m) => protectedMethods.includes(m));
    if (overlap.length) {
      throw new UnprocessableEntityException(
        `Methods cannot be in both publicMethods and protectedMethods: ${overlap.join(', ')}`,
      );
    }
  }
}
