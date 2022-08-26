import { Body, Controller, HttpCode, Param, Post } from '@nestjs/common';
import { IntegrationProvider } from '@src/modules/hotel/entities';
import { IntegrationsApaleoService } from './services/integrations-apaleo.service';
import { IntegrationsMewsService } from './services/integrations-mews.service';
import { IntegrationsService } from './services/integrations.service';
import { SubscriptionPayload } from './types';

@Controller('/integrations')
export class IntegrationsController {
  constructor(
    private readonly apaleoService: IntegrationsApaleoService,
    private readonly mewsService: IntegrationsMewsService,
    private readonly integrationService: IntegrationsService
  ) {}

  @Post('/subscriptions/:token')
  @HttpCode(200)
  async subscriptions(
    @Body() body: SubscriptionPayload,
    @Param('token') token: string
  ) {
    const payload = await this.integrationService.validateWebhookJWT(token);
    if (payload.id === IntegrationProvider.Apaleo) {
      await this.apaleoService.validateWebhookJWT(payload);
      await this.apaleoService.handleWebhook(body);
    } else if (payload.id === IntegrationProvider.Mews) {
      await this.mewsService.validateWebhookJWT(payload);
      await this.mewsService.handleWebhook(body);
    }
  }
}
