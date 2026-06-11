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
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProjectOwnerGuard } from '@common/guards/project-owner.guard';
import type { ProjectRequest } from '@common/types/project-request.type';
import { CollectionsService } from './collections.service';
import { CreateCollectionDto } from './dto/create-collection.dto';
import { UpdateCollectionDto } from './dto/update-collection.dto';

@Controller('projects/:slug/collections')
@UseGuards(ProjectOwnerGuard)
export class CollectionsController {
  constructor(private readonly collectionsService: CollectionsService) {}

  @Post()
  create(@Req() req: ProjectRequest, @Body() dto: CreateCollectionDto) {
    return this.collectionsService.create(req.resolvedProject.id, dto);
  }

  @Get()
  findAll(@Req() req: ProjectRequest) {
    return this.collectionsService.findAll(req.resolvedProject.id);
  }

  @Get(':collectionSlug')
  findOne(
    @Req() req: ProjectRequest,
    @Param('collectionSlug') collectionSlug: string,
  ) {
    return this.collectionsService.findOne(
      req.resolvedProject.id,
      collectionSlug,
    );
  }

  @Patch(':collectionSlug')
  update(
    @Req() req: ProjectRequest,
    @Param('collectionSlug') collectionSlug: string,
    @Body() dto: UpdateCollectionDto,
  ) {
    return this.collectionsService.update(
      req.resolvedProject.id,
      collectionSlug,
      dto,
    );
  }

  @Delete(':collectionSlug')
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(
    @Req() req: ProjectRequest,
    @Param('collectionSlug') collectionSlug: string,
  ) {
    return this.collectionsService.delete(
      req.resolvedProject.id,
      collectionSlug,
    );
  }
}
