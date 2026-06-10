import {
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { createHash, randomBytes } from 'crypto';
import { PrismaService } from '@infra/database/prisma.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';
import {
  API_KEY_PREFIX,
  MAX_API_KEYS_PER_PROJECT,
} from './constants/api-keys.constants';

@Injectable()
export class ApiKeysService {
  constructor(private readonly prisma: PrismaService) {}

  async create(projectId: string, dto: CreateApiKeyDto) {
    const count = await this.prisma.apiKey.count({ where: { projectId } });
    if (count >= MAX_API_KEYS_PER_PROJECT) {
      throw new ForbiddenException(
        `API key limit reached (max ${MAX_API_KEYS_PER_PROJECT})`,
      );
    }

    const raw = API_KEY_PREFIX + randomBytes(32).toString('hex');
    const keyHash = createHash('sha256').update(raw).digest('hex');
    const keyPrefix = raw.slice(0, 16);

    const apiKey = await this.prisma.apiKey.create({
      data: {
        name: dto.name,
        keyHash,
        keyPrefix,
        projectId,
        expiresAt: dto.expiresAt ? new Date(dto.expiresAt) : null,
      },
    });

    return { ...apiKey, key: raw };
  }

  async findAllByProject(projectId: string) {
    return this.prisma.apiKey.findMany({
      where: { projectId },
      select: {
        id: true,
        name: true,
        keyPrefix: true,
        lastUsedAt: true,
        expiresAt: true,
        createdAt: true,
      },
      orderBy: { createdAt: 'desc' },
    });
  }

  async revoke(id: string, projectId: string) {
    const key = await this.prisma.apiKey.findFirst({
      where: { id, projectId },
    });
    if (!key) throw new NotFoundException('API key not found');
    await this.prisma.apiKey.delete({ where: { id } });
  }

  async resolveByRawKey(raw: string) {
    const keyHash = createHash('sha256').update(raw).digest('hex');
    const apiKey = await this.prisma.apiKey.findUnique({
      where: { keyHash },
      include: { project: true },
    });

    if (!apiKey) return null;
    if (apiKey.expiresAt && apiKey.expiresAt < new Date()) return null;

    await this.prisma.apiKey.update({
      where: { id: apiKey.id },
      data: { lastUsedAt: new Date() },
    });

    return apiKey;
  }
}
