import { Action } from '@hm/sdk';
import { Booking } from '@src/modules/booking/booking.entity';
import { HotelMarketplaceAppSubscriptionTopic } from '@src/modules/hotel/entities';
import { Order } from '@src/modules/order/order.entity';
import { Pricelist } from '@src/modules/pricelist/pricelist.entity';
import { Space } from '@src/modules/space/space.entity';
import { IsEnum, IsNumber, IsOptional } from 'class-validator';

export type WebhookEntity = Space | Pricelist | Order | Booking;

export type WebhookPayloadEntity = WebhookEntity & {
  __entityName: WebhookPayloadEntityName;
};

export type WebhookPayloadEntityName =
  | 'Space'
  | 'Pricelist'
  | 'Order'
  | 'Booking';

export class SendWebhookArgs {
  @IsNumber({ maxDecimalPlaces: 0 })
  @IsOptional()
  attempt?: number;

  @IsNumber({ maxDecimalPlaces: 0 })
  retryAttempts: number;

  @IsNumber({ maxDecimalPlaces: 0 })
  waitDuration: number;

  @IsEnum(Action)
  action: Action;

  entities: WebhookPayloadEntity[];
}

export class WebhookPayload {
  id: string;

  action: Action;

  topic: HotelMarketplaceAppSubscriptionTopic;

  entities: WebhookPayloadEntity[];

  timestamp: number;
}
