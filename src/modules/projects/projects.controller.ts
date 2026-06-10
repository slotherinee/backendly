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
import { CurrentUser } from '@common/decorators/current-user.decorator';
import { ProjectOwnerGuard } from '@common/guards/project-owner.guard';
import { ProjectsService } from './projects.service';
import { CreateProjectDto } from './dto/create-project.dto';
import { UpdateProjectDto } from './dto/update-project.dto';
import type { Session } from '@infra/auth/auth';

@Controller('projects')
export class ProjectsController {
  constructor(private readonly projectsService: ProjectsService) {}

  @Post()
  create(@CurrentUser() user: Session['user'], @Body() dto: CreateProjectDto) {
    return this.projectsService.create(user.id, dto);
  }

  @Get()
  findAll(@CurrentUser() user: Session['user']) {
    return this.projectsService.findAllByOwner(user.id);
  }

  @Get(':slug')
  @UseGuards(ProjectOwnerGuard)
  findOne(@Param('slug') slug: string) {
    return this.projectsService.findBySlug(slug);
  }

  @Patch(':slug')
  @UseGuards(ProjectOwnerGuard)
  update(@Param('slug') slug: string, @Body() dto: UpdateProjectDto) {
    return this.projectsService.update(slug, dto);
  }

  @Delete(':slug')
  @UseGuards(ProjectOwnerGuard)
  @HttpCode(HttpStatus.NO_CONTENT)
  delete(@Param('slug') slug: string) {
    return this.projectsService.delete(slug);
  }
}
