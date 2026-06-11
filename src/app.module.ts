import configuration from '@infra/config/configuration';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@infra/database/prisma.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { ProjectsModule } from '@modules/projects/projects.module';
import { ApiKeysModule } from '@modules/api-keys/api-keys.module';
import { CollectionsModule } from '@modules/collections/collections.module';
import { EndpointsModule } from '@modules/endpoints/endpoints.module';
import { AppThrottlerModule } from '@infra/throttler/throttler.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    AppThrottlerModule,
    PrismaModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    ApiKeysModule,
    CollectionsModule,
    EndpointsModule,
  ],
})
export class AppModule {}
