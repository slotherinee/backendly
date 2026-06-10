import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  UseGuards,
} from '@nestjs/common';
import { PrismaService } from '@infra/database/prisma.service';
import { ProjectOwnerGuard } from '@common/guards/project-owner.guard';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@Controller('projects/:slug/api-keys')
@UseGuards(ProjectOwnerGuard)
export class ApiKeysController {
  constructor(
    private readonly apiKeysService: ApiKeysService,
    private readonly prisma: PrismaService,
  ) {}

  @Post()
  async create(@Param('slug') slug: string, @Body() dto: CreateApiKeyDto) {
    const { id } = await this.prisma.project.findUniqueOrThrow({
      where: { slug },
      select: { id: true },
    });
    return this.apiKeysService.create(id, dto);
  }

  @Get()
  async findAll(@Param('slug') slug: string) {
    const { id } = await this.prisma.project.findUniqueOrThrow({
      where: { slug },
      select: { id: true },
    });
    return this.apiKeysService.findAllByProject(id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async revoke(@Param('slug') slug: string, @Param('id') id: string) {
    const project = await this.prisma.project.findUniqueOrThrow({
      where: { slug },
      select: { id: true },
    });
    return this.apiKeysService.revoke(id, project.id);
  }
}
