import { Injectable, Scope, UnauthorizedException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { WebhookJWTPayload } from '@src/modules/integrations/types';

@Injectable({ scope: Scope.REQUEST })
export class IntegrationsService {
  constructor(private jwtService: JwtService) {}

  validateWebhookJWT(token: string) {
    const payload = this.jwtService.decode(token) as WebhookJWTPayload;

    if (!payload || payload.iss !== 'Hotel Manager') {
      throw new UnauthorizedException();
    }

    return payload;
  }
}
