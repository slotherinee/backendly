import { Module } from '@nestjs/common';
import { AuthModule as BetterAuthModule } from '@thallesp/nestjs-better-auth';
import { auth } from '@infra/auth/auth';
import { AuthGuard } from '@common/guards/auth.guard';

@Module({
  imports: [BetterAuthModule.forRoot({ auth })],
  providers: [AuthGuard],
  exports: [BetterAuthModule, AuthGuard],
})
export class AuthModule {}
