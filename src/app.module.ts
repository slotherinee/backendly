import configuration from '@infra/config/configuration';
import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { PrismaModule } from '@infra/database/prisma.module';
import { AuthModule } from '@modules/auth/auth.module';
import { UsersModule } from '@modules/users/users.module';
import { ProjectsModule } from '@modules/projects/projects.module';
import { ApiKeysModule } from '@modules/api-keys/api-keys.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true, load: [configuration] }),
    PrismaModule,
    AuthModule,
    UsersModule,
    ProjectsModule,
    ApiKeysModule,
  ],
})
export class AppModule {}
