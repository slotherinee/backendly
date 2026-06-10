import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Patch,
  Post,
  UseGuards,
} from '@nestjs/common';
import { ProjectOwnerGuard } from '@common/guards/project-owner.guard';
import { ProjectsService } from '@modules/projects/projects.service';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('projects/:slug/collections')
@UseGuards(ProjectOwnerGuard)
export class CollectionsController {
  constructor(
    private readonly collectionsService: CollectionsService,
    private readonly projectsService: ProjectsService,
  ) {}

  @Post()
  async create(@Param('slug') slug: string, @Body() dto: CreateCollectionDto) {
    const project = await this.projectsService.findBySlug(slug);
    return this.collectionsService.create(project.id, dto);
  }

  @Get()
  async findAll(@Param('slug') slug: string) {
    const project = await this.projectsService.findBySlug(slug);
    return this.collectionsService.findAll(project.id);
  }

  @Get(':collectionSlug')
  async findOne(
    @Param('slug') slug: string,
    @Param('collectionSlug') collectionSlug: string,
  ) {
    const project = await this.projectsService.findBySlug(slug);
    return this.collectionsService.findOne(project.id, collectionSlug);
  }

  @Patch(':collectionSlug')
  async update(
    @Param('slug') slug: string,
    @Param('collectionSlug') collectionSlug: string,
    @Body() dto: UpdateCollectionDto,
  ) {
    const project = await this.projectsService.findBySlug(slug);
    return this.collectionsService.update(project.id, collectionSlug, dto);
  }

  @Delete(':collectionSlug')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('slug') slug: string,
    @Param('collectionSlug') collectionSlug: string,
  ) {
    const project = await this.projectsService.findBySlug(slug);
    return this.collectionsService.delete(project.id, collectionSlug);
  }
}
