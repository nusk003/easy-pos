import { IntegrationProvider } from '@src/modules/hotel/entities';

export * from './apaleo-booking.types';

export enum ApaleoTopics {
  Account = 'Account',
  Property = 'Property',
  Reservation = 'Reservation',
  Booking = 'Booking',
  Company = 'Company',
  Group = 'Group',
  Block = 'Block',
  Unit = 'Unit',
  UnitGroup = 'UnitGroup',
  Folio = 'Folio',
  Invoice = 'Invoice',
  RatePlan = 'RatePlan',
  NightAudit = 'NightAudit',
  Maintenance = 'Maintenance',
  System = 'System',
}

export enum ApaleoNameTitle {
  Mr = 'Mr',
  Mrs = 'Mrs',
  Miss = 'Miss',
}

export enum ApaleoGender {
  Male = 'Male',
  Female = 'Female',
  Other = 'Other',
}

export interface ApaleoExchangeAccessKeyAPIData {
  client_id: string;
  grant_type: string;
  client_secret: string;
  code: string;
  redirect_uri: string;
}

export interface ApaleoExchangeAccessKeyAPIResponse {
  id_token: string;
  access_token: string;
  expires_in: number;
  token_type: string;
  refresh_token: string;
}

export interface ApaleoCreateSubscriptionAPIData {
  endpointUrl: string;
  topics: Array<ApaleoTopics>;
  propertyIds?: Array<string>;
}

export interface ApaleoProperty {
  id: string;
  code: string;
  isTemplate: boolean;
  name: string;
  description: string;
  location: {
    addressLine1: string;
    postalCode: string;
    city: string;
    countryCode: string;
  };
  timeZone: string;
  created: string;
  status: string;
  isArchived: boolean;
}

export interface ApaleoAllPropertiesResponse {
  properties: Array<ApaleoProperty>;
}

export enum ApaleoEventType {
  Created = 'created',
  Changed = 'changed',
  Deleted = 'deleted',
  UnitAssigned = 'unit-assigned',
  UnitUnassigned = 'unit-unassigned',
  Canceled = 'canceled',
  CheckedIn = 'checked-in',
  Amended = 'amended',
}

export interface ApaleoSubscriptionPayload {
  topic: ApaleoTopics;
  type: string;
  id: string;
  accountId: string;
  propertyId: string;
  data: {
    entityId: string;
  };
  timestamp: number;
}

export interface WebhookJWTPayload {
  id: IntegrationProvider;
  group?: string;
  hotel?: string;
  iss?: string;
}
