import { Module } from '@nestjs/common';
import { ApiKeysController } from './api-keys.controller';
import { ApiKeysService } from './api-keys.service';
import { ProjectOwnerGuard } from '@common/guards/project-owner.guard';
import { ApiKeyGuard } from '@common/guards/api-key.guard';

@Module({
  controllers: [ApiKeysController],
  providers: [ApiKeysService, ProjectOwnerGuard, ApiKeyGuard],
  exports: [ApiKeysService, ApiKeyGuard],
})
export class ApiKeysModule {}
