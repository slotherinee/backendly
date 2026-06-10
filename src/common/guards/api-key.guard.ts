import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { ApiKeysService } from '@modules/api-keys/api-keys.service';
import type { Request } from 'express';

@Injectable()
export class ApiKeyGuard implements CanActivate {
  constructor(private readonly apiKeysService: ApiKeysService) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest<Request>();
    const raw = req.headers['x-api-key'] as string | undefined;

    if (!raw) throw new UnauthorizedException('API key required');

    const apiKey = await this.apiKeysService.resolveByRawKey(raw);
    if (!apiKey) throw new UnauthorizedException('Invalid or expired API key');

    Object.assign(req, { resolvedProject: apiKey.project });

    return true;
  }
}
