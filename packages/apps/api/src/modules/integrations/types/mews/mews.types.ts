export enum MewsReservationState {
  Enquired = 'Enquired',
  Requested = 'Requested',
  Optional = 'Optional',
  Confirmed = 'Confirmed',
  Started = 'Started',
  Processed = 'Processed',
  Canceled = 'Canceled',
}

export enum MewsDocumentType {
  Passport = 'Passport',
  IdentityCard = 'IdentityCard',
  Visa = 'Visa',
  DriversLicense = 'DriversLicense',
}

export enum MewsResourceState {
  Dirty = 'Dirty',
  Clean = 'Clean',
  Inspected = 'Inspected',
  OutOfService = 'OutOfService',
  OutOfOrder = 'OutOfOrder',
}

export interface MewsDocument {
  Id: string;
  CustomerId: string;
  Type: MewsDocumentType;
  Number?: string;
  Expiration?: string;
  Issuance?: string;
  IssuingCountryCode?: string;
}

export interface MewsCustomer {
  Id: string;
  Number: string;
  FirstName?: string;
  LastName: string;
  NationalityCode?: string;
  LanguageCode?: string;
  BirthDate?: string;
  Address?: {
    Id?: string;
    Line1?: string;
    Line2?: string;
    CountryCode?: string;
  };
  Email?: string;
  Phone?: string;
  CreatedUtc: string;
  UpdatedUtc: string;
  Passport?: { Number?: string };
  Notes?: string;
}

export interface MewsReservation {
  Id: string;
  Number: string;
  State: MewsReservationState;
  ServiceId: string;
  CreatedUtc: string;
  UpdatedUtc: string;
  CancelledUtc?: string;
  StartUtc: string;
  EndUtc: string;
  ReleasedUtc?: string;
  AdultCount: number;
  ChildCount: number;
  CustomerId: string;
  CompanionIds: string[];
  AssignedResourceId: string;
  Purpose?: string;
}

export interface MewsStringUpdateValue {
  Value: string | null;
}
export interface MewsUpdateResourceArgs {
  ResourceId: string;
  State: MewsStringUpdateValue;
}

export interface MewsResource {
  Id: string;
  Name: string;
  State: MewsResourceState;
}

export interface MewsResourceCategoryAssignment {
  Id: string;
  CategoryId: string;
  ResourceId: string;
  IsActive: boolean;
}

export interface MewsLocalizedText {
  ['en-US']: string;
}
export interface MewsResourceCategory {
  Id: string;
  IsActive: boolean;
  Names: MewsLocalizedText;
}
export interface MewsGetAllReservationsResponse {
  Reservations: Array<MewsReservation>;
  Customers: Array<MewsCustomer>;
  Resources: Array<MewsResource>;
  ResourceCategoryAssignments: Array<MewsResourceCategoryAssignment>;
  ResourceCategories: Array<MewsResourceCategory>;
}

export interface MewsAddOrderToServiceAmount {
  GrossValue?: number;
  NetValue?: number;
  Currency: string;
  TaxCodes?: Array<string>;
}

export interface MewsAddOrderToServiceItems {
  Name: string;
  UnitCount: number;
  UnitAmount: MewsAddOrderToServiceAmount;
}

export interface MewsAddOrderToServiceRequestBody {
  CustomerId: string;
  ServiceId: string;
  Notes?: string;
  Items?: Array<MewsAddOrderToServiceItems>;
}

export enum MewsServiceType {
  Reservable = 'Reservable',
  Orderable = 'Orderable',
}

export interface MewsGetAllServicesResponse {
  Services: {
    Id: string;
    Name: string;
    Type: MewsServiceType;
    Data: { Discriminator: string };
  }[];
}

export interface MewsGetAllCustomersResponse {
  Customers: MewsCustomer[];
}

export type MewsAddCustomerResponse = MewsCustomer;
export type MewsUpdateCustomerResponse = MewsCustomer;

export enum MewsEventType {
  Reservation = 'Reservation',
}
export interface MewsSubscriptionEvent {
  Type: MewsEventType;
  Id: string;
  State: MewsReservationState;
  StartUtc: string;
  EndUtc: string;
  AssignedResourceId?: string;
}

export interface MewsSubscriptionPayload {
  Events: MewsSubscriptionEvent[];
}
