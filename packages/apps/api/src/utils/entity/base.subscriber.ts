import { EventSubscriber, FlushEventArgs } from '@mikro-orm/core';
import { sendHotelStreamToSNS } from '@src/middleware/hotel-stream.middleware';

export class BaseSubscriber implements EventSubscriber {
  async afterFlush(args: FlushEventArgs) {
    await sendHotelStreamToSNS(args);
  }
}
