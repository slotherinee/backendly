import { Module } from '@nestjs/common';
import { EndpointsController } from './endpoints.controller';
import { EndpointsService } from './endpoints.service';
import { ApiKeysModule } from '@modules/api-keys/api-keys.module';

@Module({
  imports: [ApiKeysModule],
  controllers: [EndpointsController],
  providers: [EndpointsService],
})
export class EndpointsModule {}
