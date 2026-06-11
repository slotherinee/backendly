import {
  ConflictException,
  HttpException,
  HttpStatus,
  Injectable,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma.service';
import { ApiKeysService } from '@modules/api-keys/api-keys.service';
import { Prisma } from '@prisma/generated/prisma/client';
import {
  formatItem,
  parseFilters,
  parsePagination,
  parseSort,
  validateBody,
} from './helpers';

@Injectable()
export class EndpointsService {
  constructor(
    private readonly prisma: PrismaService,
    private readonly apiKeysService: ApiKeysService,
  ) {}

  async resolveContext(
    projectSlug: string,
    collectionSlug: string,
    method: string,
    apiKeyHeader: string | undefined,
    clientIp: string,
  ) {
    const project = await this.prisma.project.findUnique({
      where: { slug: projectSlug },
    });
    if (!project) throw new NotFoundException('Project not found');

    const collection = await this.prisma.collection.findUnique({
      where: {
        projectId_slug: { projectId: project.id, slug: collectionSlug },
      },
    });
    if (!collection) throw new NotFoundException('Collection not found');

    const methodUpper = method.toUpperCase();
    const isPublic = collection.publicMethods.includes(methodUpper);
    const isProtected = collection.protectedMethods.includes(methodUpper);

    if (!isPublic && !isProtected) {
      throw new HttpException(
        'Method Not Allowed',
        HttpStatus.METHOD_NOT_ALLOWED,
      );
    }

    if (isProtected) {
      if (!apiKeyHeader) throw new UnauthorizedException('API key required');
      const apiKey = await this.apiKeysService.resolveByRawKey(apiKeyHeader);
      if (!apiKey || apiKey.projectId !== project.id) {
        throw new UnauthorizedException('Invalid or expired API key');
      }
    }

    if (
      project.ipWhitelist.length > 0 &&
      !project.ipWhitelist.includes(clientIp)
    ) {
      throw new HttpException('Forbidden', HttpStatus.FORBIDDEN);
    }

    return { project, collection };
  }

  async list(
    collectionId: string,
    query: Record<string, unknown>,
    defaultLimit: number,
  ) {
    const { page, limit, skip } = parsePagination(query, defaultLimit);
    const orderBy = parseSort(query);
    const filters = parseFilters(query);

    const where: Prisma.CollectionItemWhereInput = {
      collectionId,
      AND: filters.map((f) => ({
        data: { path: f.path, equals: f.equals } as Prisma.JsonFilter,
      })),
    };

    const [items, total] = await Promise.all([
      this.prisma.collectionItem.findMany({
        where,
        orderBy,
        skip,
        take: limit,
      }),
      this.prisma.collectionItem.count({ where }),
    ]);

    return {
      data: items.map(formatItem),
      meta: { total, page, limit, totalPages: Math.ceil(total / limit) },
    };
  }

  async getOne(collectionId: string, id: string) {
    const item = await this.prisma.collectionItem.findFirst({
      where: { id, collectionId },
    });
    if (!item) throw new NotFoundException('Item not found');
    return formatItem(item);
  }

  async create(
    collectionId: string,
    maxItems: number,
    validationSchema: unknown,
    body: Record<string, unknown>,
  ) {
    if (validationSchema) validateBody(validationSchema, body);

    const count = await this.prisma.collectionItem.count({
      where: { collectionId },
    });
    if (count >= maxItems) {
      throw new ConflictException(
        `Collection item limit reached (max ${maxItems})`,
      );
    }

    const item = await this.prisma.collectionItem.create({
      data: { collectionId, data: body as Prisma.InputJsonValue },
    });
    return formatItem(item);
  }

  async replace(
    collectionId: string,
    id: string,
    validationSchema: unknown,
    body: Record<string, unknown>,
  ) {
    await this.getOne(collectionId, id);
    if (validationSchema) validateBody(validationSchema, body);

    const item = await this.prisma.collectionItem.update({
      where: { id },
      data: { data: body as Prisma.InputJsonValue },
    });
    return formatItem(item);
  }

  async update(
    collectionId: string,
    id: string,
    validationSchema: unknown,
    body: Record<string, unknown>,
  ) {
    const existing = await this.getOne(collectionId, id);
    const {
      id: _id,
      createdAt: _ca,
      updatedAt: _ua,
      ...existingData
    } = existing;
    void _id;
    void _ca;
    void _ua;
    const merged = { ...existingData, ...body };

    if (validationSchema) validateBody(validationSchema, merged);

    const item = await this.prisma.collectionItem.update({
      where: { id },
      data: { data: merged },
    });
    return formatItem(item);
  }

  async delete(collectionId: string, id: string) {
    await this.getOne(collectionId, id);
    await this.prisma.collectionItem.delete({ where: { id } });
  }
}
