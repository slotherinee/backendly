import { Module } from '@nestjs/common';
import { APP_GUARD } from '@nestjs/core';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '@infra/auth/auth';
import { AuthGuard } from '@common/guards/auth.guard';

@Module({
  imports: [
    BetterAuthModule.forRoot({
      auth,
      disableGlobalAuthGuard: true,
    }),
  ],
  providers: [AuthGuard, { provide: APP_GUARD, useClass: AuthGuard }],
  exports: [AuthGuard],
})
export class AuthModule {}
