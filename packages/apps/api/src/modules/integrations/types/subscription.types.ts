import { ApaleoSubscriptionPayload } from './apaleo';
import { MewsSubscriptionPayload } from './mews';

export type SubscriptionPayload = ApaleoSubscriptionPayload &
  MewsSubscriptionPayload;
