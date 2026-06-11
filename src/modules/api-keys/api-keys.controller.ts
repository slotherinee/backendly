import {
  Body,
  Controller,
  Delete,
  Get,
  HttpCode,
  HttpStatus,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { ProjectOwnerGuard } from '@common/guards/project-owner.guard';
import type { ProjectRequest } from '@common/types/project-request.type';
import { ApiKeysService } from './api-keys.service';
import { CreateApiKeyDto } from './dto/create-api-key.dto';

@Controller('projects/:slug/api-keys')
@UseGuards(ProjectOwnerGuard)
export class ApiKeysController {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  @Post()
  create(@Req() req: ProjectRequest, @Body() dto: CreateApiKeyDto) {
    return this.apiKeysService.create(req.resolvedProject.id, dto);
  }

  @Get()
  findAll(@Req() req: ProjectRequest) {
    return this.apiKeysService.findAllByProject(req.resolvedProject.id);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  revoke(@Req() req: ProjectRequest, @Param('id') id: string) {
    return this.apiKeysService.revoke(id, req.resolvedProject.id);
  }
}
