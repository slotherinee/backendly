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
  Put,
  Query,
  Req,
} from '@nestjs/common';
import type { Request } from 'express';
import { AllowAnonymous } from '@common/decorators/allow-anonymous.decorator';
import { EndpointsService } from './endpoints.service';

@Controller('api')
@AllowAnonymous()
export class EndpointsController {
  constructor(private readonly endpointsService: EndpointsService) {}

  @Get(':projectSlug/:collectionSlug')
  async list(
    @Param('projectSlug') projectSlug: string,
    @Param('collectionSlug') collectionSlug: string,
    @Query() query: Record<string, unknown>,
    @Req() req: Request,
  ) {
    const { collection } = await this.endpointsService.resolveContext(
      projectSlug,
      collectionSlug,
      'GET',
      req.headers['x-api-key'] as string | undefined,
      req.ip ?? '',
    );
    return this.endpointsService.list(
      collection.id,
      query,
      collection.defaultLimit,
    );
  }

  @Get(':projectSlug/:collectionSlug/:id')
  async getOne(
    @Param('projectSlug') projectSlug: string,
    @Param('collectionSlug') collectionSlug: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const { collection } = await this.endpointsService.resolveContext(
      projectSlug,
      collectionSlug,
      'GET',
      req.headers['x-api-key'] as string | undefined,
      req.ip ?? '',
    );
    return this.endpointsService.getOne(collection.id, id);
  }

  @Post(':projectSlug/:collectionSlug')
  async create(
    @Param('projectSlug') projectSlug: string,
    @Param('collectionSlug') collectionSlug: string,
    @Body() body: Record<string, unknown>,
    @Req() req: Request,
  ) {
    const { collection } = await this.endpointsService.resolveContext(
      projectSlug,
      collectionSlug,
      'POST',
      req.headers['x-api-key'] as string | undefined,
      req.ip ?? '',
    );
    return this.endpointsService.create(
      collection.id,
      collection.maxItems,
      collection.validationSchema,
      body,
    );
  }

  @Put(':projectSlug/:collectionSlug/:id')
  async replace(
    @Param('projectSlug') projectSlug: string,
    @Param('collectionSlug') collectionSlug: string,
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @Req() req: Request,
  ) {
    const { collection } = await this.endpointsService.resolveContext(
      projectSlug,
      collectionSlug,
      'PUT',
      req.headers['x-api-key'] as string | undefined,
      req.ip ?? '',
    );
    return this.endpointsService.replace(
      collection.id,
      id,
      collection.validationSchema,
      body,
    );
  }

  @Patch(':projectSlug/:collectionSlug/:id')
  async update(
    @Param('projectSlug') projectSlug: string,
    @Param('collectionSlug') collectionSlug: string,
    @Param('id') id: string,
    @Body() body: Record<string, unknown>,
    @Req() req: Request,
  ) {
    const { collection } = await this.endpointsService.resolveContext(
      projectSlug,
      collectionSlug,
      'PATCH',
      req.headers['x-api-key'] as string | undefined,
      req.ip ?? '',
    );
    return this.endpointsService.update(
      collection.id,
      id,
      collection.validationSchema,
      body,
    );
  }

  @Delete(':projectSlug/:collectionSlug/:id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(
    @Param('projectSlug') projectSlug: string,
    @Param('collectionSlug') collectionSlug: string,
    @Param('id') id: string,
    @Req() req: Request,
  ) {
    const { collection } = await this.endpointsService.resolveContext(
      projectSlug,
      collectionSlug,
      'DELETE',
      req.headers['x-api-key'] as string | undefined,
      req.ip ?? '',
    );
    return this.endpointsService.delete(collection.id, id);
  }
}
