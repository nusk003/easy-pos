import { IntegrationProvider } from '@src/modules/hotel/entities';

export interface MewsStreamSession {
  hotel: string;
  provider: IntegrationProvider;
}

export interface MewsStreamJWTPayload {
  hotel: string;
  iss?: string;
  provider: IntegrationProvider;
}
