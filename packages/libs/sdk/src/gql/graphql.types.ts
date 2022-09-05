import { GraphQLClient } from 'graphql-request';
import * as Dom from 'graphql-request/dist/types.dom';
import gql from 'graphql-tag';
export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | null | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  /** A date-time string at UTC, such as 2019-12-03T09:54:33Z, compliant with the date-time format. */
  DateTime: any;
  /** The `Upload` scalar type represents a file upload. */
  Upload: any;
};

export enum AccessTokenGrantLevel {
  Hotel = 'Hotel',
  User = 'User'
}

export enum AgeGroup {
  Adult = 'Adult',
  Child = 'Child'
}

export type ApaleoPropertyResponse = {
  __typename?: 'ApaleoPropertyResponse';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type Attraction = {
  __typename?: 'Attraction';
  catalog?: Maybe<AttractionCatalog>;
  dateCreated: Scalars['DateTime'];
  dateUpdated: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  description?: Maybe<Scalars['String']>;
  enabled?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
};

export type AttractionCatalog = {
  __typename?: 'AttractionCatalog';
  categories: Array<AttractionCategory>;
  labels?: Maybe<Array<AttractionPlaceLabel>>;
};

export type AttractionCatalogInput = {
  categories: Array<AttractionCategoryInput>;
  labels?: InputMaybe<Array<AttractionPlaceLabelInput>>;
};

export type AttractionCategory = {
  __typename?: 'AttractionCategory';
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  name: Scalars['String'];
  places: Array<AttractionPlace>;
};

export type AttractionCategoryInput = {
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  name: Scalars['String'];
  places: Array<AttractionPlaceInput>;
};

export type AttractionCoordinatesInput = {
  lat: Scalars['Float'];
  lng: Scalars['Float'];
};

export type AttractionPlace = {
  __typename?: 'AttractionPlace';
  address: Scalars['String'];
  coordinates?: Maybe<Coordinates>;
  description?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  labels: Array<AttractionPlaceLabel>;
  name: Scalars['String'];
  note?: Maybe<Scalars['String']>;
  phone?: Maybe<Scalars['String']>;
  photos: Array<Scalars['String']>;
  placeId?: Maybe<Scalars['String']>;
  rating?: Maybe<Scalars['Float']>;
  requestBooking: Scalars['Boolean'];
  website?: Maybe<Scalars['String']>;
};

export type AttractionPlaceInput = {
  address: Scalars['String'];
  coordinates?: InputMaybe<AttractionCoordinatesInput>;
  description?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  labels?: InputMaybe<Array<AttractionPlaceLabelInput>>;
  name: Scalars['String'];
  note?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
  photos: Array<Scalars['String']>;
  placeId?: InputMaybe<Scalars['String']>;
  rating?: InputMaybe<Scalars['Float']>;
  requestBooking?: InputMaybe<Scalars['Boolean']>;
  website?: InputMaybe<Scalars['String']>;
};

export type AttractionPlaceLabel = {
  __typename?: 'AttractionPlaceLabel';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type AttractionPlaceLabelInput = {
  id: Scalars['String'];
  name: Scalars['String'];
};

export type Availability = {
  __typename?: 'Availability';
  f?: Maybe<DaysTime>;
  m?: Maybe<DaysTime>;
  s?: Maybe<DaysTime>;
  sa?: Maybe<DaysTime>;
  t?: Maybe<DaysTime>;
  th?: Maybe<DaysTime>;
  w?: Maybe<DaysTime>;
};

export type AvailabilityInput = {
  f?: InputMaybe<DaysTimeInput>;
  m?: InputMaybe<DaysTimeInput>;
  s?: InputMaybe<DaysTimeInput>;
  sa?: InputMaybe<DaysTimeInput>;
  t?: InputMaybe<DaysTimeInput>;
  th?: InputMaybe<DaysTimeInput>;
  w?: InputMaybe<DaysTimeInput>;
};

export type Booking = {
  __typename?: 'Booking';
  bookingDetails?: Maybe<BookingDetails>;
  bookingReference?: Maybe<Scalars['String']>;
  carRegistration?: Maybe<Scalars['String']>;
  checkInDate?: Maybe<Scalars['DateTime']>;
  checkOutDate?: Maybe<Scalars['DateTime']>;
  clubMemberNumber?: Maybe<Scalars['String']>;
  dateCanceled?: Maybe<Scalars['DateTime']>;
  dateCheckedIn?: Maybe<Scalars['DateTime']>;
  dateCheckedOut?: Maybe<Scalars['DateTime']>;
  dateCreated: Scalars['DateTime'];
  dateReviewed?: Maybe<Scalars['DateTime']>;
  dateSubmitted?: Maybe<Scalars['DateTime']>;
  dateUpdated: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  estimatedTimeOfArrival?: Maybe<Scalars['String']>;
  guest?: Maybe<Guest>;
  id: Scalars['String'];
  numberOfAdults?: Maybe<Scalars['Float']>;
  numberOfChildren?: Maybe<Scalars['Float']>;
  party?: Maybe<Array<BookingParty>>;
  pmsId?: Maybe<Scalars['String']>;
  purposeOfStay?: Maybe<Scalars['String']>;
  roomNumber?: Maybe<Scalars['String']>;
  roomType?: Maybe<Scalars['String']>;
  status: BookingStatus;
};

export type BookingAdultFields = {
  __typename?: 'BookingAdultFields';
  address: Scalars['Boolean'];
  company: Scalars['Boolean'];
  countryOfResidence: Scalars['Boolean'];
  dateOfBirth: Scalars['Boolean'];
  dietaryRequirements: Scalars['Boolean'];
  email: Scalars['Boolean'];
  foreignNationalNextDestination?: Maybe<Scalars['Boolean']>;
  foreignNationalPassportNumber?: Maybe<Scalars['Boolean']>;
  job: Scalars['Boolean'];
  mobile: Scalars['Boolean'];
  name: Scalars['Boolean'];
  nationality: Scalars['Boolean'];
  nextDestination: Scalars['Boolean'];
  passportNumber: Scalars['Boolean'];
};

export type BookingAdultFieldsInput = {
  address: Scalars['Boolean'];
  company: Scalars['Boolean'];
  countryOfResidence: Scalars['Boolean'];
  dateOfBirth: Scalars['Boolean'];
  dietaryRequirements: Scalars['Boolean'];
  email: Scalars['Boolean'];
  foreignNationalNextDestination?: InputMaybe<Scalars['Boolean']>;
  foreignNationalPassportNumber?: InputMaybe<Scalars['Boolean']>;
  job: Scalars['Boolean'];
  mobile: Scalars['Boolean'];
  name: Scalars['Boolean'];
  nationality: Scalars['Boolean'];
  nextDestination: Scalars['Boolean'];
  passportNumber: Scalars['Boolean'];
};

export type BookingAnalyticsResponse = {
  __typename?: 'BookingAnalyticsResponse';
  noArrivals: Scalars['Float'];
  noDepartures: Scalars['Float'];
  noSubmittedBookings: Scalars['Float'];
};

export type BookingArrival = {
  __typename?: 'BookingArrival';
  entryMethods: BookingEntryMethods;
  instructions?: Maybe<BookingInstructions>;
};

export type BookingArrivalInput = {
  entryMethods: BookingEntryMethodsInput;
  instructions?: InputMaybe<BookingInstructionsInput>;
};

export type BookingChildFields = {
  __typename?: 'BookingChildFields';
  address: Scalars['Boolean'];
  countryOfResidence: Scalars['Boolean'];
  dateOfBirth: Scalars['Boolean'];
  dietaryRequirements: Scalars['Boolean'];
  email: Scalars['Boolean'];
  foreignNationalPassportNumber?: Maybe<Scalars['Boolean']>;
  mobile: Scalars['Boolean'];
  name: Scalars['Boolean'];
  nationality: Scalars['Boolean'];
  passportNumber: Scalars['Boolean'];
};

export type BookingChildFieldsInput = {
  address: Scalars['Boolean'];
  countryOfResidence: Scalars['Boolean'];
  dateOfBirth: Scalars['Boolean'];
  dietaryRequirements: Scalars['Boolean'];
  email: Scalars['Boolean'];
  foreignNationalPassportNumber?: InputMaybe<Scalars['Boolean']>;
  mobile: Scalars['Boolean'];
  name: Scalars['Boolean'];
  nationality: Scalars['Boolean'];
  passportNumber: Scalars['Boolean'];
};

export type BookingContactMethods = {
  __typename?: 'BookingContactMethods';
  appMessaging?: Maybe<Scalars['Boolean']>;
  email?: Maybe<Scalars['Boolean']>;
  phoneNumber?: Maybe<Scalars['Boolean']>;
};

export type BookingContactMethodsInput = {
  appMessaging?: InputMaybe<Scalars['Boolean']>;
  email?: InputMaybe<Scalars['Boolean']>;
  phoneNumber?: InputMaybe<Scalars['Boolean']>;
};

export type BookingCustomization = {
  __typename?: 'BookingCustomization';
  checkInReview: BookingCustomizationFields;
  checkInStart: BookingCustomizationFields;
  checkInSuccess: BookingCustomizationFields;
  checkInUnsuccessful: BookingCustomizationFields;
};

export type BookingCustomizationFields = {
  __typename?: 'BookingCustomizationFields';
  message: Scalars['String'];
  title: Scalars['String'];
};

export type BookingCustomizationFieldsInput = {
  message: Scalars['String'];
  title: Scalars['String'];
};

export type BookingCustomizationInput = {
  checkInReview: BookingCustomizationFieldsInput;
  checkInStart: BookingCustomizationFieldsInput;
  checkInSuccess: BookingCustomizationFieldsInput;
  checkInUnsuccessful: BookingCustomizationFieldsInput;
};

export type BookingDeparture = {
  __typename?: 'BookingDeparture';
  notifications: BookingNotifications;
};

export type BookingDepartureInput = {
  notifications: BookingNotificationsInput;
};

export type BookingDetails = {
  __typename?: 'BookingDetails';
  toggleQuestion: Array<BookingToggleQuestion>;
};

export type BookingDetailsInput = {
  toggleQuestion: Array<BookingToggleQuestionInput>;
};

export type BookingEntryMethods = {
  __typename?: 'BookingEntryMethods';
  appKey?: Maybe<Scalars['Boolean']>;
  frontDesk?: Maybe<Scalars['Boolean']>;
};

export type BookingEntryMethodsInput = {
  appKey?: InputMaybe<Scalars['Boolean']>;
  frontDesk?: InputMaybe<Scalars['Boolean']>;
};

export type BookingFields = {
  __typename?: 'BookingFields';
  address: Scalars['Boolean'];
  bookingReference: Scalars['Boolean'];
  clubMemberNumber: Scalars['Boolean'];
  company: Scalars['Boolean'];
  countryOfResidence: Scalars['Boolean'];
  customFields?: Maybe<Array<CustomField>>;
  dateOfBirth: Scalars['Boolean'];
  datesOfStay: Scalars['Boolean'];
  dietaryRequirements: Scalars['Boolean'];
  estimatedTimeOfArrival: Scalars['Boolean'];
  foreignNationalPassportNumber?: Maybe<Scalars['Boolean']>;
  job: Scalars['Boolean'];
  name: Scalars['Boolean'];
  nationality: Scalars['Boolean'];
  numberOfAdults: Scalars['Boolean'];
  numberOfChildren: Scalars['Boolean'];
  party?: Maybe<BookingPartyFields>;
  passportNumber: Scalars['Boolean'];
  passportScan: Scalars['Boolean'];
  purposeOfStay?: Maybe<Scalars['Boolean']>;
  specialOccasions: Scalars['Boolean'];
};

export type BookingFieldsInput = {
  address: Scalars['Boolean'];
  bookingReference: Scalars['Boolean'];
  clubMemberNumber: Scalars['Boolean'];
  company: Scalars['Boolean'];
  countryOfResidence: Scalars['Boolean'];
  customFields?: InputMaybe<Array<CustomFieldInput>>;
  dateOfBirth: Scalars['Boolean'];
  datesOfStay: Scalars['Boolean'];
  dietaryRequirements: Scalars['Boolean'];
  estimatedTimeOfArrival: Scalars['Boolean'];
  foreignNationalPassportNumber?: InputMaybe<Scalars['Boolean']>;
  job: Scalars['Boolean'];
  name: Scalars['Boolean'];
  nationality: Scalars['Boolean'];
  numberOfAdults: Scalars['Boolean'];
  numberOfChildren: Scalars['Boolean'];
  party?: InputMaybe<BookingPartyFieldsInput>;
  passportNumber: Scalars['Boolean'];
  passportScan: Scalars['Boolean'];
  purposeOfStay?: InputMaybe<Scalars['Boolean']>;
  specialOccasions: Scalars['Boolean'];
};

export type BookingInstructions = {
  __typename?: 'BookingInstructions';
  display: BookingInstructionsDisplayType;
  steps?: Maybe<Array<Scalars['String']>>;
};

export enum BookingInstructionsDisplayType {
  Bulleted = 'Bulleted',
  Numbered = 'Numbered'
}

export type BookingInstructionsInput = {
  display: BookingInstructionsDisplayType;
  steps?: InputMaybe<Array<Scalars['String']>>;
};

export type BookingNotifications = {
  __typename?: 'BookingNotifications';
  /** @deprecated  */
  app?: Maybe<Scalars['Boolean']>;
  /** @deprecated  */
  email?: Maybe<Scalars['Boolean']>;
  reminders?: Maybe<Array<BookingReminder>>;
};

export type BookingNotificationsInput = {
  app?: InputMaybe<Scalars['Boolean']>;
  email?: InputMaybe<Scalars['Boolean']>;
  reminders?: InputMaybe<Array<BookingReminderInput>>;
};

export type BookingParty = {
  __typename?: 'BookingParty';
  address?: Maybe<Scalars['String']>;
  ageGroup: AgeGroup;
  carRegistration?: Maybe<Scalars['String']>;
  company?: Maybe<Scalars['String']>;
  countryOfResidence?: Maybe<Scalars['String']>;
  dateOfBirth?: Maybe<Scalars['DateTime']>;
  dietaryRequirements?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  job?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  mobile?: Maybe<Scalars['String']>;
  mobileCountryCode?: Maybe<Scalars['String']>;
  nationality?: Maybe<Scalars['String']>;
  nextDestination?: Maybe<Scalars['String']>;
  passportNumber?: Maybe<Scalars['String']>;
  pmsId?: Maybe<Scalars['String']>;
  /** @deprecated This field has been moved to booking level */
  purposeOfStay?: Maybe<Scalars['String']>;
  specialOccasions?: Maybe<Scalars['String']>;
};

export type BookingPartyFields = {
  __typename?: 'BookingPartyFields';
  adult?: Maybe<BookingAdultFields>;
  child?: Maybe<BookingChildFields>;
};

export type BookingPartyFieldsInput = {
  adult?: InputMaybe<BookingAdultFieldsInput>;
  child?: InputMaybe<BookingChildFieldsInput>;
};

export type BookingPartyInput = {
  address?: InputMaybe<Scalars['String']>;
  ageGroup: AgeGroup;
  carRegistration?: InputMaybe<Scalars['String']>;
  company?: InputMaybe<Scalars['String']>;
  countryOfResidence?: InputMaybe<Scalars['String']>;
  dateOfBirth?: InputMaybe<Scalars['DateTime']>;
  dietaryRequirements?: InputMaybe<Scalars['String']>;
  email?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  job?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  mobile?: InputMaybe<Scalars['String']>;
  mobileCountryCode?: InputMaybe<Scalars['String']>;
  nationality?: InputMaybe<Scalars['String']>;
  nextDestination?: InputMaybe<Scalars['String']>;
  passportNumber?: InputMaybe<Scalars['String']>;
  pmsId?: InputMaybe<Scalars['String']>;
  purposeOfStay?: InputMaybe<Scalars['String']>;
  specialOccasions?: InputMaybe<Scalars['String']>;
};

export type BookingPreArrival = {
  __typename?: 'BookingPreArrival';
  email?: Maybe<Scalars['Boolean']>;
  fields: BookingFields;
  minHoursBeforeCheckIn: Scalars['Float'];
  notifications: BookingNotifications;
  terms?: Maybe<Array<BookingTerm>>;
};

export type BookingPreArrivalInput = {
  email?: InputMaybe<Scalars['Boolean']>;
  fields: BookingFieldsInput;
  minHoursBeforeCheckIn: Scalars['Float'];
  notifications: BookingNotificationsInput;
  terms?: InputMaybe<Array<BookingTermInput>>;
};

export type BookingReminder = {
  __typename?: 'BookingReminder';
  duration: ReminderDurationType;
  value: Scalars['Float'];
};

export type BookingReminderInput = {
  duration: ReminderDurationType;
  value: Scalars['Float'];
};

export type BookingSortInput = {
  dateCreated?: InputMaybe<PaginationSort>;
  id?: InputMaybe<PaginationSort>;
};

export enum BookingStatus {
  Canceled = 'Canceled',
  CheckedIn = 'CheckedIn',
  Created = 'Created',
  Reviewed = 'Reviewed',
  Submitted = 'Submitted'
}

export type BookingTerm = {
  __typename?: 'BookingTerm';
  link?: Maybe<Scalars['String']>;
  message: Scalars['String'];
};

export type BookingTermInput = {
  link?: InputMaybe<Scalars['String']>;
  message: Scalars['String'];
};

export type BookingToggleQuestion = {
  __typename?: 'BookingToggleQuestion';
  result?: Maybe<Scalars['String']>;
  title: Scalars['String'];
  toggle?: Maybe<Scalars['Boolean']>;
  type: CustomFieldType;
};

export type BookingToggleQuestionInput = {
  result?: InputMaybe<Scalars['String']>;
  title: Scalars['String'];
  toggle?: InputMaybe<Scalars['Boolean']>;
  type: CustomFieldType;
};

export type BookingWhereInput = {
  id: Scalars['String'];
};

export type BookingsSettings = {
  __typename?: 'BookingsSettings';
  arrival: BookingArrival;
  checkInTime: Scalars['String'];
  checkOutTime: Scalars['String'];
  contactMethods: BookingContactMethods;
  customization: BookingCustomization;
  departure: BookingDeparture;
  enabled: Scalars['Boolean'];
  maxNumberOfRooms?: Maybe<Scalars['Float']>;
  maxPartySize?: Maybe<Scalars['Float']>;
  preArrival: BookingPreArrival;
};

export type BookingsSettingsInput = {
  arrival: BookingArrivalInput;
  checkInTime: Scalars['String'];
  checkOutTime: Scalars['String'];
  contactMethods: BookingContactMethodsInput;
  customization: BookingCustomizationInput;
  departure: BookingDepartureInput;
  enabled: Scalars['Boolean'];
  maxNumberOfRooms?: InputMaybe<Scalars['Float']>;
  maxPartySize?: InputMaybe<Scalars['Float']>;
  preArrival: BookingPreArrivalInput;
};

export type CardDetails = {
  __typename?: 'CardDetails';
  brand: Scalars['String'];
  country?: Maybe<Scalars['String']>;
  id?: Maybe<Scalars['String']>;
  last4: Scalars['String'];
};

export type CardDetailsInput = {
  brand: Scalars['String'];
  country?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
  last4: Scalars['String'];
};

export type ConnectMarketplaceAppResponse = {
  __typename?: 'ConnectMarketplaceAppResponse';
  redirectURL: Scalars['String'];
};

export type Coordinates = {
  __typename?: 'Coordinates';
  lat: Scalars['Float'];
  lng: Scalars['Float'];
};

export type CreateOrderResponse = {
  __typename?: 'CreateOrderResponse';
  order?: Maybe<Order>;
  paymentIntent?: Maybe<OrderPaymentIntent>;
};

export type CreateSaleResponse = {
  __typename?: 'CreateSaleResponse';
  sale?: Maybe<Sale>;
};

export type CreateStripeAccountResponse = {
  __typename?: 'CreateStripeAccountResponse';
  accountLink: Scalars['String'];
};

export type CustomField = {
  __typename?: 'CustomField';
  title: Scalars['String'];
  type: CustomFieldType;
};

export type CustomFieldInput = {
  title: Scalars['String'];
  type: CustomFieldType;
};

export enum CustomFieldType {
  Boolean = 'Boolean',
  String = 'String'
}

export type CustomLinkWhereInput = {
  id: Scalars['String'];
};

export type Customer = {
  __typename?: 'Customer';
  address: Scalars['String'];
  dateCreated: Scalars['DateTime'];
  dateUpdated: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  firstName: Scalars['String'];
  id: Scalars['String'];
  lastName: Scalars['String'];
  nic: Scalars['String'];
  phone: Scalars['String'];
};

export type CustomerWhereInput = {
  id: Scalars['String'];
};

export type DaysTime = {
  __typename?: 'DaysTime';
  end: Scalars['String'];
  start: Scalars['String'];
};

export type DaysTimeInput = {
  end: Scalars['String'];
  start: Scalars['String'];
};

export type GenerateAttractionPlacesCategoryArgs = {
  name: Scalars['String'];
};

export type GenerateAttractionPlacesCategoryResponse = {
  __typename?: 'GenerateAttractionPlacesCategoryResponse';
  name: Scalars['String'];
};

export type GetAccessTokenResponse = {
  __typename?: 'GetAccessTokenResponse';
  accessToken: Scalars['String'];
  grantLevel: Array<AccessTokenGrantLevel>;
  refreshToken: Scalars['String'];
  ttl: Scalars['Float'];
};

export type GetCustomDomainResponse = {
  __typename?: 'GetCustomDomainResponse';
  clientStatus: Scalars['String'];
  configured: Scalars['Boolean'];
  domain: Scalars['String'];
  id: Scalars['String'];
};

export type GetMarketplaceAppWhereInput = {
  developer?: InputMaybe<Scalars['String']>;
  id?: InputMaybe<Scalars['String']>;
};

export type GetUserLoginTokenResponse = {
  __typename?: 'GetUserLoginTokenResponse';
  loginLink: Scalars['String'];
};

export type GooglePlaceHotelDetailsResponse = {
  __typename?: 'GooglePlaceHotelDetailsResponse';
  coordinates: Coordinates;
  country: Scalars['String'];
  countryCode: Scalars['String'];
  line1: Scalars['String'];
  line2: Scalars['String'];
  name: Scalars['String'];
  placeId: Scalars['String'];
  postalCode: Scalars['String'];
  town: Scalars['String'];
};

export type GooglePlaceHotelSearchResponse = {
  __typename?: 'GooglePlaceHotelSearchResponse';
  description: Scalars['String'];
  placeId: Scalars['String'];
  title: Scalars['String'];
};

export type Group = {
  __typename?: 'Group';
  app?: Maybe<GroupApp>;
  dateCreated: Scalars['DateTime'];
  dateUpdated: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  demo?: Maybe<Scalars['Boolean']>;
  hotelManager?: Maybe<Scalars['Boolean']>;
  hotels: Array<Hotel>;
  id: Scalars['String'];
  integrations?: Maybe<GroupIntegrations>;
  name: Scalars['String'];
  users: Array<User>;
};

export type GroupApp = {
  __typename?: 'GroupApp';
  aggregator?: Maybe<Scalars['Boolean']>;
  assets?: Maybe<HotelAppAssets>;
  disabled?: Maybe<Scalars['Boolean']>;
  disabledReason?: Maybe<Scalars['String']>;
  domain?: Maybe<Scalars['String']>;
  experimental?: Maybe<HotelAppExperimental>;
  /** @deprecated  */
  forceUpdate?: Maybe<Scalars['Boolean']>;
  metadata?: Maybe<HotelAppMetadata>;
  versionCode?: Maybe<Scalars['Float']>;
};

export type GroupAppInput = {
  aggregator?: InputMaybe<Scalars['Boolean']>;
  assets?: InputMaybe<HotelAppAssetsInput>;
  disabled?: InputMaybe<Scalars['Boolean']>;
  disabledReason?: InputMaybe<Scalars['String']>;
  domain?: InputMaybe<Scalars['String']>;
  experimental?: InputMaybe<HotelAppExperimentalInput>;
  forceUpdate?: InputMaybe<Scalars['Boolean']>;
  metadata?: InputMaybe<HotelAppMetadataInput>;
  versionCode?: InputMaybe<Scalars['Float']>;
};

export type GroupIntegrations = {
  __typename?: 'GroupIntegrations';
  apaleo?: Maybe<GroupIntegrationsApaleo>;
  omnivore?: Maybe<GroupIntegrationsOmnivore>;
};

export type GroupIntegrationsApaleo = {
  __typename?: 'GroupIntegrationsApaleo';
  provider: IntegrationProvider;
  refreshToken: Scalars['String'];
  type: IntegrationType;
};

export type GroupIntegrationsApaleoInput = {
  provider: IntegrationProvider;
  refreshToken: Scalars['String'];
  type: IntegrationType;
};

export type GroupIntegrationsInput = {
  apaleo?: InputMaybe<GroupIntegrationsApaleoInput>;
  omnivore?: InputMaybe<GroupIntegrationsOmnivoreInput>;
};

export type GroupIntegrationsOmnivore = {
  __typename?: 'GroupIntegrationsOmnivore';
  apiKey: Scalars['String'];
  type: IntegrationType;
};

export type GroupIntegrationsOmnivoreInput = {
  apiKey: Scalars['String'];
  type: IntegrationType;
};

export type Guest = {
  __typename?: 'Guest';
  address?: Maybe<Scalars['String']>;
  bookings?: Maybe<Array<Booking>>;
  company?: Maybe<Scalars['String']>;
  countryOfResidence?: Maybe<Scalars['String']>;
  dateCreated: Scalars['DateTime'];
  dateLastSeen?: Maybe<Scalars['DateTime']>;
  dateOfBirth?: Maybe<Scalars['DateTime']>;
  dateUpdated: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  deviceId?: Maybe<Scalars['String']>;
  dietaryRequirements?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  groups: Array<Group>;
  hotels: Hotel;
  id: Scalars['String'];
  job?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  mobile?: Maybe<Scalars['String']>;
  mobileCountryCode?: Maybe<Scalars['String']>;
  nationality?: Maybe<Scalars['String']>;
  orders: Array<Order>;
  passportNumber?: Maybe<Scalars['String']>;
  pmsId?: Maybe<Scalars['String']>;
  /** @deprecated  */
  pushNotificationToken?: Maybe<Scalars['String']>;
  pushNotifications: Array<PushNotification>;
  threads: Array<Thread>;
};

export type GuestPaymentMethodsResponse = {
  __typename?: 'GuestPaymentMethodsResponse';
  brand: Scalars['String'];
  country?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  last4: Scalars['String'];
};

export type GuestWhereInput = {
  id: Scalars['String'];
};

export type GuestWithStatistics = {
  __typename?: 'GuestWithStatistics';
  address?: Maybe<Scalars['String']>;
  bookings?: Maybe<Array<Booking>>;
  company?: Maybe<Scalars['String']>;
  countryOfResidence?: Maybe<Scalars['String']>;
  dateCreated: Scalars['DateTime'];
  dateLastSeen?: Maybe<Scalars['DateTime']>;
  dateOfBirth?: Maybe<Scalars['DateTime']>;
  dateUpdated: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  deviceId?: Maybe<Scalars['String']>;
  dietaryRequirements?: Maybe<Scalars['String']>;
  email?: Maybe<Scalars['String']>;
  firstName?: Maybe<Scalars['String']>;
  groups: Array<Group>;
  hotels: Hotel;
  id: Scalars['String'];
  itemsCount: Scalars['Float'];
  job?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  mobile?: Maybe<Scalars['String']>;
  mobileCountryCode?: Maybe<Scalars['String']>;
  nationality?: Maybe<Scalars['String']>;
  orders: Array<Order>;
  ordersCount: Scalars['Float'];
  passportNumber?: Maybe<Scalars['String']>;
  pmsId?: Maybe<Scalars['String']>;
  /** @deprecated  */
  pushNotificationToken?: Maybe<Scalars['String']>;
  pushNotifications: Array<PushNotification>;
  threads: Array<Thread>;
  totalSpend: Scalars['Float'];
};

export type GuestsSortInput = {
  dateCreated?: InputMaybe<PaginationSort>;
  id?: InputMaybe<PaginationSort>;
};

export type HmPayAccount = {
  __typename?: 'HMPayAccount';
  accountNumberLast4: Scalars['String'];
  dateCreated: Scalars['DateTime'];
  payoutSchedule?: Maybe<HmPayAccountPayoutSchedule>;
  sortCode: Scalars['String'];
};

export type HmPayAccountInput = {
  accountNumberLast4: Scalars['String'];
  dateCreated: Scalars['DateTime'];
  payoutSchedule?: InputMaybe<HmPayAccountPayoutScheduleInput>;
  sortCode: Scalars['String'];
};

export type HmPayAccountPayoutSchedule = {
  __typename?: 'HMPayAccountPayoutSchedule';
  date: Scalars['String'];
  interval: PayoutInterval;
};

export type HmPayAccountPayoutScheduleInput = {
  date: Scalars['String'];
  interval: PayoutInterval;
};

export type HmPayAccountResponse = {
  __typename?: 'HMPayAccountResponse';
  accountNumberLast4: Scalars['String'];
  dateCreated: Scalars['DateTime'];
  payoutSchedule?: Maybe<HmPayAccountPayoutSchedule>;
  sortCode: Scalars['String'];
};

export type Hotel = {
  __typename?: 'Hotel';
  address: HotelAddress;
  app?: Maybe<HotelApp>;
  bookingsSettings?: Maybe<BookingsSettings>;
  countryCode: Scalars['String'];
  currencyCode: Scalars['String'];
  customLinks?: Maybe<Array<HotelCustomLink>>;
  dateCreated: Scalars['DateTime'];
  dateUpdated: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  group: Group;
  id: Scalars['String'];
  integrations?: Maybe<HotelIntegrations>;
  messagesSettings?: Maybe<MessagesSettings>;
  name: Scalars['String'];
  payouts?: Maybe<HotelPayouts>;
  pmsSettings?: Maybe<HotelPmsSettings>;
  telephone: Scalars['String'];
  users: Array<User>;
  website: Scalars['String'];
};

export type HotelAddress = {
  __typename?: 'HotelAddress';
  coordinates?: Maybe<Coordinates>;
  country: Scalars['String'];
  line1: Scalars['String'];
  line2: Scalars['String'];
  placeId?: Maybe<Scalars['String']>;
  postalCode: Scalars['String'];
  town: Scalars['String'];
};

export type HotelAddressInput = {
  coordinates?: InputMaybe<AttractionCoordinatesInput>;
  country: Scalars['String'];
  line1: Scalars['String'];
  line2: Scalars['String'];
  placeId?: InputMaybe<Scalars['String']>;
  postalCode: Scalars['String'];
  town: Scalars['String'];
};

export type HotelApp = {
  __typename?: 'HotelApp';
  assets?: Maybe<HotelAppAssets>;
  disabled?: Maybe<Scalars['Boolean']>;
  disabledReason?: Maybe<Scalars['String']>;
  domain?: Maybe<Scalars['String']>;
  experimental?: Maybe<HotelAppExperimental>;
  /** @deprecated  */
  forceUpdate?: Maybe<Scalars['Boolean']>;
  metadata?: Maybe<HotelAppMetadata>;
  versionCode?: Maybe<Scalars['Float']>;
};

export type HotelAppAndroidScreenshots = {
  __typename?: 'HotelAppAndroidScreenshots';
  _1: Scalars['String'];
  _2: Scalars['String'];
  _3: Scalars['String'];
  featureGraphic: Scalars['String'];
};

export type HotelAppAndroidScreenshotsInput = {
  _1: Scalars['String'];
  _2: Scalars['String'];
  _3: Scalars['String'];
  featureGraphic: Scalars['String'];
};

export type HotelAppAssets = {
  __typename?: 'HotelAppAssets';
  featuredImage?: Maybe<Scalars['String']>;
  featuredLogo?: Maybe<Scalars['String']>;
};

export type HotelAppAssetsInput = {
  featuredImage?: InputMaybe<Scalars['String']>;
  featuredLogo?: InputMaybe<Scalars['String']>;
};

export type HotelAppExperimental = {
  __typename?: 'HotelAppExperimental';
  hideProfile?: Maybe<Scalars['Boolean']>;
};

export type HotelAppExperimentalInput = {
  hideProfile?: InputMaybe<Scalars['Boolean']>;
};

export type HotelAppIosScreenshots = {
  __typename?: 'HotelAppIOSScreenshots';
  _1: Scalars['String'];
  _2: Scalars['String'];
  _3: Scalars['String'];
};

export type HotelAppIosScreenshotsInput = {
  _1: Scalars['String'];
  _2: Scalars['String'];
  _3: Scalars['String'];
};

export type HotelAppInput = {
  assets?: InputMaybe<HotelAppAssetsInput>;
  disabled?: InputMaybe<Scalars['Boolean']>;
  disabledReason?: InputMaybe<Scalars['String']>;
  domain?: InputMaybe<Scalars['String']>;
  experimental?: InputMaybe<HotelAppExperimentalInput>;
  forceUpdate?: InputMaybe<Scalars['Boolean']>;
  metadata?: InputMaybe<HotelAppMetadataInput>;
  versionCode?: InputMaybe<Scalars['Float']>;
};

export type HotelAppMetadata = {
  __typename?: 'HotelAppMetadata';
  fullDescription?: Maybe<Scalars['String']>;
  icon?: Maybe<Scalars['String']>;
  ios?: Maybe<HotelAppMetadataIos>;
  keywords?: Maybe<Scalars['String']>;
  screenshots?: Maybe<HotelAppScreenshots>;
  shortDescription?: Maybe<Scalars['String']>;
  subtitle?: Maybe<Scalars['String']>;
  title?: Maybe<Scalars['String']>;
};

export type HotelAppMetadataIos = {
  __typename?: 'HotelAppMetadataIOS';
  appStoreId: Scalars['String'];
};

export type HotelAppMetadataIosInput = {
  appStoreId: Scalars['String'];
};

export type HotelAppMetadataInput = {
  fullDescription?: InputMaybe<Scalars['String']>;
  icon?: InputMaybe<Scalars['String']>;
  ios?: InputMaybe<HotelAppMetadataIosInput>;
  keywords?: InputMaybe<Scalars['String']>;
  screenshots?: InputMaybe<HotelAppScreenshotsInput>;
  shortDescription?: InputMaybe<Scalars['String']>;
  subtitle?: InputMaybe<Scalars['String']>;
  title?: InputMaybe<Scalars['String']>;
};

export type HotelAppScreenshots = {
  __typename?: 'HotelAppScreenshots';
  android: HotelAppAndroidScreenshots;
  ios: HotelAppIosScreenshots;
  ios55: HotelAppIosScreenshots;
};

export type HotelAppScreenshotsInput = {
  android: HotelAppAndroidScreenshotsInput;
  ios: HotelAppIosScreenshotsInput;
  ios55: HotelAppIosScreenshotsInput;
};

export type HotelCustomLink = {
  __typename?: 'HotelCustomLink';
  enabled: Scalars['Boolean'];
  id: Scalars['String'];
  link: Scalars['String'];
  name: Scalars['String'];
  photo?: Maybe<Scalars['String']>;
};

export type HotelCustomLinkInput = {
  enabled: Scalars['Boolean'];
  id: Scalars['String'];
  link: Scalars['String'];
  name: Scalars['String'];
  photo?: InputMaybe<Scalars['String']>;
};

export type HotelIntegrations = {
  __typename?: 'HotelIntegrations';
  marketplaceApps?: Maybe<Array<HotelMarketplaceApp>>;
  mews?: Maybe<HotelIntegrationsMews>;
};

export type HotelIntegrationsInput = {
  marketplaceApps?: InputMaybe<Array<HotelMarketplaceAppInput>>;
  mews?: InputMaybe<HotelIntegrationsMewsInput>;
};

export type HotelIntegrationsMews = {
  __typename?: 'HotelIntegrationsMews';
  accessToken: Scalars['String'];
  clientToken: Scalars['String'];
  provider: Scalars['String'];
  type: IntegrationType;
};

export type HotelIntegrationsMewsInput = {
  accessToken: Scalars['String'];
  clientToken: Scalars['String'];
  provider: Scalars['String'];
  type: IntegrationType;
};

export type HotelMarketplaceApp = {
  __typename?: 'HotelMarketplaceApp';
  id: Scalars['String'];
  name: Scalars['String'];
  type: Scalars['String'];
};

export type HotelMarketplaceAppInput = {
  id: Scalars['String'];
  name: Scalars['String'];
  type: Scalars['String'];
};

export type HotelMarketplaceAppSubscription = {
  __typename?: 'HotelMarketplaceAppSubscription';
  endpoint: Scalars['String'];
  id: Scalars['String'];
  topics: Array<HotelMarketplaceAppSubscriptionTopic>;
};

export type HotelMarketplaceAppSubscriptionInput = {
  endpoint: Scalars['String'];
  id: Scalars['String'];
  topics: Array<HotelMarketplaceAppSubscriptionTopic>;
};

export enum HotelMarketplaceAppSubscriptionTopic {
  Booking = 'Booking',
  Order = 'Order',
  Space = 'Space'
}

export type HotelPmsMewsSettings = {
  __typename?: 'HotelPMSMewsSettings';
  bookableServiceId: Scalars['String'];
  orderableServiceId: Scalars['String'];
};

export type HotelPmsMewsSettingsInput = {
  bookableServiceId: Scalars['String'];
  orderableServiceId: Scalars['String'];
};

export type HotelPmsSettings = {
  __typename?: 'HotelPMSSettings';
  mewsSettings?: Maybe<HotelPmsMewsSettings>;
  pmsId?: Maybe<Scalars['String']>;
};

export type HotelPmsSettingsInput = {
  mewsSettings?: InputMaybe<HotelPmsMewsSettingsInput>;
  pmsId?: InputMaybe<Scalars['String']>;
};

export type HotelPayouts = {
  __typename?: 'HotelPayouts';
  enabled?: Maybe<PayoutsStrategy>;
  hm?: Maybe<HmPayAccount>;
  stripe?: Maybe<StripeAccount>;
};

export type HotelPayoutsInput = {
  enabled?: InputMaybe<PayoutsStrategy>;
  hm?: InputMaybe<HmPayAccountInput>;
  stripe?: InputMaybe<StripeAccountInput>;
};

export enum IntegrationProvider {
  Agilysys = 'Agilysys',
  Apaleo = 'Apaleo',
  ClockPms = 'Clock PMS',
  Dinerware = 'Dinerware',
  FocusPos = 'Focus Pos',
  Guestline = 'Guestline',
  MaitreD = 'Maitre D',
  Mews = 'Mews',
  Micros3700 = 'Micros 3700',
  MicrosSimphony = 'Micros Simphony',
  MicrosSimphonyFirstEdition = 'Micros Simphony First Edition',
  NcrAloha = 'NCR Aloha',
  OmnivoreVirtualPos = 'Omnivore Virtual POS',
  Opera = 'Opera',
  PosItouch = 'POSitouch',
  Protel = 'Protel',
  Rms = 'RMS',
  RoomKeyPms = 'Room Key PMS',
  Squirrel = 'Squirrel',
  WebRezPro = 'WebRezPro',
  Xpient = 'Xpient'
}

export enum IntegrationType {
  Pms = 'PMS',
  Pos = 'POS'
}

export type InviteUserHotelInput = {
  id: Scalars['String'];
  role: Scalars['String'];
};

export type MarketplaceApp = {
  __typename?: 'MarketplaceApp';
  connectLink: Scalars['String'];
  dateCreated: Scalars['DateTime'];
  dateUpdated: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  description: Scalars['String'];
  developer: User;
  documentationURL: Scalars['String'];
  enabled: Scalars['Boolean'];
  helpURL: Scalars['String'];
  id: Scalars['String'];
  live: Scalars['Boolean'];
  logo: Scalars['String'];
  name: Scalars['String'];
  redirectURLs: Array<Scalars['String']>;
  type: IntegrationType;
  websiteURL: Scalars['String'];
};

export type MarketplaceAppSubscriptionWhereInput = {
  id: Scalars['String'];
};

export type MarketplaceAppWhereInput = {
  id: Scalars['String'];
};

export type Message = {
  __typename?: 'Message';
  author: MessageAuthor;
  dateCreated: Scalars['DateTime'];
  dateUpdated: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  guest: Guest;
  id: Scalars['String'];
  text: Scalars['String'];
  thread: Thread;
  user: User;
};

export enum MessageAuthor {
  Guest = 'Guest',
  User = 'User'
}

export type MessagesAwayMessage = {
  __typename?: 'MessagesAwayMessage';
  message?: Maybe<Scalars['String']>;
  showTime: Scalars['Boolean'];
};

export type MessagesAwayMessageInput = {
  message?: InputMaybe<Scalars['String']>;
  showTime: Scalars['Boolean'];
};

export type MessagesSettings = {
  __typename?: 'MessagesSettings';
  availability?: Maybe<Availability>;
  awayMessage?: Maybe<MessagesAwayMessage>;
  checkedInOnly?: Maybe<Scalars['Boolean']>;
  enabled?: Maybe<Scalars['Boolean']>;
  hideResolvedChats?: Maybe<Scalars['Boolean']>;
};

export type MessagesSettingsInput = {
  availability?: InputMaybe<AvailabilityInput>;
  awayMessage?: InputMaybe<MessagesAwayMessageInput>;
  checkedInOnly?: InputMaybe<Scalars['Boolean']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  hideResolvedChats?: InputMaybe<Scalars['Boolean']>;
};

export type MewsServiceResponse = {
  __typename?: 'MewsServiceResponse';
  id: Scalars['String'];
  name: Scalars['String'];
  type: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  addCustomDomain: Scalars['Boolean'];
  addCustomLink: HotelCustomLink;
  anonGuestLogin: Guest;
  authorizeApaleo: Scalars['Boolean'];
  authorizeMews: Scalars['Boolean'];
  authorizeOmnivore: Scalars['Boolean'];
  connectMarketplaceApp: ConnectMarketplaceAppResponse;
  createAttraction: Attraction;
  createBooking?: Maybe<Booking>;
  createCustomer: Customer;
  createGuestPaymentMethod: Scalars['Boolean'];
  createHMPayAccount: HmPayAccountResponse;
  createMarketplaceApp: MarketplaceApp;
  createMarketplaceAppSubscription: HotelMarketplaceAppSubscription;
  createOrder: CreateOrderResponse;
  createPricelist: Pricelist;
  createProduct: Product;
  createSale: CreateSaleResponse;
  createSpace: Space;
  createStripeAccount: CreateStripeAccountResponse;
  deleteAttraction: Scalars['Boolean'];
  deleteCustomDomain: Scalars['Boolean'];
  deleteCustomLink: Scalars['Boolean'];
  deleteCustomer: Scalars['Boolean'];
  deleteGuest: Scalars['Boolean'];
  deleteGuestPaymentMethod: Scalars['Boolean'];
  deleteMarketplaceApp: Scalars['Boolean'];
  deleteMarketplaceAppSubscription: Scalars['Boolean'];
  deleteMarketplaceAppSubscriptions: Scalars['Boolean'];
  deletePricelist: Scalars['Boolean'];
  deletePricelists: Scalars['Boolean'];
  deleteProduct: Scalars['Boolean'];
  deleteProducts: Scalars['Boolean'];
  deleteSpace: Scalars['Boolean'];
  deleteSpaces: Scalars['Boolean'];
  deleteUser: Scalars['Boolean'];
  disableHotelPayouts: HotelPayouts;
  disconnectApaleo: Scalars['Boolean'];
  disconnectMarketplaceApp: Scalars['Boolean'];
  disconnectMews: Scalars['Boolean'];
  disconnectOmnivore: Scalars['Boolean'];
  enableHotelPayouts: HotelPayouts;
  generateAttractionPlaces: Scalars['Boolean'];
  generateMarketplaceAppKey: Scalars['String'];
  guestLogin: Guest;
  guestLogout: Scalars['Boolean'];
  guestTokenLogin: Guest;
  inviteHotelUser: Scalars['Boolean'];
  linkStripeAccount: Scalars['Boolean'];
  registerGroupAdmin: RegisterGroupAdminResponse;
  registerGuest: RegisterGuestResponse;
  registerHotelUser: RegisterHotelUserResponse;
  resolveThread: Thread;
  resyncPOS: Scalars['Boolean'];
  sendGuestToken: Scalars['Boolean'];
  sendUserToken: Scalars['Boolean'];
  settleOrders: Scalars['Boolean'];
  subscribeGuestPushNotifications: Guest;
  subscribeUserPushNotifications: User;
  unsubscribeUserPushNotifications: User;
  updateAttraction: Attraction;
  updateBooking: Booking;
  updateCustomLink: HotelCustomLink;
  updateCustomer: Customer;
  updateGuest: Guest;
  updateHMPayExternalAccount: HmPayAccountResponse;
  updateHotel: Hotel;
  updateMarketplaceApp: MarketplaceApp;
  updateMarketplaceAppSubscription: HotelMarketplaceAppSubscription;
  updateOrder: Order;
  updatePricelist: Pricelist;
  updateProduct: Product;
  updateSale: Sale;
  updateSpace: Space;
  updateStripeExternalAccount: Scalars['Boolean'];
  updateThread: Thread;
  updateUser: User;
  uploadAppAsset: Scalars['Boolean'];
  userLogin: User;
  userLogout: Scalars['Boolean'];
  userTokenLogin: User;
};


export type MutationAddCustomDomainArgs = {
  domain: Scalars['String'];
};


export type MutationAddCustomLinkArgs = {
  enabled: Scalars['Boolean'];
  id: Scalars['String'];
  link: Scalars['String'];
  name: Scalars['String'];
  photo?: InputMaybe<Scalars['String']>;
};


export type MutationAnonGuestLoginArgs = {
  deviceId: Scalars['String'];
};


export type MutationAuthorizeApaleoArgs = {
  code: Scalars['String'];
};


export type MutationAuthorizeMewsArgs = {
  accessToken: Scalars['String'];
  clientToken: Scalars['String'];
};


export type MutationAuthorizeOmnivoreArgs = {
  apiKey: Scalars['String'];
};


export type MutationConnectMarketplaceAppArgs = {
  id: Scalars['String'];
  redirectURL: Scalars['String'];
};


export type MutationCreateAttractionArgs = {
  catalog?: InputMaybe<AttractionCatalogInput>;
  description?: InputMaybe<Scalars['String']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
};


export type MutationCreateBookingArgs = {
  bookingDetails?: InputMaybe<BookingDetailsInput>;
  bookingReference?: InputMaybe<Scalars['String']>;
  carRegistration?: InputMaybe<Scalars['String']>;
  checkInDate?: InputMaybe<Scalars['DateTime']>;
  checkOutDate?: InputMaybe<Scalars['DateTime']>;
  clubMemberNumber?: InputMaybe<Scalars['String']>;
  dateCheckedIn?: InputMaybe<Scalars['DateTime']>;
  dateReviewed?: InputMaybe<Scalars['DateTime']>;
  dateSubmitted?: InputMaybe<Scalars['DateTime']>;
  estimatedTimeOfArrival?: InputMaybe<Scalars['String']>;
  guestId?: InputMaybe<Scalars['String']>;
  numberOfAdults?: InputMaybe<Scalars['Float']>;
  numberOfChildren?: InputMaybe<Scalars['Float']>;
  party?: InputMaybe<Array<BookingPartyInput>>;
  roomNumber?: InputMaybe<Scalars['String']>;
  roomType?: InputMaybe<Scalars['String']>;
};


export type MutationCreateCustomerArgs = {
  address: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  nic: Scalars['String'];
  phone: Scalars['String'];
};


export type MutationCreateGuestPaymentMethodArgs = {
  name: Scalars['String'];
  token: Scalars['String'];
};


export type MutationCreateHmPayAccountArgs = {
  accountNumber: Scalars['String'];
  sortCode: Scalars['String'];
};


export type MutationCreateMarketplaceAppArgs = {
  connectLink: Scalars['String'];
  description: Scalars['String'];
  documentationURL: Scalars['String'];
  enabled: Scalars['Boolean'];
  helpURL: Scalars['String'];
  live: Scalars['Boolean'];
  logo: Scalars['String'];
  name: Scalars['String'];
  redirectURLs: Array<Scalars['String']>;
  type: IntegrationType;
  websiteURL: Scalars['String'];
};


export type MutationCreateMarketplaceAppSubscriptionArgs = {
  endpoint: Scalars['String'];
  topics: Array<HotelMarketplaceAppSubscriptionTopic>;
};


export type MutationCreateOrderArgs = {
  cardDetails?: InputMaybe<CardDetailsInput>;
  collection?: InputMaybe<PricelistCollectionType>;
  dateApproved?: InputMaybe<Scalars['DateTime']>;
  dateCompleted?: InputMaybe<Scalars['DateTime']>;
  dateReady?: InputMaybe<Scalars['DateTime']>;
  dateScheduled?: InputMaybe<Scalars['DateTime']>;
  delivery?: InputMaybe<PricelistDeliveryType>;
  discount?: InputMaybe<PriceMultiplierInput>;
  guestId?: InputMaybe<Scalars['String']>;
  items: Array<OrderItemInput>;
  notes?: InputMaybe<Scalars['String']>;
  orderReference?: InputMaybe<Scalars['String']>;
  paymentIntentId?: InputMaybe<Scalars['String']>;
  paymentProvider?: InputMaybe<PayoutsStrategy>;
  paymentType: PaymentType;
  pricelistId: Scalars['String'];
  roomNumber: Scalars['String'];
  subtotal: Scalars['Float'];
  surcharges?: InputMaybe<Array<PriceMultiplierInput>>;
  totalPrice: Scalars['Float'];
};


export type MutationCreatePricelistArgs = {
  autoApprove?: InputMaybe<Scalars['Boolean']>;
  availability: AvailabilityInput;
  catalog?: InputMaybe<PricelistCatalogInput>;
  collection?: InputMaybe<Array<PricelistCollectionInput>>;
  commerce?: InputMaybe<Scalars['Boolean']>;
  delivery?: InputMaybe<Array<PricelistDeliveryInput>>;
  description?: InputMaybe<Scalars['String']>;
  enabledPayments?: InputMaybe<PricelistEnabledPaymentsInput>;
  feedback?: InputMaybe<Scalars['Boolean']>;
  name: Scalars['String'];
  posSettings?: InputMaybe<PricelistPosSettingsInput>;
  promotions?: InputMaybe<PricelistPromotionsInput>;
  spaceId: Scalars['String'];
  surcharges?: InputMaybe<Array<PricelistSurchargeInput>>;
};


export type MutationCreateProductArgs = {
  code: Scalars['String'];
  costPrice: Scalars['Float'];
  name: Scalars['String'];
  sellPrice: Scalars['Float'];
  stock: Scalars['Float'];
};


export type MutationCreateSaleArgs = {
  customerNIC: Scalars['String'];
  instalmentPlan: SaleInstalmentPlanInput;
  items: Array<SaleItemInput>;
  salesReference?: InputMaybe<Scalars['String']>;
  subtotal: Scalars['Float'];
  totalPrice: Scalars['Float'];
};


export type MutationCreateSpaceArgs = {
  availability: AvailabilityInput;
  enabled?: InputMaybe<Scalars['Boolean']>;
  location: Scalars['String'];
  name: Scalars['String'];
};


export type MutationDeleteCustomLinkArgs = {
  where: WhereInputType;
};


export type MutationDeleteCustomerArgs = {
  where: WhereInputType;
};


export type MutationDeleteGuestPaymentMethodArgs = {
  paymentMethodId: Scalars['String'];
};


export type MutationDeleteMarketplaceAppArgs = {
  where: WhereInputType;
};


export type MutationDeleteMarketplaceAppSubscriptionArgs = {
  where: WhereInputType;
};


export type MutationDeletePricelistArgs = {
  where: WhereInputType;
};


export type MutationDeletePricelistsArgs = {
  where: Array<WhereInputType>;
};


export type MutationDeleteProductArgs = {
  where: WhereInputType;
};


export type MutationDeleteProductsArgs = {
  where: Array<WhereInputType>;
};


export type MutationDeleteSpaceArgs = {
  where: WhereInputType;
};


export type MutationDeleteSpacesArgs = {
  where: Array<WhereInputType>;
};


export type MutationDeleteUserArgs = {
  where: WhereInputType;
};


export type MutationDisconnectMarketplaceAppArgs = {
  id?: InputMaybe<Scalars['String']>;
};


export type MutationEnableHotelPayoutsArgs = {
  payoutsStrategy: PayoutsStrategy;
};


export type MutationGenerateAttractionPlacesArgs = {
  categories: Array<GenerateAttractionPlacesCategoryArgs>;
  radius: Scalars['Float'];
  requestBooking: Scalars['Boolean'];
};


export type MutationGuestLoginArgs = {
  deviceId: Scalars['String'];
  email: Scalars['String'];
  verificationToken: Scalars['String'];
};


export type MutationInviteHotelUserArgs = {
  email: Scalars['String'];
  groupAdmin?: InputMaybe<Scalars['Boolean']>;
  hotels?: InputMaybe<Array<InviteUserHotelInput>>;
};


export type MutationLinkStripeAccountArgs = {
  authCode: Scalars['String'];
};


export type MutationRegisterGroupAdminArgs = {
  group?: InputMaybe<RegisterGroupAdminGroupInput>;
  hotel: RegisterGroupAdminHotelInput;
  termsAndConditions: Scalars['Boolean'];
  user: RegisterGroupAdminUserInput;
};


export type MutationRegisterGuestArgs = {
  countryCode?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  mobile?: InputMaybe<Scalars['String']>;
};


export type MutationRegisterHotelUserArgs = {
  firstName: Scalars['String'];
  id: Scalars['String'];
  lastName: Scalars['String'];
  mobile: Scalars['String'];
  termsAndConditions: Scalars['Boolean'];
};


export type MutationResolveThreadArgs = {
  where: WhereInputType;
};


export type MutationSendGuestTokenArgs = {
  deviceId: Scalars['String'];
  email: Scalars['String'];
};


export type MutationSendUserTokenArgs = {
  email: Scalars['String'];
  verificationTokenOnly?: InputMaybe<Scalars['Boolean']>;
};


export type MutationSettleOrdersArgs = {
  guestId?: InputMaybe<Scalars['String']>;
  orderId?: InputMaybe<Scalars['String']>;
  paymentType?: InputMaybe<PaymentType>;
};


export type MutationSubscribeGuestPushNotificationsArgs = {
  pushNotificationToken: Scalars['String'];
};


export type MutationSubscribeUserPushNotificationsArgs = {
  deviceId: Scalars['String'];
  pushSubscription: WebPushSubscriptionInput;
  sound?: InputMaybe<Scalars['Boolean']>;
};


export type MutationUnsubscribeUserPushNotificationsArgs = {
  deviceId: Scalars['String'];
};


export type MutationUpdateAttractionArgs = {
  data: UpdateAttractionInput;
};


export type MutationUpdateBookingArgs = {
  data: UpdateBookingInput;
  where: BookingWhereInput;
};


export type MutationUpdateCustomLinkArgs = {
  data: UpdateCustomLinkInput;
  where: CustomLinkWhereInput;
};


export type MutationUpdateCustomerArgs = {
  data: UpdateCustomerInput;
  where: CustomerWhereInput;
};


export type MutationUpdateGuestArgs = {
  data: UpdateGuestInput;
  where?: InputMaybe<GuestWhereInput>;
};


export type MutationUpdateHmPayExternalAccountArgs = {
  accountNumber: Scalars['String'];
  payoutSchedule: HmPayAccountPayoutScheduleInput;
  sortCode: Scalars['String'];
};


export type MutationUpdateHotelArgs = {
  data: UpdateHotelInput;
};


export type MutationUpdateMarketplaceAppArgs = {
  data: UpdateMarketplaceAppInput;
  where: MarketplaceAppWhereInput;
};


export type MutationUpdateMarketplaceAppSubscriptionArgs = {
  data: UpdateMarketplaceAppSubscriptionInput;
  where: MarketplaceAppSubscriptionWhereInput;
};


export type MutationUpdateOrderArgs = {
  data: UpdateOrderInput;
  where: OrderWhereInput;
};


export type MutationUpdatePricelistArgs = {
  data: UpdatePricelistInput;
  where: PricelistWhereInput;
};


export type MutationUpdateProductArgs = {
  data: UpdateProductInput;
  where: ProductWhereInput;
};


export type MutationUpdateSaleArgs = {
  data: UpdateSaleInput;
  where: SaleWhereInput;
};


export type MutationUpdateSpaceArgs = {
  data: UpdateSpaceInput;
  where: SpaceWhereInput;
};


export type MutationUpdateStripeExternalAccountArgs = {
  accountNumber: Scalars['String'];
  payoutSchedule: StripeExternalAccountPayoutScheduleInput;
  sortCode: Scalars['String'];
};


export type MutationUpdateThreadArgs = {
  data: UpdateThreadInput;
  where: ThreadWhereInput;
};


export type MutationUpdateUserArgs = {
  data: UpdateUserInput;
  where?: InputMaybe<UserWhereInput>;
};


export type MutationUploadAppAssetArgs = {
  file: Scalars['Upload'];
};


export type MutationUserTokenLoginArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type OmnivoreDiscountsResponse = {
  __typename?: 'OmnivoreDiscountsResponse';
  available?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  item?: Maybe<Scalars['Boolean']>;
  maxAmount?: Maybe<Scalars['Float']>;
  maxPercent?: Maybe<Scalars['Float']>;
  minAmount?: Maybe<Scalars['Float']>;
  minOrderAmount?: Maybe<Scalars['Float']>;
  minPercent?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  open?: Maybe<Scalars['Boolean']>;
  order?: Maybe<Scalars['Boolean']>;
  posId?: Maybe<Scalars['String']>;
  type: PricelistMultiplierType;
  value: Scalars['Float'];
};

export type OmnivoreLocationsResponse = {
  __typename?: 'OmnivoreLocationsResponse';
  id: Scalars['String'];
  provider: Scalars['String'];
};

export type OmnivoreOption = {
  __typename?: 'OmnivoreOption';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type OmnivoreOptionsResponse = {
  __typename?: 'OmnivoreOptionsResponse';
  employees: Array<OmnivoreOption>;
  orderTypes: Array<OmnivoreOption>;
  revenueCenters: Array<OmnivoreOption>;
};

export type Order = {
  __typename?: 'Order';
  cardDetails?: Maybe<CardDetails>;
  collection?: Maybe<PricelistCollectionType>;
  dateApproved?: Maybe<Scalars['DateTime']>;
  dateCompleted?: Maybe<Scalars['DateTime']>;
  dateCreated: Scalars['DateTime'];
  dateReady?: Maybe<Scalars['DateTime']>;
  dateScheduled?: Maybe<Scalars['DateTime']>;
  dateUpdated: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  delivery?: Maybe<PricelistDeliveryType>;
  discount?: Maybe<PriceMultiplier>;
  feedback?: Maybe<OrderFeedback>;
  guest: Guest;
  id: Scalars['String'];
  items: Array<OrderItem>;
  notes?: Maybe<Scalars['String']>;
  orderReference?: Maybe<Scalars['String']>;
  paid?: Maybe<Scalars['Boolean']>;
  paymentIntentId?: Maybe<Scalars['String']>;
  paymentProvider?: Maybe<PayoutsStrategy>;
  paymentType: PaymentType;
  posId?: Maybe<Scalars['String']>;
  pricelist: Pricelist;
  reasonRejected?: Maybe<Scalars['String']>;
  rejected?: Maybe<Scalars['Boolean']>;
  roomNumber: Scalars['String'];
  space: Space;
  status: OrderStatus;
  subtotal: Scalars['Float'];
  surcharges?: Maybe<Array<PriceMultiplier>>;
  thread?: Maybe<Thread>;
  totalPrice: Scalars['Float'];
};

export type OrderFeedback = {
  __typename?: 'OrderFeedback';
  rating?: Maybe<Scalars['Float']>;
};

export type OrderFeedbackInput = {
  rating?: InputMaybe<Scalars['Float']>;
};

export type OrderItem = {
  __typename?: 'OrderItem';
  discount?: Maybe<PriceMultiplier>;
  id: Scalars['String'];
  modifiers: Array<OrderItemModifier>;
  name: Scalars['String'];
  omnivoreSettings?: Maybe<OrderItemPosSettings>;
  posId?: Maybe<Scalars['String']>;
  posSettings?: Maybe<PricelistPosSettingsFulfilment>;
  quantity: Scalars['Float'];
  regularPrice?: Maybe<Scalars['Float']>;
  roomServicePrice?: Maybe<Scalars['Float']>;
  totalPrice: Scalars['Float'];
};

export type OrderItemInput = {
  discount?: InputMaybe<PriceMultiplierInput>;
  id: Scalars['String'];
  modifiers: Array<OrderItemModifierInput>;
  name: Scalars['String'];
  omnivoreSettings?: InputMaybe<OrderItemPosSettingsInput>;
  posId?: InputMaybe<Scalars['String']>;
  posSettings?: InputMaybe<PricelistPosSettingsFulfilmentInput>;
  quantity: Scalars['Float'];
  regularPrice?: InputMaybe<Scalars['Float']>;
  roomServicePrice?: InputMaybe<Scalars['Float']>;
  totalPrice: Scalars['Float'];
};

export type OrderItemModifier = {
  __typename?: 'OrderItemModifier';
  id: Scalars['String'];
  name: Scalars['String'];
  options: Array<OrderItemOption>;
  posId?: Maybe<Scalars['String']>;
};

export type OrderItemModifierInput = {
  id: Scalars['String'];
  name: Scalars['String'];
  options: Array<OrderItemOptionInput>;
  posId?: InputMaybe<Scalars['String']>;
};

export type OrderItemOption = {
  __typename?: 'OrderItemOption';
  id: Scalars['String'];
  name: Scalars['String'];
  posId?: Maybe<Scalars['String']>;
  price: Scalars['Float'];
};

export type OrderItemOptionInput = {
  id: Scalars['String'];
  name: Scalars['String'];
  posId?: InputMaybe<Scalars['String']>;
  price: Scalars['Float'];
};

export type OrderItemPosSettings = {
  __typename?: 'OrderItemPOSSettings';
  roomService?: Maybe<PricelistItemPosPriceLevel>;
  tableService?: Maybe<PricelistItemPosPriceLevel>;
};

export type OrderItemPosSettingsInput = {
  roomService?: InputMaybe<PricelistItemPosPriceLevelInput>;
  tableService?: InputMaybe<PricelistItemPosPriceLevelInput>;
};

export type OrderPaymentIntent = {
  __typename?: 'OrderPaymentIntent';
  clientSecret?: Maybe<Scalars['String']>;
  status: PaymentIntentStatus;
};

export enum OrderStatus {
  Approved = 'Approved',
  Canceled = 'Canceled',
  Completed = 'Completed',
  Ready = 'Ready',
  Rejected = 'Rejected',
  Waiting = 'Waiting'
}

export type OrderWhereInput = {
  id: Scalars['String'];
};

export type OrdersSortInput = {
  dateCreated?: InputMaybe<PaginationSort>;
  id?: InputMaybe<PaginationSort>;
};

export type OutstandingGuest = {
  __typename?: 'OutstandingGuest';
  guest: Guest;
  noOrders: Scalars['Float'];
  totalPrice: Scalars['Float'];
};

export type OutstandingGuestsResponse = {
  __typename?: 'OutstandingGuestsResponse';
  count: Scalars['Float'];
  data: Array<OutstandingGuest>;
};

export type OutstandingOrdersStatistics = {
  __typename?: 'OutstandingOrdersStatistics';
  noGuests: Scalars['Float'];
  noOrders: Scalars['Float'];
  paymentType: PaymentType;
  totalPrice: Scalars['Float'];
};

export type OutstandingOrdersStatisticsResponse = {
  __typename?: 'OutstandingOrdersStatisticsResponse';
  cash: OutstandingOrdersStatistics;
  roomBill: OutstandingOrdersStatistics;
};

export enum PaginationSort {
  Asc = 'Asc',
  Desc = 'Desc'
}

export enum PaymentIntentStatus {
  Canceled = 'Canceled',
  Processing = 'Processing',
  RequiresAction = 'RequiresAction',
  RequiresCapture = 'RequiresCapture',
  RequiresConfirmation = 'RequiresConfirmation',
  RequiresPaymentMethod = 'RequiresPaymentMethod',
  Succeeded = 'Succeeded'
}

export enum PaymentType {
  Card = 'Card',
  Cash = 'Cash',
  None = 'None',
  RoomBill = 'RoomBill'
}

export enum PayoutInterval {
  Daily = 'Daily',
  Monthly = 'Monthly',
  Weekly = 'Weekly'
}

export type PayoutValueResponse = {
  __typename?: 'PayoutValueResponse';
  arrivalDate?: Maybe<Scalars['DateTime']>;
  totalPrice: Scalars['Float'];
};

export enum PayoutsStrategy {
  Disabled = 'Disabled',
  HotelManagerPay = 'HotelManagerPay',
  Stripe = 'Stripe'
}

export type PriceMultiplier = {
  __typename?: 'PriceMultiplier';
  id: Scalars['String'];
  name: Scalars['String'];
  posId?: Maybe<Scalars['String']>;
  type: PricelistMultiplierType;
  value: Scalars['Float'];
};

export type PriceMultiplierInput = {
  id: Scalars['String'];
  name: Scalars['String'];
  posId?: InputMaybe<Scalars['String']>;
  type: PricelistMultiplierType;
  value: Scalars['Float'];
};

export type Pricelist = {
  __typename?: 'Pricelist';
  autoApprove?: Maybe<Scalars['Boolean']>;
  availability: Availability;
  catalog?: Maybe<PricelistCatalog>;
  collection?: Maybe<Array<PricelistCollection>>;
  commerce?: Maybe<Scalars['Boolean']>;
  dateCreated: Scalars['DateTime'];
  dateUpdated: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  delivery?: Maybe<Array<PricelistDelivery>>;
  description?: Maybe<Scalars['String']>;
  enabledPayments?: Maybe<PricelistEnabledPayments>;
  feedback?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  name: Scalars['String'];
  posId?: Maybe<Scalars['String']>;
  posSettings?: Maybe<PricelistPosSettings>;
  promotions?: Maybe<PricelistPromotions>;
  space: Space;
  surcharges?: Maybe<Array<PricelistSurcharge>>;
};

export type PricelistCatalog = {
  __typename?: 'PricelistCatalog';
  categories: Array<PricelistCategory>;
  labels?: Maybe<Array<PricelistLabel>>;
};

export type PricelistCatalogInput = {
  categories: Array<PricelistCategoryInput>;
  labels?: InputMaybe<Array<PricelistLabelInput>>;
};

export type PricelistCategory = {
  __typename?: 'PricelistCategory';
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  items: Array<PricelistItem>;
  name: Scalars['String'];
  posId?: Maybe<Scalars['String']>;
};

export type PricelistCategoryInput = {
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  items: Array<PricelistItemInput>;
  name: Scalars['String'];
  posId?: InputMaybe<Scalars['String']>;
};

export type PricelistCollection = {
  __typename?: 'PricelistCollection';
  enabled?: Maybe<Scalars['Boolean']>;
  type: PricelistCollectionType;
};

export type PricelistCollectionInput = {
  enabled?: InputMaybe<Scalars['Boolean']>;
  type: PricelistCollectionType;
};

export enum PricelistCollectionType {
  Other = 'Other'
}

export type PricelistDelivery = {
  __typename?: 'PricelistDelivery';
  enabled?: Maybe<Scalars['Boolean']>;
  type: PricelistDeliveryType;
};

export type PricelistDeliveryInput = {
  enabled?: InputMaybe<Scalars['Boolean']>;
  type: PricelistDeliveryType;
};

export enum PricelistDeliveryType {
  Other = 'Other',
  Room = 'Room',
  Table = 'Table'
}

export type PricelistDiscount = {
  __typename?: 'PricelistDiscount';
  available?: Maybe<Scalars['Boolean']>;
  collection?: Maybe<Array<PricelistCollection>>;
  count?: Maybe<Scalars['Float']>;
  delivery?: Maybe<Array<PricelistDelivery>>;
  id: Scalars['String'];
  level?: Maybe<PricelistDiscountLevel>;
  minOrderAmount?: Maybe<Scalars['Float']>;
  name: Scalars['String'];
  posId?: Maybe<Scalars['String']>;
  posSettings?: Maybe<PricelistDiscountPosSettings>;
  type: PricelistMultiplierType;
  value: Scalars['Float'];
};

export type PricelistDiscountInput = {
  available?: InputMaybe<Scalars['Boolean']>;
  collection?: InputMaybe<Array<PricelistCollectionInput>>;
  count?: InputMaybe<Scalars['Float']>;
  delivery?: InputMaybe<Array<PricelistDeliveryInput>>;
  id: Scalars['String'];
  level?: InputMaybe<PricelistDiscountLevel>;
  minOrderAmount?: InputMaybe<Scalars['Float']>;
  name: Scalars['String'];
  posId?: InputMaybe<Scalars['String']>;
  posSettings?: InputMaybe<PricelistDiscountPosSettingsInput>;
  type: PricelistMultiplierType;
  value: Scalars['Float'];
};

export enum PricelistDiscountLevel {
  Item = 'Item',
  Order = 'Order'
}

export type PricelistDiscountPosSettings = {
  __typename?: 'PricelistDiscountPOSSettings';
  open?: Maybe<Scalars['Boolean']>;
};

export type PricelistDiscountPosSettingsInput = {
  open?: InputMaybe<Scalars['Boolean']>;
};

export type PricelistEnabledPayments = {
  __typename?: 'PricelistEnabledPayments';
  card?: Maybe<Scalars['Boolean']>;
  cash?: Maybe<Scalars['Boolean']>;
  roomBill?: Maybe<Scalars['Boolean']>;
};

export type PricelistEnabledPaymentsInput = {
  card?: InputMaybe<Scalars['Boolean']>;
  cash?: InputMaybe<Scalars['Boolean']>;
  roomBill?: InputMaybe<Scalars['Boolean']>;
};

export type PricelistFeedback = {
  __typename?: 'PricelistFeedback';
  averageRating: Scalars['Float'];
  noReviews: Scalars['Float'];
  ratings: Array<PricelistFeedbackRating>;
  recentOrders: Array<Order>;
};

export type PricelistFeedbackRating = {
  __typename?: 'PricelistFeedbackRating';
  count: Scalars['Float'];
  percentage: Scalars['Float'];
  value: Scalars['Float'];
};

export type PricelistItem = {
  __typename?: 'PricelistItem';
  description?: Maybe<Scalars['String']>;
  id: Scalars['String'];
  labels?: Maybe<Array<PricelistLabel>>;
  modifiers: Array<PricelistItemModifier>;
  name: Scalars['String'];
  note?: Maybe<Scalars['String']>;
  photos?: Maybe<Array<Scalars['String']>>;
  posId?: Maybe<Scalars['String']>;
  posSettings?: Maybe<PricelistItemPosSettings>;
  promotions?: Maybe<PricelistPromotions>;
  regularPrice: Scalars['Float'];
  roomServicePrice: Scalars['Float'];
  snoozed?: Maybe<Scalars['Boolean']>;
};

export type PricelistItemInput = {
  description?: InputMaybe<Scalars['String']>;
  id: Scalars['String'];
  labels?: InputMaybe<Array<PricelistLabelInput>>;
  modifiers: Array<PricelistItemModifierInput>;
  name: Scalars['String'];
  note?: InputMaybe<Scalars['String']>;
  photos?: InputMaybe<Array<Scalars['String']>>;
  posId?: InputMaybe<Scalars['String']>;
  posSettings?: InputMaybe<PricelistItemPosSettingsInput>;
  promotions?: InputMaybe<PricelistPromotionsInput>;
  regularPrice: Scalars['Float'];
  roomServicePrice: Scalars['Float'];
  snoozed?: InputMaybe<Scalars['Boolean']>;
};

export type PricelistItemModifier = {
  __typename?: 'PricelistItemModifier';
  id: Scalars['String'];
  maxSelection: Scalars['Float'];
  name: Scalars['String'];
  options: Array<PricelistItemOption>;
  posId?: Maybe<Scalars['String']>;
  required: Scalars['Boolean'];
};

export type PricelistItemModifierInput = {
  id: Scalars['String'];
  maxSelection: Scalars['Float'];
  name: Scalars['String'];
  options: Array<PricelistItemOptionInput>;
  posId?: InputMaybe<Scalars['String']>;
  required: Scalars['Boolean'];
};

export type PricelistItemOption = {
  __typename?: 'PricelistItemOption';
  id: Scalars['String'];
  name: Scalars['String'];
  posId?: Maybe<Scalars['String']>;
  price: Scalars['Float'];
};

export type PricelistItemOptionInput = {
  id: Scalars['String'];
  name: Scalars['String'];
  posId?: InputMaybe<Scalars['String']>;
  price: Scalars['Float'];
};

export type PricelistItemPosPriceLevel = {
  __typename?: 'PricelistItemPOSPriceLevel';
  name: Scalars['String'];
  posId: Scalars['String'];
  price: Scalars['Float'];
};

export type PricelistItemPosPriceLevelInput = {
  name: Scalars['String'];
  posId: Scalars['String'];
  price: Scalars['Float'];
};

export type PricelistItemPosSettings = {
  __typename?: 'PricelistItemPOSSettings';
  priceLevels?: Maybe<Array<PricelistItemPosPriceLevel>>;
  roomService: PricelistItemPosPriceLevel;
  tableService: PricelistItemPosPriceLevel;
};

export type PricelistItemPosSettingsInput = {
  priceLevels?: InputMaybe<Array<PricelistItemPosPriceLevelInput>>;
  roomService: PricelistItemPosPriceLevelInput;
  tableService: PricelistItemPosPriceLevelInput;
};

export type PricelistLabel = {
  __typename?: 'PricelistLabel';
  id: Scalars['String'];
  name: Scalars['String'];
};

export type PricelistLabelInput = {
  id: Scalars['String'];
  name: Scalars['String'];
};

export enum PricelistMultiplierType {
  Absolute = 'Absolute',
  Percentage = 'Percentage'
}

export type PricelistPosSettings = {
  __typename?: 'PricelistPOSSettings';
  employeeId?: Maybe<Scalars['String']>;
  enabled?: Maybe<Scalars['Boolean']>;
  posId?: Maybe<Scalars['String']>;
  provider?: Maybe<Scalars['String']>;
  revenueCenterId?: Maybe<Scalars['String']>;
  roomService: PricelistPosSettingsFulfilment;
  tableService: PricelistPosSettingsFulfilment;
};

export type PricelistPosSettingsFulfilment = {
  __typename?: 'PricelistPOSSettingsFulfilment';
  name: Scalars['String'];
  posId: Scalars['String'];
};

export type PricelistPosSettingsFulfilmentInput = {
  name: Scalars['String'];
  posId: Scalars['String'];
};

export type PricelistPosSettingsInput = {
  employeeId?: InputMaybe<Scalars['String']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  posId?: InputMaybe<Scalars['String']>;
  provider?: InputMaybe<Scalars['String']>;
  revenueCenterId?: InputMaybe<Scalars['String']>;
  roomService: PricelistPosSettingsFulfilmentInput;
  tableService: PricelistPosSettingsFulfilmentInput;
};

export type PricelistPromotions = {
  __typename?: 'PricelistPromotions';
  discounts?: Maybe<Array<PricelistDiscount>>;
};

export type PricelistPromotionsInput = {
  discounts?: InputMaybe<Array<PricelistDiscountInput>>;
};

export type PricelistSurcharge = {
  __typename?: 'PricelistSurcharge';
  collection?: Maybe<Array<PricelistCollection>>;
  delivery?: Maybe<Array<PricelistDelivery>>;
  id: Scalars['String'];
  name: Scalars['String'];
  type: PricelistMultiplierType;
  value: Scalars['Float'];
};

export type PricelistSurchargeInput = {
  collection?: InputMaybe<Array<PricelistCollectionInput>>;
  delivery?: InputMaybe<Array<PricelistDeliveryInput>>;
  id: Scalars['String'];
  name: Scalars['String'];
  type: PricelistMultiplierType;
  value: Scalars['Float'];
};

export type PricelistWhereInput = {
  id: Scalars['String'];
};

export type Product = {
  __typename?: 'Product';
  code: Scalars['String'];
  costPrice: Scalars['Float'];
  dateCreated: Scalars['DateTime'];
  dateUpdated: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  name: Scalars['String'];
  sellPrice: Scalars['Float'];
  stock: Scalars['Float'];
};

export type ProductWhereInput = {
  id: Scalars['String'];
};

export type PushNotification = {
  __typename?: 'PushNotification';
  hotel: Scalars['String'];
  tokens: Array<Scalars['String']>;
};

export type Query = {
  __typename?: 'Query';
  accessToken: GetAccessTokenResponse;
  accessTokenValid: Scalars['Boolean'];
  activeOrdersCount: Scalars['Float'];
  apaleoProperties: Array<ApaleoPropertyResponse>;
  attraction?: Maybe<Attraction>;
  attractionPlacebyPlaceID: AttractionPlace;
  booking: Booking;
  bookingAnalytics: BookingAnalyticsResponse;
  bookings: Array<Booking>;
  customDomain?: Maybe<GetCustomDomainResponse>;
  customer: Customer;
  customers: Array<Customer>;
  findBooking: Booking;
  generateAttractionPlacesCategories: Array<GenerateAttractionPlacesCategoryResponse>;
  googlePlacesHotelDetails: GooglePlaceHotelDetailsResponse;
  googlePlacesHotelSearch: Array<GooglePlaceHotelSearchResponse>;
  guest: GuestWithStatistics;
  guestPaymentMethods: Array<GuestPaymentMethodsResponse>;
  guests: Array<Guest>;
  hmPayAccount: Array<HmPayAccountResponse>;
  hmPayPayouts: Array<PayoutValueResponse>;
  hotel: Hotel;
  hotelIDByDomain: Scalars['String'];
  hotels: Array<Hotel>;
  marketplaceApp?: Maybe<MarketplaceApp>;
  marketplaceAppSubscriptions: Array<HotelMarketplaceAppSubscription>;
  marketplaceApps: Array<MarketplaceApp>;
  messages: Array<Message>;
  mewsServices: Array<MewsServiceResponse>;
  omnivoreDiscounts: Array<OmnivoreDiscountsResponse>;
  omnivoreLocations: Array<OmnivoreLocationsResponse>;
  omnivoreOptions: OmnivoreOptionsResponse;
  omnivoreTables: Array<OmnivoreOption>;
  order: Order;
  orders: Array<Order>;
  outstandingGuests: OutstandingGuestsResponse;
  outstandingOrdersStatistics: OutstandingOrdersStatisticsResponse;
  pricelist: Pricelist;
  pricelistFeedback: PricelistFeedback;
  pricelists: Array<Pricelist>;
  product: Product;
  products: Array<Product>;
  sale: Sale;
  sales: Array<Sale>;
  searchBookings: SearchBookingsResponse;
  searchCustomAttractionPlace: Array<SearchCustomAttractionPlaceResponse>;
  searchCustomers: SearchCustomersResponse;
  searchGuests: SearchGuestsResponse;
  searchOrders: SearchOrdersResponse;
  searchOutstandingOrders: SearchOutstandingOrdersResponse;
  searchProducts: SearchProductsResponse;
  searchSales: SearchSalesResponse;
  space: Space;
  spaces: Array<Space>;
  stripeAccount: StripeAccountResponse;
  stripePayouts?: Maybe<Array<PayoutValueResponse>>;
  thread: Thread;
  threads: Array<Thread>;
  unreadThreadCount: Scalars['Float'];
  user: User;
  userExists: Scalars['Boolean'];
  userLoginToken: GetUserLoginTokenResponse;
  users: Array<User>;
};


export type QueryAccessTokenArgs = {
  authToken?: InputMaybe<Scalars['String']>;
  hotelId?: InputMaybe<Scalars['String']>;
  refreshToken?: InputMaybe<Scalars['String']>;
};


export type QueryAttractionPlacebyPlaceIdArgs = {
  placeId: Scalars['String'];
};


export type QueryBookingArgs = {
  where: WhereInputType;
};


export type QueryBookingAnalyticsArgs = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
};


export type QueryBookingsArgs = {
  guestId?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  sort?: InputMaybe<BookingSortInput>;
};


export type QueryCustomerArgs = {
  where: WhereInputType;
};


export type QueryFindBookingArgs = {
  bookingReference?: InputMaybe<Scalars['String']>;
  checkInDate: Scalars['DateTime'];
  checkOutDate: Scalars['DateTime'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
};


export type QueryGooglePlacesHotelDetailsArgs = {
  placeId: Scalars['String'];
  sessionToken: Scalars['String'];
};


export type QueryGooglePlacesHotelSearchArgs = {
  query: Scalars['String'];
  sessionToken: Scalars['String'];
};


export type QueryGuestArgs = {
  where?: InputMaybe<WhereInputType>;
};


export type QueryGuestsArgs = {
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  sort?: InputMaybe<GuestsSortInput>;
};


export type QueryHotelIdByDomainArgs = {
  domain: Scalars['String'];
};


export type QueryHotelsArgs = {
  groupId: Scalars['String'];
};


export type QueryMarketplaceAppArgs = {
  enabled?: InputMaybe<Scalars['Boolean']>;
  live?: InputMaybe<Scalars['Boolean']>;
  where: GetMarketplaceAppWhereInput;
};


export type QueryMarketplaceAppsArgs = {
  enabled?: InputMaybe<Scalars['Boolean']>;
  live?: InputMaybe<Scalars['Boolean']>;
};


export type QueryMessagesArgs = {
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  sort?: InputMaybe<OrdersSortInput>;
  threadId: Scalars['String'];
};


export type QueryOmnivoreDiscountsArgs = {
  locationId: Scalars['String'];
};


export type QueryOmnivoreOptionsArgs = {
  locationId: Scalars['String'];
};


export type QueryOmnivoreTablesArgs = {
  locationId: Scalars['String'];
};


export type QueryOrderArgs = {
  where: WhereInputType;
};


export type QueryOrdersArgs = {
  completed?: InputMaybe<Scalars['Boolean']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  guestId?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  rejected?: InputMaybe<Scalars['Boolean']>;
  sort?: InputMaybe<OrdersSortInput>;
  startDate?: InputMaybe<Scalars['DateTime']>;
};


export type QueryOutstandingGuestsArgs = {
  completed?: InputMaybe<Scalars['Boolean']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  guestId?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  paymentType?: InputMaybe<PaymentType>;
  rejected?: InputMaybe<Scalars['Boolean']>;
  sort?: InputMaybe<OrdersSortInput>;
  startDate?: InputMaybe<Scalars['DateTime']>;
};


export type QueryPricelistArgs = {
  where: WhereInputType;
};


export type QueryPricelistFeedbackArgs = {
  where: WhereInputType;
};


export type QueryProductArgs = {
  where: WhereInputType;
};


export type QuerySaleArgs = {
  where: WhereInputType;
};


export type QuerySalesArgs = {
  completed?: InputMaybe<Scalars['Boolean']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  guestId?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  rejected?: InputMaybe<Scalars['Boolean']>;
  sort?: InputMaybe<SalesSortInput>;
  startDate?: InputMaybe<Scalars['DateTime']>;
};


export type QuerySearchBookingsArgs = {
  endCheckInDate?: InputMaybe<Scalars['DateTime']>;
  endCheckOutDate?: InputMaybe<Scalars['DateTime']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  query?: InputMaybe<Scalars['String']>;
  startCheckInDate?: InputMaybe<Scalars['DateTime']>;
  startCheckOutDate?: InputMaybe<Scalars['DateTime']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  status?: InputMaybe<Scalars['String']>;
};


export type QuerySearchCustomAttractionPlaceArgs = {
  query: Scalars['String'];
};


export type QuerySearchCustomersArgs = {
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  outOfStockItems?: InputMaybe<Scalars['Boolean']>;
  query?: InputMaybe<Scalars['String']>;
};


export type QuerySearchGuestsArgs = {
  anonGuests?: InputMaybe<Scalars['Boolean']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  query?: InputMaybe<Scalars['String']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
};


export type QuerySearchOrdersArgs = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  query?: InputMaybe<Scalars['String']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
};


export type QuerySearchOutstandingOrdersArgs = {
  guestId?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  paymentType?: InputMaybe<PaymentType>;
  query?: InputMaybe<Scalars['String']>;
};


export type QuerySearchProductsArgs = {
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  outOfStockItems?: InputMaybe<Scalars['Boolean']>;
  query?: InputMaybe<Scalars['String']>;
};


export type QuerySearchSalesArgs = {
  endDate?: InputMaybe<Scalars['DateTime']>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  query?: InputMaybe<Scalars['String']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
};


export type QuerySpaceArgs = {
  where: WhereInputType;
};


export type QueryThreadArgs = {
  where: WhereInputType;
};


export type QueryThreadsArgs = {
  guestId?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  resolved?: InputMaybe<Scalars['Boolean']>;
  sort?: InputMaybe<ThreadSortInput>;
};


export type QueryUserExistsArgs = {
  where: WhereUserExistsInput;
};


export type QueryUserLoginTokenArgs = {
  hideSidebar?: InputMaybe<Scalars['Boolean']>;
  hotelId?: InputMaybe<Scalars['String']>;
  redirectURL?: InputMaybe<Scalars['String']>;
};

export type RegisterGroupAdminGroupInput = {
  name?: InputMaybe<Scalars['String']>;
};

export type RegisterGroupAdminHotelInput = {
  address: HotelAddressInput;
  countryCode: Scalars['String'];
  name: Scalars['String'];
  telephone: Scalars['String'];
  website: Scalars['String'];
};

export type RegisterGroupAdminResponse = {
  __typename?: 'RegisterGroupAdminResponse';
  group: Group;
  hotel: Hotel;
  user: User;
};

export type RegisterGroupAdminUserInput = {
  email: Scalars['String'];
  firstName?: InputMaybe<Scalars['String']>;
  jobTitle?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  mobile?: InputMaybe<Scalars['String']>;
};

export enum RegisterGuestResponse {
  Conflict = 'Conflict',
  Success = 'Success'
}

export enum RegisterHotelUserResponse {
  Conflict = 'Conflict',
  Success = 'Success'
}

export enum ReminderDurationType {
  Days = 'Days',
  Hours = 'Hours',
  Minutes = 'Minutes'
}

export type Role = {
  __typename?: 'Role';
  dateCreated: Scalars['DateTime'];
  dateUpdated: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  hotel: Hotel;
  id: Scalars['String'];
  role: UserRole;
  user: User;
};

export type Sale = {
  __typename?: 'Sale';
  cancelled?: Maybe<Scalars['Boolean']>;
  customer: Customer;
  dateCreated: Scalars['DateTime'];
  dateUpdated: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  instalmentPlan: SaleInstalmentPlan;
  items: Array<SaleItem>;
  salesReference?: Maybe<Scalars['String']>;
  subtotal: Scalars['Float'];
  totalPrice: Scalars['Float'];
};

export type SaleInstalmentPlan = {
  __typename?: 'SaleInstalmentPlan';
  initialPayment: Scalars['Float'];
  noTerms: Scalars['Float'];
  terms: Array<SaleInstalmentTerm>;
};

export type SaleInstalmentPlanInput = {
  initialPayment: Scalars['Float'];
  noTerms: Scalars['Float'];
  terms: Array<SaleInstalmentTermInput>;
};

export type SaleInstalmentTerm = {
  __typename?: 'SaleInstalmentTerm';
  completed: Scalars['Boolean'];
  dueAmount: Scalars['Float'];
  dueDate?: Maybe<Scalars['DateTime']>;
  id: Scalars['String'];
  paidAmount: Scalars['Float'];
};

export type SaleInstalmentTermInput = {
  completed?: InputMaybe<Scalars['Boolean']>;
  dueAmount: Scalars['Float'];
  dueDate?: InputMaybe<Scalars['DateTime']>;
  id: Scalars['String'];
  paidAmount: Scalars['Float'];
};

export type SaleItem = {
  __typename?: 'SaleItem';
  id: Scalars['String'];
  productId: Scalars['String'];
  quantity: Scalars['Float'];
  title: Scalars['String'];
  totalCost: Scalars['Float'];
  totalSell: Scalars['Float'];
};

export type SaleItemInput = {
  id: Scalars['String'];
  productId: Scalars['String'];
  quantity: Scalars['Float'];
  title: Scalars['String'];
  totalCost: Scalars['Float'];
  totalSell: Scalars['Float'];
};

export type SaleWhereInput = {
  id: Scalars['String'];
};

export type SalesSortInput = {
  dateCreated?: InputMaybe<PaginationSort>;
  id?: InputMaybe<PaginationSort>;
};

export type SearchBookingsResponse = {
  __typename?: 'SearchBookingsResponse';
  count: Scalars['Float'];
  data: Array<Booking>;
};

export type SearchCustomAttractionPlaceResponse = {
  __typename?: 'SearchCustomAttractionPlaceResponse';
  description: Scalars['String'];
  placeId: Scalars['String'];
  title: Scalars['String'];
};

export type SearchCustomersResponse = {
  __typename?: 'SearchCustomersResponse';
  count: Scalars['Float'];
  data: Array<Customer>;
};

export type SearchGuestsResponse = {
  __typename?: 'SearchGuestsResponse';
  count: Scalars['Float'];
  data: Array<Guest>;
};

export type SearchOrdersResponse = {
  __typename?: 'SearchOrdersResponse';
  count: Scalars['Float'];
  data: Array<Order>;
};

export type SearchOutstandingOrdersResponse = {
  __typename?: 'SearchOutstandingOrdersResponse';
  count: Scalars['Float'];
  data: Array<Order>;
};

export type SearchProductsResponse = {
  __typename?: 'SearchProductsResponse';
  count: Scalars['Float'];
  data: Array<Product>;
};

export type SearchSalesResponse = {
  __typename?: 'SearchSalesResponse';
  count: Scalars['Float'];
  data: Array<Sale>;
};

export type Space = {
  __typename?: 'Space';
  availability: Availability;
  dateCreated: Scalars['DateTime'];
  dateUpdated: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  enabled?: Maybe<Scalars['Boolean']>;
  id: Scalars['String'];
  location: Scalars['String'];
  name: Scalars['String'];
  pricelists: Array<Pricelist>;
};

export type SpaceWhereInput = {
  id: Scalars['String'];
};

export type StripeAccount = {
  __typename?: 'StripeAccount';
  accountId: Scalars['String'];
  dateCreated: Scalars['DateTime'];
  linked?: Maybe<Scalars['Boolean']>;
  publicKey?: Maybe<Scalars['String']>;
};

export type StripeAccountInput = {
  accountId: Scalars['String'];
  dateCreated: Scalars['DateTime'];
  linked?: InputMaybe<Scalars['Boolean']>;
  publicKey?: InputMaybe<Scalars['String']>;
};

export type StripeAccountResponse = {
  __typename?: 'StripeAccountResponse';
  accountLink?: Maybe<Scalars['String']>;
  accountNumberLast4?: Maybe<Scalars['String']>;
  dateCreated: Scalars['DateTime'];
  paymentsEnabled: Scalars['Boolean'];
  payoutSchedule?: Maybe<HmPayAccountPayoutSchedule>;
  payoutsEnabled: Scalars['Boolean'];
  sortCode?: Maybe<Scalars['String']>;
};

export type StripeExternalAccountPayoutScheduleInput = {
  interval: PayoutInterval;
  monthlyInterval?: InputMaybe<Scalars['Float']>;
  weeklyInterval?: InputMaybe<StripeWeeklyPayoutInterval>;
};

export enum StripeWeeklyPayoutInterval {
  Friday = 'Friday',
  Monday = 'Monday',
  Saturday = 'Saturday',
  Sunday = 'Sunday',
  Thursday = 'Thursday',
  Tuesday = 'Tuesday',
  Wednesday = 'Wednesday'
}

export type Thread = {
  __typename?: 'Thread';
  dateCreated: Scalars['DateTime'];
  dateUpdated: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  guest: Guest;
  id: Scalars['String'];
  lastMessage?: Maybe<Message>;
  order?: Maybe<Order>;
  resolved?: Maybe<Scalars['Boolean']>;
};

export type ThreadSortInput = {
  dateCreated?: InputMaybe<PaginationSort>;
  dateUpdated?: InputMaybe<PaginationSort>;
  id?: InputMaybe<PaginationSort>;
};

export type ThreadWhereInput = {
  id: Scalars['String'];
};

export type UpdateAttractionInput = {
  catalog?: InputMaybe<AttractionCatalogInput>;
  description?: InputMaybe<Scalars['String']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
};

export type UpdateBookingInput = {
  bookingDetails?: InputMaybe<BookingDetailsInput>;
  bookingReference?: InputMaybe<Scalars['String']>;
  carRegistration?: InputMaybe<Scalars['String']>;
  checkInDate?: InputMaybe<Scalars['DateTime']>;
  checkOutDate?: InputMaybe<Scalars['DateTime']>;
  clubMemberNumber?: InputMaybe<Scalars['String']>;
  estimatedTimeOfArrival?: InputMaybe<Scalars['String']>;
  numberOfAdults?: InputMaybe<Scalars['Float']>;
  numberOfChildren?: InputMaybe<Scalars['Float']>;
  party?: InputMaybe<Array<BookingPartyInput>>;
  pmsId?: InputMaybe<Scalars['String']>;
  purposeOfStay?: InputMaybe<Scalars['String']>;
  roomNumber?: InputMaybe<Scalars['String']>;
  roomType?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<BookingStatus>;
};

export type UpdateCustomLinkInput = {
  enabled: Scalars['Boolean'];
  link: Scalars['String'];
  name: Scalars['String'];
  photo?: InputMaybe<Scalars['String']>;
};

export type UpdateCustomerInput = {
  address?: InputMaybe<Scalars['String']>;
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  nic?: InputMaybe<Scalars['String']>;
  phone?: InputMaybe<Scalars['String']>;
};

export type UpdateGuestInput = {
  firstName?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  mobile?: InputMaybe<Scalars['String']>;
  mobileCountryCode?: InputMaybe<Scalars['String']>;
};

export type UpdateHotelInput = {
  address?: InputMaybe<HotelAddressInput>;
  app?: InputMaybe<HotelAppInput>;
  bookingsSettings?: InputMaybe<BookingsSettingsInput>;
  countryCode?: InputMaybe<Scalars['String']>;
  currencyCode?: InputMaybe<Scalars['String']>;
  messagesSettings?: InputMaybe<MessagesSettingsInput>;
  name?: InputMaybe<Scalars['String']>;
  payouts?: InputMaybe<HotelPayoutsInput>;
  pmsSettings?: InputMaybe<HotelPmsSettingsInput>;
  telephone?: InputMaybe<Scalars['String']>;
  website?: InputMaybe<Scalars['String']>;
};

export type UpdateMarketplaceAppInput = {
  connectLink?: InputMaybe<Scalars['String']>;
  description?: InputMaybe<Scalars['String']>;
  documentationURL?: InputMaybe<Scalars['String']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  helpURL?: InputMaybe<Scalars['String']>;
  live?: InputMaybe<Scalars['Boolean']>;
  logo?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  redirectURLs?: InputMaybe<Array<Scalars['String']>>;
  type?: InputMaybe<IntegrationType>;
  websiteURL?: InputMaybe<Scalars['String']>;
};

export type UpdateMarketplaceAppSubscriptionInput = {
  endpoint?: InputMaybe<Scalars['String']>;
  topics?: InputMaybe<Array<HotelMarketplaceAppSubscriptionTopic>>;
};

export type UpdateOrderInput = {
  feedback?: InputMaybe<OrderFeedbackInput>;
  reasonRejected?: InputMaybe<Scalars['String']>;
  status?: InputMaybe<OrderStatus>;
};

export type UpdatePricelistInput = {
  autoApprove?: InputMaybe<Scalars['Boolean']>;
  availability?: InputMaybe<AvailabilityInput>;
  catalog?: InputMaybe<PricelistCatalogInput>;
  collection?: InputMaybe<Array<PricelistCollectionInput>>;
  commerce?: InputMaybe<Scalars['Boolean']>;
  delivery?: InputMaybe<Array<PricelistDeliveryInput>>;
  description?: InputMaybe<Scalars['String']>;
  enabledPayments?: InputMaybe<PricelistEnabledPaymentsInput>;
  feedback?: InputMaybe<Scalars['Boolean']>;
  name?: InputMaybe<Scalars['String']>;
  posSettings?: InputMaybe<PricelistPosSettingsInput>;
  promotions?: InputMaybe<PricelistPromotionsInput>;
  spaceId?: InputMaybe<Scalars['String']>;
  surcharges?: InputMaybe<Array<PricelistSurchargeInput>>;
};

export type UpdateProductInput = {
  code?: InputMaybe<Scalars['String']>;
  costPrice?: InputMaybe<Scalars['Float']>;
  name?: InputMaybe<Scalars['String']>;
  sellPrice?: InputMaybe<Scalars['Float']>;
  stock?: InputMaybe<Scalars['Float']>;
};

export type UpdateSaleInput = {
  cancelled?: InputMaybe<Scalars['Boolean']>;
  instalmentPlan?: InputMaybe<SaleInstalmentPlanInput>;
};

export type UpdateSpaceInput = {
  availability?: InputMaybe<AvailabilityInput>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  location?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
};

export type UpdateThreadInput = {
  resolved?: InputMaybe<Scalars['Boolean']>;
};

export type UpdateUserInput = {
  firstName?: InputMaybe<Scalars['String']>;
  groupAdmin?: InputMaybe<Scalars['Boolean']>;
  hotels?: InputMaybe<Array<InviteUserHotelInput>>;
  jobTitle?: InputMaybe<Scalars['String']>;
  lastName?: InputMaybe<Scalars['String']>;
  mobile?: InputMaybe<Scalars['String']>;
  notifications?: InputMaybe<UserNotificationsInput>;
};

export type User = {
  __typename?: 'User';
  dateCreated: Scalars['DateTime'];
  dateUpdated: Scalars['DateTime'];
  deleted?: Maybe<Scalars['Boolean']>;
  developer?: Maybe<Scalars['Boolean']>;
  email: Scalars['String'];
  firstName?: Maybe<Scalars['String']>;
  group: Group;
  groupAdmin?: Maybe<Scalars['Boolean']>;
  hotelManager?: Maybe<Scalars['Boolean']>;
  hotels: Array<Hotel>;
  id: Scalars['String'];
  jobTitle?: Maybe<Scalars['String']>;
  lastName?: Maybe<Scalars['String']>;
  mobile?: Maybe<Scalars['String']>;
  notifications?: Maybe<UserNotifications>;
  pushSubscriptions?: Maybe<Array<UserPushSubscription>>;
  roles: Array<Role>;
};

export type UserNotifications = {
  __typename?: 'UserNotifications';
  bookings?: Maybe<Scalars['Boolean']>;
  messages?: Maybe<Scalars['Boolean']>;
  orders?: Maybe<Scalars['Boolean']>;
};

export type UserNotificationsInput = {
  bookings?: InputMaybe<Scalars['Boolean']>;
  messages?: InputMaybe<Scalars['Boolean']>;
  orders?: InputMaybe<Scalars['Boolean']>;
};

export type UserPushSubscription = {
  __typename?: 'UserPushSubscription';
  dateUpdated: Scalars['DateTime'];
  device: UserPushSubscriptionDevice;
  enabled: Scalars['Boolean'];
  id: Scalars['String'];
  pushSubscription: WebPushSubscription;
  sound: Scalars['Boolean'];
};

export type UserPushSubscriptionDevice = {
  __typename?: 'UserPushSubscriptionDevice';
  browser?: Maybe<Scalars['String']>;
  model?: Maybe<Scalars['String']>;
  os?: Maybe<Scalars['String']>;
  type?: Maybe<Scalars['String']>;
  vendor?: Maybe<Scalars['String']>;
};

export enum UserRole {
  GroupAdmin = 'GroupAdmin',
  HotelAdmin = 'HotelAdmin',
  HotelMember = 'HotelMember',
  SuperAdmin = 'SuperAdmin'
}

export type UserWhereInput = {
  id: Scalars['String'];
};

export type WebPushSubscription = {
  __typename?: 'WebPushSubscription';
  endpoint: Scalars['String'];
  expirationTime?: Maybe<Scalars['Float']>;
  keys: WebPushSubscriptionKeys;
};

export type WebPushSubscriptionInput = {
  endpoint: Scalars['String'];
  expirationTime?: InputMaybe<Scalars['Float']>;
  keys: WebPushSubscriptionKeysInput;
};

export type WebPushSubscriptionKeys = {
  __typename?: 'WebPushSubscriptionKeys';
  auth: Scalars['String'];
  p256dh: Scalars['String'];
};

export type WebPushSubscriptionKeysInput = {
  auth: Scalars['String'];
  p256dh: Scalars['String'];
};

export type WhereInputType = {
  id: Scalars['String'];
};

export type WhereUserExistsInput = {
  email: Scalars['String'];
};

export type AddCustomDomainMutationVariables = Exact<{
  domain: Scalars['String'];
}>;


export type AddCustomDomainMutation = { __typename?: 'Mutation', addCustomDomain: boolean };

export type AddCustomLinkMutationVariables = Exact<{
  id: Scalars['String'];
  enabled: Scalars['Boolean'];
  name: Scalars['String'];
  link: Scalars['String'];
  photo?: InputMaybe<Scalars['String']>;
}>;


export type AddCustomLinkMutation = { __typename?: 'Mutation', addCustomLink: { __typename?: 'HotelCustomLink', id: string, enabled: boolean, name: string, link: string, photo?: string | undefined } };

export type AnonGuestLoginMutationVariables = Exact<{
  deviceId: Scalars['String'];
}>;


export type AnonGuestLoginMutation = { __typename?: 'Mutation', anonGuestLogin: { __typename?: 'Guest', deviceId?: string | undefined, dateUpdated: any, dateCreated: any, id: string } };

export type AuthorizeApaleoMutationVariables = Exact<{
  code: Scalars['String'];
}>;


export type AuthorizeApaleoMutation = { __typename?: 'Mutation', authorizeApaleo: boolean };

export type AuthorizeMewsMutationVariables = Exact<{
  accessToken: Scalars['String'];
  clientToken: Scalars['String'];
}>;


export type AuthorizeMewsMutation = { __typename?: 'Mutation', authorizeMews: boolean };

export type AuthorizeOmnivoreMutationVariables = Exact<{
  apiKey: Scalars['String'];
}>;


export type AuthorizeOmnivoreMutation = { __typename?: 'Mutation', authorizeOmnivore: boolean };

export type ConnectMarketplaceAppMutationVariables = Exact<{
  id: Scalars['String'];
  redirectURL: Scalars['String'];
}>;


export type ConnectMarketplaceAppMutation = { __typename?: 'Mutation', connectMarketplaceApp: { __typename?: 'ConnectMarketplaceAppResponse', redirectURL: string } };

export type CreateAttractionMutationVariables = Exact<{
  catalog?: InputMaybe<AttractionCatalogInput>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  description?: InputMaybe<Scalars['String']>;
}>;


export type CreateAttractionMutation = { __typename?: 'Mutation', createAttraction: { __typename?: 'Attraction', description?: string | undefined } };

export type CreateBookingMutationVariables = Exact<{
  roomNumber?: InputMaybe<Scalars['String']>;
  bookingReference?: InputMaybe<Scalars['String']>;
  checkInDate?: InputMaybe<Scalars['DateTime']>;
  checkOutDate?: InputMaybe<Scalars['DateTime']>;
  carRegistration?: InputMaybe<Scalars['String']>;
  party?: InputMaybe<Array<BookingPartyInput> | BookingPartyInput>;
  bookingDetails?: InputMaybe<BookingDetailsInput>;
  roomType?: InputMaybe<Scalars['String']>;
  estimatedTimeOfArrival?: InputMaybe<Scalars['String']>;
  numberOfAdults?: InputMaybe<Scalars['Float']>;
  numberOfChildren?: InputMaybe<Scalars['Float']>;
  clubMemberNumber?: InputMaybe<Scalars['String']>;
  dateReviewed?: InputMaybe<Scalars['DateTime']>;
  dateSubmitted?: InputMaybe<Scalars['DateTime']>;
  dateCheckedIn?: InputMaybe<Scalars['DateTime']>;
  guestId?: InputMaybe<Scalars['String']>;
}>;


export type CreateBookingMutation = { __typename?: 'Mutation', createBooking?: { __typename?: 'Booking', roomNumber?: string | undefined, bookingReference?: string | undefined, checkInDate?: any | undefined, checkOutDate?: any | undefined, carRegistration?: string | undefined, roomType?: string | undefined, estimatedTimeOfArrival?: string | undefined, numberOfAdults?: number | undefined, numberOfChildren?: number | undefined, clubMemberNumber?: string | undefined, purposeOfStay?: string | undefined, pmsId?: string | undefined, dateReviewed?: any | undefined, dateSubmitted?: any | undefined, dateCheckedIn?: any | undefined, dateCheckedOut?: any | undefined, dateCanceled?: any | undefined, status: BookingStatus, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, party?: Array<{ __typename?: 'BookingParty', id: string, firstName?: string | undefined, lastName?: string | undefined, ageGroup: AgeGroup, email?: string | undefined, mobile?: string | undefined, mobileCountryCode?: string | undefined, countryOfResidence?: string | undefined, address?: string | undefined, nationality?: string | undefined, passportNumber?: string | undefined, nextDestination?: string | undefined, dateOfBirth?: any | undefined, dietaryRequirements?: string | undefined, purposeOfStay?: string | undefined, specialOccasions?: string | undefined, job?: string | undefined, company?: string | undefined, pmsId?: string | undefined, carRegistration?: string | undefined }> | undefined, bookingDetails?: { __typename?: 'BookingDetails', toggleQuestion: Array<{ __typename?: 'BookingToggleQuestion', result?: string | undefined, toggle?: boolean | undefined, title: string, type: CustomFieldType }> } | undefined, guest?: { __typename?: 'Guest', mobileCountryCode?: string | undefined, email?: string | undefined, mobile?: string | undefined, lastName?: string | undefined, firstName?: string | undefined, id: string } | undefined } | undefined };

export type CreateCustomerMutationVariables = Exact<{
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  nic: Scalars['String'];
  phone: Scalars['String'];
  address: Scalars['String'];
}>;


export type CreateCustomerMutation = { __typename?: 'Mutation', createCustomer: { __typename?: 'Customer', firstName: string, lastName: string, nic: string, phone: string, address: string, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any } };

export type CreateGuestPaymentMethodMutationVariables = Exact<{
  name: Scalars['String'];
  token: Scalars['String'];
}>;


export type CreateGuestPaymentMethodMutation = { __typename?: 'Mutation', createGuestPaymentMethod: boolean };

export type CreateHmPayAccountMutationVariables = Exact<{
  accountNumber: Scalars['String'];
  sortCode: Scalars['String'];
}>;


export type CreateHmPayAccountMutation = { __typename?: 'Mutation', createHMPayAccount: { __typename?: 'HMPayAccountResponse', accountNumberLast4: string, sortCode: string, dateCreated: any, payoutSchedule?: { __typename?: 'HMPayAccountPayoutSchedule', interval: PayoutInterval, date: string } | undefined } };

export type CreateMarketplaceAppMutationVariables = Exact<{
  name: Scalars['String'];
  description: Scalars['String'];
  type: IntegrationType;
  logo: Scalars['String'];
  websiteURL: Scalars['String'];
  documentationURL: Scalars['String'];
  helpURL: Scalars['String'];
  redirectURLs: Array<Scalars['String']> | Scalars['String'];
  connectLink: Scalars['String'];
  live: Scalars['Boolean'];
  enabled: Scalars['Boolean'];
}>;


export type CreateMarketplaceAppMutation = { __typename?: 'Mutation', createMarketplaceApp: { __typename?: 'MarketplaceApp', name: string, description: string, type: IntegrationType, logo: string, websiteURL: string, documentationURL: string, helpURL: string, redirectURLs: Array<string>, connectLink: string, live: boolean, enabled: boolean, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, developer: { __typename?: 'User', id: string } } };

export type CreateMarketplaceAppSubscriptionMutationVariables = Exact<{
  endpoint: Scalars['String'];
  topics: Array<HotelMarketplaceAppSubscriptionTopic> | HotelMarketplaceAppSubscriptionTopic;
}>;


export type CreateMarketplaceAppSubscriptionMutation = { __typename?: 'Mutation', createMarketplaceAppSubscription: { __typename?: 'HotelMarketplaceAppSubscription', id: string, endpoint: string, topics: Array<HotelMarketplaceAppSubscriptionTopic> } };

export type CreateOrderMutationVariables = Exact<{
  dateApproved?: InputMaybe<Scalars['DateTime']>;
  dateReady?: InputMaybe<Scalars['DateTime']>;
  dateCompleted?: InputMaybe<Scalars['DateTime']>;
  dateScheduled?: InputMaybe<Scalars['DateTime']>;
  items: Array<OrderItemInput> | OrderItemInput;
  totalPrice: Scalars['Float'];
  roomNumber: Scalars['String'];
  notes?: InputMaybe<Scalars['String']>;
  cardDetails?: InputMaybe<CardDetailsInput>;
  paymentProvider?: InputMaybe<PayoutsStrategy>;
  paymentType: PaymentType;
  orderReference?: InputMaybe<Scalars['String']>;
  paymentIntentId?: InputMaybe<Scalars['String']>;
  subtotal: Scalars['Float'];
  discount?: InputMaybe<PriceMultiplierInput>;
  surcharges?: InputMaybe<Array<PriceMultiplierInput> | PriceMultiplierInput>;
  delivery?: InputMaybe<PricelistDeliveryType>;
  collection?: InputMaybe<PricelistCollectionType>;
  pricelistId: Scalars['String'];
  guestId?: InputMaybe<Scalars['String']>;
}>;


export type CreateOrderMutation = { __typename?: 'Mutation', createOrder: { __typename?: 'CreateOrderResponse', order?: { __typename?: 'Order', dateApproved?: any | undefined, dateReady?: any | undefined, dateCompleted?: any | undefined, dateScheduled?: any | undefined, totalPrice: number, roomNumber: string, notes?: string | undefined, paymentProvider?: PayoutsStrategy | undefined, paymentType: PaymentType, orderReference?: string | undefined, posId?: string | undefined, subtotal: number, reasonRejected?: string | undefined, rejected?: boolean | undefined, delivery?: PricelistDeliveryType | undefined, collection?: PricelistCollectionType | undefined, paid?: boolean | undefined, status: OrderStatus, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, items: Array<{ __typename?: 'OrderItem', id: string, name: string, posId?: string | undefined, quantity: number, totalPrice: number, modifiers: Array<{ __typename?: 'OrderItemModifier', id: string, name: string, posId?: string | undefined, options: Array<{ __typename?: 'OrderItemOption', id: string, name: string, posId?: string | undefined, price: number }> }>, discount?: { __typename?: 'PriceMultiplier', id: string, posId?: string | undefined, value: number, type: PricelistMultiplierType, name: string } | undefined, posSettings?: { __typename?: 'PricelistPOSSettingsFulfilment', posId: string, name: string } | undefined, omnivoreSettings?: { __typename?: 'OrderItemPOSSettings', tableService?: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number } | undefined, roomService?: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number } | undefined } | undefined }>, cardDetails?: { __typename?: 'CardDetails', id?: string | undefined, country?: string | undefined, brand: string, last4: string } | undefined, discount?: { __typename?: 'PriceMultiplier', id: string, posId?: string | undefined, value: number, type: PricelistMultiplierType, name: string } | undefined, surcharges?: Array<{ __typename?: 'PriceMultiplier', id: string, posId?: string | undefined, value: number, type: PricelistMultiplierType, name: string }> | undefined, feedback?: { __typename?: 'OrderFeedback', rating?: number | undefined } | undefined, guest: { __typename?: 'Guest', lastName?: string | undefined, firstName?: string | undefined, id: string }, space: { __typename?: 'Space', name: string, id: string }, pricelist: { __typename?: 'Pricelist', name: string, id: string }, thread?: { __typename?: 'Thread', id: string } | undefined } | undefined, paymentIntent?: { __typename?: 'OrderPaymentIntent', status: PaymentIntentStatus, clientSecret?: string | undefined } | undefined } };

export type CreatePricelistMutationVariables = Exact<{
  name: Scalars['String'];
  description?: InputMaybe<Scalars['String']>;
  availability: AvailabilityInput;
  commerce?: InputMaybe<Scalars['Boolean']>;
  collection?: InputMaybe<Array<PricelistCollectionInput> | PricelistCollectionInput>;
  delivery?: InputMaybe<Array<PricelistDeliveryInput> | PricelistDeliveryInput>;
  catalog?: InputMaybe<PricelistCatalogInput>;
  posSettings?: InputMaybe<PricelistPosSettingsInput>;
  promotions?: InputMaybe<PricelistPromotionsInput>;
  surcharges?: InputMaybe<Array<PricelistSurchargeInput> | PricelistSurchargeInput>;
  enabledPayments?: InputMaybe<PricelistEnabledPaymentsInput>;
  autoApprove?: InputMaybe<Scalars['Boolean']>;
  feedback?: InputMaybe<Scalars['Boolean']>;
  spaceId: Scalars['String'];
}>;


export type CreatePricelistMutation = { __typename?: 'Mutation', createPricelist: { __typename?: 'Pricelist', name: string, description?: string | undefined, commerce?: boolean | undefined, autoApprove?: boolean | undefined, feedback?: boolean | undefined, posId?: string | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, availability: { __typename?: 'Availability', m?: { __typename?: 'DaysTime', start: string, end: string } | undefined, t?: { __typename?: 'DaysTime', start: string, end: string } | undefined, w?: { __typename?: 'DaysTime', start: string, end: string } | undefined, th?: { __typename?: 'DaysTime', start: string, end: string } | undefined, f?: { __typename?: 'DaysTime', start: string, end: string } | undefined, sa?: { __typename?: 'DaysTime', start: string, end: string } | undefined, s?: { __typename?: 'DaysTime', start: string, end: string } | undefined }, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, catalog?: { __typename?: 'PricelistCatalog', categories: Array<{ __typename?: 'PricelistCategory', id: string, name: string, description?: string | undefined, posId?: string | undefined, items: Array<{ __typename?: 'PricelistItem', id: string, name: string, description?: string | undefined, photos?: Array<string> | undefined, regularPrice: number, roomServicePrice: number, note?: string | undefined, posId?: string | undefined, snoozed?: boolean | undefined, modifiers: Array<{ __typename?: 'PricelistItemModifier', id: string, name: string, posId?: string | undefined, required: boolean, maxSelection: number, options: Array<{ __typename?: 'PricelistItemOption', id: string, name: string, posId?: string | undefined, price: number }> }>, posSettings?: { __typename?: 'PricelistItemPOSSettings', roomService: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number }, tableService: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number }, priceLevels?: Array<{ __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number }> | undefined } | undefined, labels?: Array<{ __typename?: 'PricelistLabel', id: string, name: string }> | undefined, promotions?: { __typename?: 'PricelistPromotions', discounts?: Array<{ __typename?: 'PricelistDiscount', id: string, name: string, value: number, available?: boolean | undefined, level?: PricelistDiscountLevel | undefined, minOrderAmount?: number | undefined, type: PricelistMultiplierType, posId?: string | undefined, count?: number | undefined, posSettings?: { __typename?: 'PricelistDiscountPOSSettings', open?: boolean | undefined } | undefined, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined }> | undefined } | undefined }> }>, labels?: Array<{ __typename?: 'PricelistLabel', id: string, name: string }> | undefined } | undefined, posSettings?: { __typename?: 'PricelistPOSSettings', enabled?: boolean | undefined, posId?: string | undefined, revenueCenterId?: string | undefined, employeeId?: string | undefined, provider?: string | undefined, tableService: { __typename?: 'PricelistPOSSettingsFulfilment', posId: string, name: string }, roomService: { __typename?: 'PricelistPOSSettingsFulfilment', posId: string, name: string } } | undefined, promotions?: { __typename?: 'PricelistPromotions', discounts?: Array<{ __typename?: 'PricelistDiscount', id: string, name: string, value: number, available?: boolean | undefined, level?: PricelistDiscountLevel | undefined, minOrderAmount?: number | undefined, type: PricelistMultiplierType, posId?: string | undefined, count?: number | undefined, posSettings?: { __typename?: 'PricelistDiscountPOSSettings', open?: boolean | undefined } | undefined, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined }> | undefined } | undefined, surcharges?: Array<{ __typename?: 'PricelistSurcharge', id: string, name: string, value: number, type: PricelistMultiplierType, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined }> | undefined, enabledPayments?: { __typename?: 'PricelistEnabledPayments', card?: boolean | undefined, roomBill?: boolean | undefined, cash?: boolean | undefined } | undefined, space: { __typename?: 'Space', name: string, location: string, enabled?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, availability: { __typename?: 'Availability', m?: { __typename?: 'DaysTime', start: string, end: string } | undefined, t?: { __typename?: 'DaysTime', start: string, end: string } | undefined, w?: { __typename?: 'DaysTime', start: string, end: string } | undefined, th?: { __typename?: 'DaysTime', start: string, end: string } | undefined, f?: { __typename?: 'DaysTime', start: string, end: string } | undefined, sa?: { __typename?: 'DaysTime', start: string, end: string } | undefined, s?: { __typename?: 'DaysTime', start: string, end: string } | undefined } } } };

export type CreateProductMutationVariables = Exact<{
  name: Scalars['String'];
  code: Scalars['String'];
  stock: Scalars['Float'];
  sellPrice: Scalars['Float'];
  costPrice: Scalars['Float'];
}>;


export type CreateProductMutation = { __typename?: 'Mutation', createProduct: { __typename?: 'Product', name: string, code: string, stock: number, sellPrice: number, costPrice: number, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any } };

export type CreateSaleMutationVariables = Exact<{
  items: Array<SaleItemInput> | SaleItemInput;
  totalPrice: Scalars['Float'];
  salesReference?: InputMaybe<Scalars['String']>;
  subtotal: Scalars['Float'];
  instalmentPlan: SaleInstalmentPlanInput;
  customerNIC: Scalars['String'];
}>;


export type CreateSaleMutation = { __typename?: 'Mutation', createSale: { __typename?: 'CreateSaleResponse', sale?: { __typename?: 'Sale', totalPrice: number, salesReference?: string | undefined, subtotal: number, cancelled?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, items: Array<{ __typename?: 'SaleItem', id: string, productId: string, title: string, quantity: number, totalSell: number, totalCost: number }>, customer: { __typename?: 'Customer', address: string, phone: string, nic: string, lastName: string, firstName: string, id: string }, instalmentPlan: { __typename?: 'SaleInstalmentPlan', noTerms: number, initialPayment: number, terms: Array<{ __typename?: 'SaleInstalmentTerm', id: string, dueDate?: any | undefined, dueAmount: number, paidAmount: number, completed: boolean }> } } | undefined } };

export type CreateSpaceMutationVariables = Exact<{
  name: Scalars['String'];
  location: Scalars['String'];
  availability: AvailabilityInput;
  enabled?: InputMaybe<Scalars['Boolean']>;
}>;


export type CreateSpaceMutation = { __typename?: 'Mutation', createSpace: { __typename?: 'Space', name: string, location: string, enabled?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, availability: { __typename?: 'Availability', m?: { __typename?: 'DaysTime', start: string, end: string } | undefined, t?: { __typename?: 'DaysTime', start: string, end: string } | undefined, w?: { __typename?: 'DaysTime', start: string, end: string } | undefined, th?: { __typename?: 'DaysTime', start: string, end: string } | undefined, f?: { __typename?: 'DaysTime', start: string, end: string } | undefined, sa?: { __typename?: 'DaysTime', start: string, end: string } | undefined, s?: { __typename?: 'DaysTime', start: string, end: string } | undefined } } };

export type CreateStripeAccountMutationVariables = Exact<{ [key: string]: never; }>;


export type CreateStripeAccountMutation = { __typename?: 'Mutation', createStripeAccount: { __typename?: 'CreateStripeAccountResponse', accountLink: string } };

export type DeleteAttractionMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteAttractionMutation = { __typename?: 'Mutation', deleteAttraction: boolean };

export type DeleteCustomDomainMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteCustomDomainMutation = { __typename?: 'Mutation', deleteCustomDomain: boolean };

export type DeleteCustomLinkMutationVariables = Exact<{
  where: WhereInputType;
}>;


export type DeleteCustomLinkMutation = { __typename?: 'Mutation', deleteCustomLink: boolean };

export type DeleteCustomerMutationVariables = Exact<{
  where: WhereInputType;
}>;


export type DeleteCustomerMutation = { __typename?: 'Mutation', deleteCustomer: boolean };

export type DeleteGuestMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteGuestMutation = { __typename?: 'Mutation', deleteGuest: boolean };

export type DeleteGuestPaymentMethodMutationVariables = Exact<{
  paymentMethodId: Scalars['String'];
}>;


export type DeleteGuestPaymentMethodMutation = { __typename?: 'Mutation', deleteGuestPaymentMethod: boolean };

export type DeleteMarketplaceAppMutationVariables = Exact<{
  where: WhereInputType;
}>;


export type DeleteMarketplaceAppMutation = { __typename?: 'Mutation', deleteMarketplaceApp: boolean };

export type DeleteMarketplaceAppSubscriptionMutationVariables = Exact<{
  where: WhereInputType;
}>;


export type DeleteMarketplaceAppSubscriptionMutation = { __typename?: 'Mutation', deleteMarketplaceAppSubscription: boolean };

export type DeleteMarketplaceAppSubscriptionsMutationVariables = Exact<{ [key: string]: never; }>;


export type DeleteMarketplaceAppSubscriptionsMutation = { __typename?: 'Mutation', deleteMarketplaceAppSubscriptions: boolean };

export type DeletePricelistMutationVariables = Exact<{
  where: WhereInputType;
}>;


export type DeletePricelistMutation = { __typename?: 'Mutation', deletePricelist: boolean };

export type DeletePricelistsMutationVariables = Exact<{
  where: Array<WhereInputType> | WhereInputType;
}>;


export type DeletePricelistsMutation = { __typename?: 'Mutation', deletePricelists: boolean };

export type DeleteProductMutationVariables = Exact<{
  where: WhereInputType;
}>;


export type DeleteProductMutation = { __typename?: 'Mutation', deleteProduct: boolean };

export type DeleteProductsMutationVariables = Exact<{
  where: Array<WhereInputType> | WhereInputType;
}>;


export type DeleteProductsMutation = { __typename?: 'Mutation', deleteProducts: boolean };

export type DeleteSpaceMutationVariables = Exact<{
  where: WhereInputType;
}>;


export type DeleteSpaceMutation = { __typename?: 'Mutation', deleteSpace: boolean };

export type DeleteSpacesMutationVariables = Exact<{
  where: Array<WhereInputType> | WhereInputType;
}>;


export type DeleteSpacesMutation = { __typename?: 'Mutation', deleteSpaces: boolean };

export type DeleteUserMutationVariables = Exact<{
  where: WhereInputType;
}>;


export type DeleteUserMutation = { __typename?: 'Mutation', deleteUser: boolean };

export type DisableHotelPayoutsMutationVariables = Exact<{ [key: string]: never; }>;


export type DisableHotelPayoutsMutation = { __typename?: 'Mutation', disableHotelPayouts: { __typename?: 'HotelPayouts', enabled?: PayoutsStrategy | undefined, stripe?: { __typename?: 'StripeAccount', accountId: string, linked?: boolean | undefined, publicKey?: string | undefined, dateCreated: any } | undefined, hm?: { __typename?: 'HMPayAccount', accountNumberLast4: string, sortCode: string, dateCreated: any, payoutSchedule?: { __typename?: 'HMPayAccountPayoutSchedule', interval: PayoutInterval, date: string } | undefined } | undefined } };

export type DisconnectApaleoMutationVariables = Exact<{ [key: string]: never; }>;


export type DisconnectApaleoMutation = { __typename?: 'Mutation', disconnectApaleo: boolean };

export type DisconnectMarketplaceAppMutationVariables = Exact<{
  id?: InputMaybe<Scalars['String']>;
}>;


export type DisconnectMarketplaceAppMutation = { __typename?: 'Mutation', disconnectMarketplaceApp: boolean };

export type DisconnectMewsMutationVariables = Exact<{ [key: string]: never; }>;


export type DisconnectMewsMutation = { __typename?: 'Mutation', disconnectMews: boolean };

export type DisconnectOmnivoreMutationVariables = Exact<{ [key: string]: never; }>;


export type DisconnectOmnivoreMutation = { __typename?: 'Mutation', disconnectOmnivore: boolean };

export type EnableHotelPayoutsMutationVariables = Exact<{
  payoutsStrategy: PayoutsStrategy;
}>;


export type EnableHotelPayoutsMutation = { __typename?: 'Mutation', enableHotelPayouts: { __typename?: 'HotelPayouts', enabled?: PayoutsStrategy | undefined, stripe?: { __typename?: 'StripeAccount', accountId: string, linked?: boolean | undefined, publicKey?: string | undefined, dateCreated: any } | undefined, hm?: { __typename?: 'HMPayAccount', accountNumberLast4: string, sortCode: string, dateCreated: any, payoutSchedule?: { __typename?: 'HMPayAccountPayoutSchedule', interval: PayoutInterval, date: string } | undefined } | undefined } };

export type GenerateAttractionPlacesMutationVariables = Exact<{
  categories: Array<GenerateAttractionPlacesCategoryArgs> | GenerateAttractionPlacesCategoryArgs;
  requestBooking: Scalars['Boolean'];
  radius: Scalars['Float'];
}>;


export type GenerateAttractionPlacesMutation = { __typename?: 'Mutation', generateAttractionPlaces: boolean };

export type GenerateMarketplaceAppKeyMutationVariables = Exact<{ [key: string]: never; }>;


export type GenerateMarketplaceAppKeyMutation = { __typename?: 'Mutation', generateMarketplaceAppKey: string };

export type GuestLoginMutationVariables = Exact<{
  deviceId: Scalars['String'];
  email: Scalars['String'];
  verificationToken: Scalars['String'];
}>;


export type GuestLoginMutation = { __typename?: 'Mutation', guestLogin: { __typename?: 'Guest', id: string } };

export type GuestLogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type GuestLogoutMutation = { __typename?: 'Mutation', guestLogout: boolean };

export type GuestTokenLoginMutationVariables = Exact<{ [key: string]: never; }>;


export type GuestTokenLoginMutation = { __typename?: 'Mutation', guestTokenLogin: { __typename?: 'Guest', id: string } };

export type InviteHotelUserMutationVariables = Exact<{
  email: Scalars['String'];
  hotels?: InputMaybe<Array<InviteUserHotelInput> | InviteUserHotelInput>;
  groupAdmin?: InputMaybe<Scalars['Boolean']>;
}>;


export type InviteHotelUserMutation = { __typename?: 'Mutation', inviteHotelUser: boolean };

export type LinkStripeAccountMutationVariables = Exact<{
  authCode: Scalars['String'];
}>;


export type LinkStripeAccountMutation = { __typename?: 'Mutation', linkStripeAccount: boolean };

export type RegisterGroupAdminMutationVariables = Exact<{
  user: RegisterGroupAdminUserInput;
  hotel: RegisterGroupAdminHotelInput;
  group?: InputMaybe<RegisterGroupAdminGroupInput>;
  termsAndConditions: Scalars['Boolean'];
}>;


export type RegisterGroupAdminMutation = { __typename?: 'Mutation', registerGroupAdmin: { __typename?: 'RegisterGroupAdminResponse', user: { __typename?: 'User', hotelManager?: boolean | undefined, groupAdmin?: boolean | undefined, jobTitle?: string | undefined, mobile?: string | undefined, lastName?: string | undefined, firstName?: string | undefined, email: string, dateUpdated: any, dateCreated: any, id: string }, hotel: { __typename?: 'Hotel', id: string }, group: { __typename?: 'Group', id: string } } };

export type RegisterGuestMutationVariables = Exact<{
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  countryCode?: InputMaybe<Scalars['String']>;
  mobile?: InputMaybe<Scalars['String']>;
}>;


export type RegisterGuestMutation = { __typename?: 'Mutation', registerGuest: RegisterGuestResponse };

export type RegisterHotelUserMutationVariables = Exact<{
  id: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  mobile: Scalars['String'];
  termsAndConditions: Scalars['Boolean'];
}>;


export type RegisterHotelUserMutation = { __typename?: 'Mutation', registerHotelUser: RegisterHotelUserResponse };

export type ResolveThreadMutationVariables = Exact<{
  where: WhereInputType;
}>;


export type ResolveThreadMutation = { __typename?: 'Mutation', resolveThread: { __typename?: 'Thread', resolved?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, guest: { __typename?: 'Guest', mobileCountryCode?: string | undefined, mobile?: string | undefined, lastName?: string | undefined, firstName?: string | undefined, email?: string | undefined, id: string }, order?: { __typename?: 'Order', subtotal: number, orderReference?: string | undefined, totalPrice: number, dateCreated: any, id: string, pricelist: { __typename?: 'Pricelist', id: string, name: string }, space: { __typename?: 'Space', id: string, name: string }, discount?: { __typename?: 'PriceMultiplier', value: number, name: string } | undefined } | undefined, lastMessage?: { __typename?: 'Message', author: MessageAuthor, text: string, dateCreated: any, id: string } | undefined } };

export type ResyncPosMutationVariables = Exact<{ [key: string]: never; }>;


export type ResyncPosMutation = { __typename?: 'Mutation', resyncPOS: boolean };

export type SendGuestTokenMutationVariables = Exact<{
  email: Scalars['String'];
  deviceId: Scalars['String'];
}>;


export type SendGuestTokenMutation = { __typename?: 'Mutation', sendGuestToken: boolean };

export type SendUserTokenMutationVariables = Exact<{
  email: Scalars['String'];
  verificationTokenOnly?: InputMaybe<Scalars['Boolean']>;
}>;


export type SendUserTokenMutation = { __typename?: 'Mutation', sendUserToken: boolean };

export type SettleOrdersMutationVariables = Exact<{
  orderId?: InputMaybe<Scalars['String']>;
  guestId?: InputMaybe<Scalars['String']>;
  paymentType?: InputMaybe<PaymentType>;
}>;


export type SettleOrdersMutation = { __typename?: 'Mutation', settleOrders: boolean };

export type SubscribeGuestPushNotificationsMutationVariables = Exact<{
  pushNotificationToken: Scalars['String'];
}>;


export type SubscribeGuestPushNotificationsMutation = { __typename?: 'Mutation', subscribeGuestPushNotifications: { __typename?: 'Guest', deviceId?: string | undefined, email?: string | undefined, firstName?: string | undefined, lastName?: string | undefined, mobile?: string | undefined, mobileCountryCode?: string | undefined, dateOfBirth?: any | undefined, countryOfResidence?: string | undefined, address?: string | undefined, nationality?: string | undefined, passportNumber?: string | undefined, dietaryRequirements?: string | undefined, company?: string | undefined, job?: string | undefined, pmsId?: string | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, threads: Array<{ __typename?: 'Thread', id: string }>, orders: Array<{ __typename?: 'Order', id: string }> } };

export type SubscribeUserPushNotificationsMutationVariables = Exact<{
  deviceId: Scalars['String'];
  pushSubscription: WebPushSubscriptionInput;
  sound?: InputMaybe<Scalars['Boolean']>;
}>;


export type SubscribeUserPushNotificationsMutation = { __typename?: 'Mutation', subscribeUserPushNotifications: { __typename?: 'User', email: string, firstName?: string | undefined, lastName?: string | undefined, mobile?: string | undefined, jobTitle?: string | undefined, groupAdmin?: boolean | undefined, hotelManager?: boolean | undefined, developer?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, pushSubscriptions?: Array<{ __typename?: 'UserPushSubscription', id: string, enabled: boolean, sound: boolean, dateUpdated: any, pushSubscription: { __typename?: 'WebPushSubscription', endpoint: string, expirationTime?: number | undefined, keys: { __typename?: 'WebPushSubscriptionKeys', p256dh: string, auth: string } }, device: { __typename?: 'UserPushSubscriptionDevice', vendor?: string | undefined, model?: string | undefined, type?: string | undefined, browser?: string | undefined, os?: string | undefined } }> | undefined, notifications?: { __typename?: 'UserNotifications', orders?: boolean | undefined, bookings?: boolean | undefined, messages?: boolean | undefined } | undefined } };

export type UnsubscribeUserPushNotificationsMutationVariables = Exact<{
  deviceId: Scalars['String'];
}>;


export type UnsubscribeUserPushNotificationsMutation = { __typename?: 'Mutation', unsubscribeUserPushNotifications: { __typename?: 'User', email: string, firstName?: string | undefined, lastName?: string | undefined, mobile?: string | undefined, jobTitle?: string | undefined, groupAdmin?: boolean | undefined, hotelManager?: boolean | undefined, developer?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, pushSubscriptions?: Array<{ __typename?: 'UserPushSubscription', id: string, enabled: boolean, sound: boolean, dateUpdated: any, pushSubscription: { __typename?: 'WebPushSubscription', endpoint: string, expirationTime?: number | undefined, keys: { __typename?: 'WebPushSubscriptionKeys', p256dh: string, auth: string } }, device: { __typename?: 'UserPushSubscriptionDevice', vendor?: string | undefined, model?: string | undefined, type?: string | undefined, browser?: string | undefined, os?: string | undefined } }> | undefined, notifications?: { __typename?: 'UserNotifications', orders?: boolean | undefined, bookings?: boolean | undefined, messages?: boolean | undefined } | undefined } };

export type UpdateAttractionMutationVariables = Exact<{
  data: UpdateAttractionInput;
}>;


export type UpdateAttractionMutation = { __typename?: 'Mutation', updateAttraction: { __typename?: 'Attraction', enabled?: boolean | undefined, description?: string | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, catalog?: { __typename?: 'AttractionCatalog', categories: Array<{ __typename?: 'AttractionCategory', id: string, name: string, description?: string | undefined, places: Array<{ __typename?: 'AttractionPlace', id?: string | undefined, placeId?: string | undefined, name: string, address: string, rating?: number | undefined, note?: string | undefined, photos: Array<string>, description?: string | undefined, website?: string | undefined, phone?: string | undefined, requestBooking: boolean, coordinates?: { __typename?: 'Coordinates', lat: number, lng: number } | undefined, labels: Array<{ __typename?: 'AttractionPlaceLabel', id: string, name: string }> }> }>, labels?: Array<{ __typename?: 'AttractionPlaceLabel', id: string, name: string }> | undefined } | undefined } };

export type UpdateBookingMutationVariables = Exact<{
  data: UpdateBookingInput;
  where: BookingWhereInput;
}>;


export type UpdateBookingMutation = { __typename?: 'Mutation', updateBooking: { __typename?: 'Booking', roomNumber?: string | undefined, bookingReference?: string | undefined, checkInDate?: any | undefined, checkOutDate?: any | undefined, carRegistration?: string | undefined, roomType?: string | undefined, estimatedTimeOfArrival?: string | undefined, numberOfAdults?: number | undefined, numberOfChildren?: number | undefined, clubMemberNumber?: string | undefined, purposeOfStay?: string | undefined, pmsId?: string | undefined, dateReviewed?: any | undefined, dateSubmitted?: any | undefined, dateCheckedIn?: any | undefined, dateCheckedOut?: any | undefined, dateCanceled?: any | undefined, status: BookingStatus, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, party?: Array<{ __typename?: 'BookingParty', id: string, firstName?: string | undefined, lastName?: string | undefined, ageGroup: AgeGroup, email?: string | undefined, mobile?: string | undefined, mobileCountryCode?: string | undefined, countryOfResidence?: string | undefined, address?: string | undefined, nationality?: string | undefined, passportNumber?: string | undefined, nextDestination?: string | undefined, dateOfBirth?: any | undefined, dietaryRequirements?: string | undefined, purposeOfStay?: string | undefined, specialOccasions?: string | undefined, job?: string | undefined, company?: string | undefined, pmsId?: string | undefined, carRegistration?: string | undefined }> | undefined, bookingDetails?: { __typename?: 'BookingDetails', toggleQuestion: Array<{ __typename?: 'BookingToggleQuestion', result?: string | undefined, toggle?: boolean | undefined, title: string, type: CustomFieldType }> } | undefined, guest?: { __typename?: 'Guest', mobileCountryCode?: string | undefined, email?: string | undefined, mobile?: string | undefined, lastName?: string | undefined, firstName?: string | undefined, id: string } | undefined } };

export type UpdateCustomLinkMutationVariables = Exact<{
  where: CustomLinkWhereInput;
  data: UpdateCustomLinkInput;
}>;


export type UpdateCustomLinkMutation = { __typename?: 'Mutation', updateCustomLink: { __typename?: 'HotelCustomLink', id: string, enabled: boolean, name: string, link: string, photo?: string | undefined } };

export type UpdateCustomerMutationVariables = Exact<{
  where: CustomerWhereInput;
  data: UpdateCustomerInput;
}>;


export type UpdateCustomerMutation = { __typename?: 'Mutation', updateCustomer: { __typename?: 'Customer', firstName: string, lastName: string, nic: string, phone: string, address: string, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any } };

export type UpdateGuestMutationVariables = Exact<{
  where?: InputMaybe<GuestWhereInput>;
  data: UpdateGuestInput;
}>;


export type UpdateGuestMutation = { __typename?: 'Mutation', updateGuest: { __typename?: 'Guest', deviceId?: string | undefined, email?: string | undefined, firstName?: string | undefined, lastName?: string | undefined, mobile?: string | undefined, mobileCountryCode?: string | undefined, dateOfBirth?: any | undefined, countryOfResidence?: string | undefined, address?: string | undefined, nationality?: string | undefined, passportNumber?: string | undefined, dietaryRequirements?: string | undefined, company?: string | undefined, job?: string | undefined, pmsId?: string | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, bookings?: Array<{ __typename?: 'Booking', roomNumber?: string | undefined, bookingReference?: string | undefined, checkInDate?: any | undefined, checkOutDate?: any | undefined, carRegistration?: string | undefined, roomType?: string | undefined, estimatedTimeOfArrival?: string | undefined, numberOfAdults?: number | undefined, numberOfChildren?: number | undefined, clubMemberNumber?: string | undefined, purposeOfStay?: string | undefined, pmsId?: string | undefined, dateReviewed?: any | undefined, dateSubmitted?: any | undefined, dateCheckedIn?: any | undefined, dateCheckedOut?: any | undefined, dateCanceled?: any | undefined, status: BookingStatus, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, party?: Array<{ __typename?: 'BookingParty', id: string, firstName?: string | undefined, lastName?: string | undefined, ageGroup: AgeGroup, email?: string | undefined, mobile?: string | undefined, mobileCountryCode?: string | undefined, countryOfResidence?: string | undefined, address?: string | undefined, nationality?: string | undefined, passportNumber?: string | undefined, nextDestination?: string | undefined, dateOfBirth?: any | undefined, dietaryRequirements?: string | undefined, purposeOfStay?: string | undefined, specialOccasions?: string | undefined, job?: string | undefined, company?: string | undefined, pmsId?: string | undefined, carRegistration?: string | undefined }> | undefined, bookingDetails?: { __typename?: 'BookingDetails', toggleQuestion: Array<{ __typename?: 'BookingToggleQuestion', result?: string | undefined, toggle?: boolean | undefined, title: string, type: CustomFieldType }> } | undefined, guest?: { __typename?: 'Guest', mobileCountryCode?: string | undefined, email?: string | undefined, mobile?: string | undefined, lastName?: string | undefined, firstName?: string | undefined, id: string } | undefined }> | undefined, threads: Array<{ __typename?: 'Thread', id: string }>, orders: Array<{ __typename?: 'Order', id: string }> } };

export type UpdateHmPayExternalAccountMutationVariables = Exact<{
  accountNumber: Scalars['String'];
  sortCode: Scalars['String'];
  payoutSchedule: HmPayAccountPayoutScheduleInput;
}>;


export type UpdateHmPayExternalAccountMutation = { __typename?: 'Mutation', updateHMPayExternalAccount: { __typename?: 'HMPayAccountResponse', accountNumberLast4: string, sortCode: string, dateCreated: any, payoutSchedule?: { __typename?: 'HMPayAccountPayoutSchedule', interval: PayoutInterval, date: string } | undefined } };

export type UpdateHotelMutationVariables = Exact<{
  data: UpdateHotelInput;
}>;


export type UpdateHotelMutation = { __typename?: 'Mutation', updateHotel: { __typename?: 'Hotel', name: string, telephone: string, website: string, currencyCode: string, countryCode: string, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, address: { __typename?: 'HotelAddress', line1: string, line2: string, town: string, country: string, postalCode: string, placeId?: string | undefined, coordinates?: { __typename?: 'Coordinates', lat: number, lng: number } | undefined }, app?: { __typename?: 'HotelApp', versionCode?: number | undefined, domain?: string | undefined, disabled?: boolean | undefined, disabledReason?: string | undefined, forceUpdate?: boolean | undefined, metadata?: { __typename?: 'HotelAppMetadata', title?: string | undefined, subtitle?: string | undefined, shortDescription?: string | undefined, fullDescription?: string | undefined, keywords?: string | undefined, icon?: string | undefined, screenshots?: { __typename?: 'HotelAppScreenshots', ios: { __typename?: 'HotelAppIOSScreenshots', _1: string, _2: string, _3: string }, ios55: { __typename?: 'HotelAppIOSScreenshots', _1: string, _2: string, _3: string }, android: { __typename?: 'HotelAppAndroidScreenshots', featureGraphic: string } } | undefined, ios?: { __typename?: 'HotelAppMetadataIOS', appStoreId: string } | undefined } | undefined, assets?: { __typename?: 'HotelAppAssets', featuredImage?: string | undefined, featuredLogo?: string | undefined } | undefined, experimental?: { __typename?: 'HotelAppExperimental', hideProfile?: boolean | undefined } | undefined } | undefined, payouts?: { __typename?: 'HotelPayouts', enabled?: PayoutsStrategy | undefined, stripe?: { __typename?: 'StripeAccount', accountId: string, linked?: boolean | undefined, publicKey?: string | undefined, dateCreated: any } | undefined, hm?: { __typename?: 'HMPayAccount', accountNumberLast4: string, sortCode: string, dateCreated: any, payoutSchedule?: { __typename?: 'HMPayAccountPayoutSchedule', interval: PayoutInterval, date: string } | undefined } | undefined } | undefined, messagesSettings?: { __typename?: 'MessagesSettings', enabled?: boolean | undefined, checkedInOnly?: boolean | undefined, hideResolvedChats?: boolean | undefined, availability?: { __typename?: 'Availability', m?: { __typename?: 'DaysTime', start: string, end: string } | undefined, t?: { __typename?: 'DaysTime', start: string, end: string } | undefined, w?: { __typename?: 'DaysTime', start: string, end: string } | undefined, th?: { __typename?: 'DaysTime', start: string, end: string } | undefined, f?: { __typename?: 'DaysTime', start: string, end: string } | undefined, sa?: { __typename?: 'DaysTime', start: string, end: string } | undefined, s?: { __typename?: 'DaysTime', start: string, end: string } | undefined } | undefined, awayMessage?: { __typename?: 'MessagesAwayMessage', message?: string | undefined, showTime: boolean } | undefined } | undefined, bookingsSettings?: { __typename?: 'BookingsSettings', enabled: boolean, checkInTime: string, checkOutTime: string, maxNumberOfRooms?: number | undefined, maxPartySize?: number | undefined, contactMethods: { __typename?: 'BookingContactMethods', appMessaging?: boolean | undefined, phoneNumber?: boolean | undefined, email?: boolean | undefined }, preArrival: { __typename?: 'BookingPreArrival', minHoursBeforeCheckIn: number, email?: boolean | undefined, notifications: { __typename?: 'BookingNotifications', app?: boolean | undefined, email?: boolean | undefined, reminders?: Array<{ __typename?: 'BookingReminder', value: number, duration: ReminderDurationType }> | undefined }, fields: { __typename?: 'BookingFields', bookingReference: boolean, name: boolean, datesOfStay: boolean, estimatedTimeOfArrival: boolean, numberOfAdults: boolean, numberOfChildren: boolean, clubMemberNumber: boolean, countryOfResidence: boolean, address: boolean, nationality: boolean, dateOfBirth: boolean, dietaryRequirements: boolean, purposeOfStay?: boolean | undefined, specialOccasions: boolean, job: boolean, company: boolean, passportScan: boolean, passportNumber: boolean, foreignNationalPassportNumber?: boolean | undefined, customFields?: Array<{ __typename?: 'CustomField', title: string, type: CustomFieldType }> | undefined, party?: { __typename?: 'BookingPartyFields', adult?: { __typename?: 'BookingAdultFields', nextDestination: boolean, foreignNationalNextDestination?: boolean | undefined, job: boolean, company: boolean, name: boolean, countryOfResidence: boolean, address: boolean, nationality: boolean, passportNumber: boolean, foreignNationalPassportNumber?: boolean | undefined, mobile: boolean, email: boolean, dateOfBirth: boolean, dietaryRequirements: boolean } | undefined, child?: { __typename?: 'BookingChildFields', name: boolean, countryOfResidence: boolean, address: boolean, nationality: boolean, passportNumber: boolean, foreignNationalPassportNumber?: boolean | undefined, mobile: boolean, email: boolean, dateOfBirth: boolean, dietaryRequirements: boolean } | undefined } | undefined }, terms?: Array<{ __typename?: 'BookingTerm', message: string, link?: string | undefined }> | undefined }, arrival: { __typename?: 'BookingArrival', entryMethods: { __typename?: 'BookingEntryMethods', frontDesk?: boolean | undefined, appKey?: boolean | undefined }, instructions?: { __typename?: 'BookingInstructions', display: BookingInstructionsDisplayType, steps?: Array<string> | undefined } | undefined }, departure: { __typename?: 'BookingDeparture', notifications: { __typename?: 'BookingNotifications', app?: boolean | undefined, email?: boolean | undefined, reminders?: Array<{ __typename?: 'BookingReminder', value: number, duration: ReminderDurationType }> | undefined } }, customization: { __typename?: 'BookingCustomization', checkInStart: { __typename?: 'BookingCustomizationFields', title: string, message: string }, checkInReview: { __typename?: 'BookingCustomizationFields', title: string, message: string }, checkInSuccess: { __typename?: 'BookingCustomizationFields', title: string, message: string }, checkInUnsuccessful: { __typename?: 'BookingCustomizationFields', title: string, message: string } } } | undefined, pmsSettings?: { __typename?: 'HotelPMSSettings', pmsId?: string | undefined, mewsSettings?: { __typename?: 'HotelPMSMewsSettings', orderableServiceId: string, bookableServiceId: string } | undefined } | undefined, customLinks?: Array<{ __typename?: 'HotelCustomLink', id: string, enabled: boolean, name: string, link: string, photo?: string | undefined }> | undefined, integrations?: { __typename?: 'HotelIntegrations', mews?: { __typename?: 'HotelIntegrationsMews', provider: string, type: IntegrationType } | undefined, marketplaceApps?: Array<{ __typename?: 'HotelMarketplaceApp', id: string, name: string, type: string }> | undefined } | undefined, group: { __typename?: 'Group', id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, integrations?: { __typename?: 'GroupIntegrations', apaleo?: { __typename?: 'GroupIntegrationsApaleo', provider: IntegrationProvider, type: IntegrationType } | undefined, omnivore?: { __typename?: 'GroupIntegrationsOmnivore', type: IntegrationType } | undefined } | undefined, app?: { __typename?: 'GroupApp', aggregator?: boolean | undefined, versionCode?: number | undefined, domain?: string | undefined, disabled?: boolean | undefined, disabledReason?: string | undefined, forceUpdate?: boolean | undefined, metadata?: { __typename?: 'HotelAppMetadata', title?: string | undefined, subtitle?: string | undefined, shortDescription?: string | undefined, fullDescription?: string | undefined, keywords?: string | undefined, icon?: string | undefined, screenshots?: { __typename?: 'HotelAppScreenshots', ios: { __typename?: 'HotelAppIOSScreenshots', _1: string, _2: string, _3: string }, ios55: { __typename?: 'HotelAppIOSScreenshots', _1: string, _2: string, _3: string }, android: { __typename?: 'HotelAppAndroidScreenshots', featureGraphic: string } } | undefined, ios?: { __typename?: 'HotelAppMetadataIOS', appStoreId: string } | undefined } | undefined, assets?: { __typename?: 'HotelAppAssets', featuredImage?: string | undefined, featuredLogo?: string | undefined } | undefined, experimental?: { __typename?: 'HotelAppExperimental', hideProfile?: boolean | undefined } | undefined } | undefined } } };

export type UpdateMarketplaceAppMutationVariables = Exact<{
  where: MarketplaceAppWhereInput;
  data: UpdateMarketplaceAppInput;
}>;


export type UpdateMarketplaceAppMutation = { __typename?: 'Mutation', updateMarketplaceApp: { __typename?: 'MarketplaceApp', name: string, description: string, type: IntegrationType, logo: string, websiteURL: string, documentationURL: string, helpURL: string, redirectURLs: Array<string>, connectLink: string, live: boolean, enabled: boolean, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, developer: { __typename?: 'User', id: string } } };

export type UpdateMarketplaceAppSubscriptionMutationVariables = Exact<{
  where: MarketplaceAppSubscriptionWhereInput;
  data: UpdateMarketplaceAppSubscriptionInput;
}>;


export type UpdateMarketplaceAppSubscriptionMutation = { __typename?: 'Mutation', updateMarketplaceAppSubscription: { __typename?: 'HotelMarketplaceAppSubscription', id: string, endpoint: string, topics: Array<HotelMarketplaceAppSubscriptionTopic> } };

export type UpdateOrderMutationVariables = Exact<{
  where: OrderWhereInput;
  data: UpdateOrderInput;
}>;


export type UpdateOrderMutation = { __typename?: 'Mutation', updateOrder: { __typename?: 'Order', dateApproved?: any | undefined, dateReady?: any | undefined, dateCompleted?: any | undefined, dateScheduled?: any | undefined, totalPrice: number, roomNumber: string, notes?: string | undefined, paymentProvider?: PayoutsStrategy | undefined, paymentType: PaymentType, orderReference?: string | undefined, posId?: string | undefined, subtotal: number, reasonRejected?: string | undefined, rejected?: boolean | undefined, delivery?: PricelistDeliveryType | undefined, collection?: PricelistCollectionType | undefined, paid?: boolean | undefined, status: OrderStatus, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, items: Array<{ __typename?: 'OrderItem', id: string, name: string, posId?: string | undefined, quantity: number, totalPrice: number, modifiers: Array<{ __typename?: 'OrderItemModifier', id: string, name: string, posId?: string | undefined, options: Array<{ __typename?: 'OrderItemOption', id: string, name: string, posId?: string | undefined, price: number }> }>, discount?: { __typename?: 'PriceMultiplier', id: string, posId?: string | undefined, value: number, type: PricelistMultiplierType, name: string } | undefined, posSettings?: { __typename?: 'PricelistPOSSettingsFulfilment', posId: string, name: string } | undefined, omnivoreSettings?: { __typename?: 'OrderItemPOSSettings', tableService?: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number } | undefined, roomService?: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number } | undefined } | undefined }>, cardDetails?: { __typename?: 'CardDetails', id?: string | undefined, country?: string | undefined, brand: string, last4: string } | undefined, discount?: { __typename?: 'PriceMultiplier', id: string, posId?: string | undefined, value: number, type: PricelistMultiplierType, name: string } | undefined, surcharges?: Array<{ __typename?: 'PriceMultiplier', id: string, posId?: string | undefined, value: number, type: PricelistMultiplierType, name: string }> | undefined, feedback?: { __typename?: 'OrderFeedback', rating?: number | undefined } | undefined, guest: { __typename?: 'Guest', lastName?: string | undefined, firstName?: string | undefined, id: string }, space: { __typename?: 'Space', name: string, id: string }, pricelist: { __typename?: 'Pricelist', name: string, id: string }, thread?: { __typename?: 'Thread', id: string } | undefined } };

export type UpdatePricelistMutationVariables = Exact<{
  where: PricelistWhereInput;
  data: UpdatePricelistInput;
}>;


export type UpdatePricelistMutation = { __typename?: 'Mutation', updatePricelist: { __typename?: 'Pricelist', name: string, description?: string | undefined, commerce?: boolean | undefined, autoApprove?: boolean | undefined, feedback?: boolean | undefined, posId?: string | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, availability: { __typename?: 'Availability', m?: { __typename?: 'DaysTime', start: string, end: string } | undefined, t?: { __typename?: 'DaysTime', start: string, end: string } | undefined, w?: { __typename?: 'DaysTime', start: string, end: string } | undefined, th?: { __typename?: 'DaysTime', start: string, end: string } | undefined, f?: { __typename?: 'DaysTime', start: string, end: string } | undefined, sa?: { __typename?: 'DaysTime', start: string, end: string } | undefined, s?: { __typename?: 'DaysTime', start: string, end: string } | undefined }, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, catalog?: { __typename?: 'PricelistCatalog', categories: Array<{ __typename?: 'PricelistCategory', id: string, name: string, description?: string | undefined, posId?: string | undefined, items: Array<{ __typename?: 'PricelistItem', id: string, name: string, description?: string | undefined, photos?: Array<string> | undefined, regularPrice: number, roomServicePrice: number, note?: string | undefined, posId?: string | undefined, snoozed?: boolean | undefined, modifiers: Array<{ __typename?: 'PricelistItemModifier', id: string, name: string, posId?: string | undefined, required: boolean, maxSelection: number, options: Array<{ __typename?: 'PricelistItemOption', id: string, name: string, posId?: string | undefined, price: number }> }>, posSettings?: { __typename?: 'PricelistItemPOSSettings', roomService: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number }, tableService: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number }, priceLevels?: Array<{ __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number }> | undefined } | undefined, labels?: Array<{ __typename?: 'PricelistLabel', id: string, name: string }> | undefined, promotions?: { __typename?: 'PricelistPromotions', discounts?: Array<{ __typename?: 'PricelistDiscount', id: string, name: string, value: number, available?: boolean | undefined, level?: PricelistDiscountLevel | undefined, minOrderAmount?: number | undefined, type: PricelistMultiplierType, posId?: string | undefined, count?: number | undefined, posSettings?: { __typename?: 'PricelistDiscountPOSSettings', open?: boolean | undefined } | undefined, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined }> | undefined } | undefined }> }>, labels?: Array<{ __typename?: 'PricelistLabel', id: string, name: string }> | undefined } | undefined, posSettings?: { __typename?: 'PricelistPOSSettings', enabled?: boolean | undefined, posId?: string | undefined, revenueCenterId?: string | undefined, employeeId?: string | undefined, provider?: string | undefined, tableService: { __typename?: 'PricelistPOSSettingsFulfilment', posId: string, name: string }, roomService: { __typename?: 'PricelistPOSSettingsFulfilment', posId: string, name: string } } | undefined, promotions?: { __typename?: 'PricelistPromotions', discounts?: Array<{ __typename?: 'PricelistDiscount', id: string, name: string, value: number, available?: boolean | undefined, level?: PricelistDiscountLevel | undefined, minOrderAmount?: number | undefined, type: PricelistMultiplierType, posId?: string | undefined, count?: number | undefined, posSettings?: { __typename?: 'PricelistDiscountPOSSettings', open?: boolean | undefined } | undefined, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined }> | undefined } | undefined, surcharges?: Array<{ __typename?: 'PricelistSurcharge', id: string, name: string, value: number, type: PricelistMultiplierType, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined }> | undefined, enabledPayments?: { __typename?: 'PricelistEnabledPayments', card?: boolean | undefined, roomBill?: boolean | undefined, cash?: boolean | undefined } | undefined, space: { __typename?: 'Space', name: string, location: string, enabled?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, availability: { __typename?: 'Availability', m?: { __typename?: 'DaysTime', start: string, end: string } | undefined, t?: { __typename?: 'DaysTime', start: string, end: string } | undefined, w?: { __typename?: 'DaysTime', start: string, end: string } | undefined, th?: { __typename?: 'DaysTime', start: string, end: string } | undefined, f?: { __typename?: 'DaysTime', start: string, end: string } | undefined, sa?: { __typename?: 'DaysTime', start: string, end: string } | undefined, s?: { __typename?: 'DaysTime', start: string, end: string } | undefined } } } };

export type UpdateProductMutationVariables = Exact<{
  where: ProductWhereInput;
  data: UpdateProductInput;
}>;


export type UpdateProductMutation = { __typename?: 'Mutation', updateProduct: { __typename?: 'Product', name: string, code: string, stock: number, sellPrice: number, costPrice: number, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any } };

export type UpdateSaleMutationVariables = Exact<{
  where: SaleWhereInput;
  data: UpdateSaleInput;
}>;


export type UpdateSaleMutation = { __typename?: 'Mutation', updateSale: { __typename?: 'Sale', totalPrice: number, salesReference?: string | undefined, subtotal: number, cancelled?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, items: Array<{ __typename?: 'SaleItem', id: string, productId: string, title: string, quantity: number, totalSell: number, totalCost: number }>, customer: { __typename?: 'Customer', address: string, phone: string, nic: string, lastName: string, firstName: string, id: string }, instalmentPlan: { __typename?: 'SaleInstalmentPlan', noTerms: number, initialPayment: number, terms: Array<{ __typename?: 'SaleInstalmentTerm', id: string, dueDate?: any | undefined, dueAmount: number, paidAmount: number, completed: boolean }> } } };

export type UpdateSpaceMutationVariables = Exact<{
  where: SpaceWhereInput;
  data: UpdateSpaceInput;
}>;


export type UpdateSpaceMutation = { __typename?: 'Mutation', updateSpace: { __typename?: 'Space', name: string, location: string, enabled?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, availability: { __typename?: 'Availability', m?: { __typename?: 'DaysTime', start: string, end: string } | undefined, t?: { __typename?: 'DaysTime', start: string, end: string } | undefined, w?: { __typename?: 'DaysTime', start: string, end: string } | undefined, th?: { __typename?: 'DaysTime', start: string, end: string } | undefined, f?: { __typename?: 'DaysTime', start: string, end: string } | undefined, sa?: { __typename?: 'DaysTime', start: string, end: string } | undefined, s?: { __typename?: 'DaysTime', start: string, end: string } | undefined } } };

export type UpdateStripeExternalAccountMutationVariables = Exact<{
  accountNumber: Scalars['String'];
  sortCode: Scalars['String'];
  payoutSchedule: StripeExternalAccountPayoutScheduleInput;
}>;


export type UpdateStripeExternalAccountMutation = { __typename?: 'Mutation', updateStripeExternalAccount: boolean };

export type UpdateThreadMutationVariables = Exact<{
  where: ThreadWhereInput;
  data: UpdateThreadInput;
}>;


export type UpdateThreadMutation = { __typename?: 'Mutation', updateThread: { __typename?: 'Thread', resolved?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, guest: { __typename?: 'Guest', mobileCountryCode?: string | undefined, mobile?: string | undefined, lastName?: string | undefined, firstName?: string | undefined, email?: string | undefined, id: string }, order?: { __typename?: 'Order', subtotal: number, orderReference?: string | undefined, totalPrice: number, dateCreated: any, id: string, pricelist: { __typename?: 'Pricelist', id: string, name: string }, space: { __typename?: 'Space', id: string, name: string }, discount?: { __typename?: 'PriceMultiplier', value: number, name: string } | undefined } | undefined, lastMessage?: { __typename?: 'Message', author: MessageAuthor, text: string, dateCreated: any, id: string } | undefined } };

export type UpdateUserMutationVariables = Exact<{
  where?: InputMaybe<UserWhereInput>;
  data: UpdateUserInput;
}>;


export type UpdateUserMutation = { __typename?: 'Mutation', updateUser: { __typename?: 'User', email: string, firstName?: string | undefined, lastName?: string | undefined, mobile?: string | undefined, jobTitle?: string | undefined, groupAdmin?: boolean | undefined, hotelManager?: boolean | undefined, developer?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, pushSubscriptions?: Array<{ __typename?: 'UserPushSubscription', id: string, enabled: boolean, sound: boolean, dateUpdated: any, pushSubscription: { __typename?: 'WebPushSubscription', endpoint: string, expirationTime?: number | undefined, keys: { __typename?: 'WebPushSubscriptionKeys', p256dh: string, auth: string } }, device: { __typename?: 'UserPushSubscriptionDevice', vendor?: string | undefined, model?: string | undefined, type?: string | undefined, browser?: string | undefined, os?: string | undefined } }> | undefined, notifications?: { __typename?: 'UserNotifications', orders?: boolean | undefined, bookings?: boolean | undefined, messages?: boolean | undefined } | undefined, group: { __typename?: 'Group', hotelManager?: boolean | undefined, name: string, id: string }, hotels: Array<{ __typename?: 'Hotel', name: string, id: string }>, roles: Array<{ __typename?: 'Role', role: UserRole, id: string, hotel: { __typename?: 'Hotel', id: string } }> } };

export type UploadAppAssetMutationVariables = Exact<{
  file: Scalars['Upload'];
}>;


export type UploadAppAssetMutation = { __typename?: 'Mutation', uploadAppAsset: boolean };

export type UserLoginMutationVariables = Exact<{ [key: string]: never; }>;


export type UserLoginMutation = { __typename?: 'Mutation', userLogin: { __typename?: 'User', email: string, firstName?: string | undefined, lastName?: string | undefined, mobile?: string | undefined, jobTitle?: string | undefined, groupAdmin?: boolean | undefined, hotelManager?: boolean | undefined, developer?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, pushSubscriptions?: Array<{ __typename?: 'UserPushSubscription', id: string, enabled: boolean, sound: boolean, dateUpdated: any, pushSubscription: { __typename?: 'WebPushSubscription', endpoint: string, expirationTime?: number | undefined, keys: { __typename?: 'WebPushSubscriptionKeys', p256dh: string, auth: string } }, device: { __typename?: 'UserPushSubscriptionDevice', vendor?: string | undefined, model?: string | undefined, type?: string | undefined, browser?: string | undefined, os?: string | undefined } }> | undefined, notifications?: { __typename?: 'UserNotifications', orders?: boolean | undefined, bookings?: boolean | undefined, messages?: boolean | undefined } | undefined, hotels: Array<{ __typename?: 'Hotel', name: string, id: string }>, roles: Array<{ __typename?: 'Role', role: UserRole, id: string, hotel: { __typename?: 'Hotel', id: string } }> } };

export type UserLogoutMutationVariables = Exact<{ [key: string]: never; }>;


export type UserLogoutMutation = { __typename?: 'Mutation', userLogout: boolean };

export type UserTokenLoginMutationVariables = Exact<{
  email: Scalars['String'];
  password: Scalars['String'];
}>;


export type UserTokenLoginMutation = { __typename?: 'Mutation', userTokenLogin: { __typename?: 'User', email: string, firstName?: string | undefined, lastName?: string | undefined, mobile?: string | undefined, jobTitle?: string | undefined, groupAdmin?: boolean | undefined, hotelManager?: boolean | undefined, developer?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, pushSubscriptions?: Array<{ __typename?: 'UserPushSubscription', id: string, enabled: boolean, sound: boolean, dateUpdated: any, pushSubscription: { __typename?: 'WebPushSubscription', endpoint: string, expirationTime?: number | undefined, keys: { __typename?: 'WebPushSubscriptionKeys', p256dh: string, auth: string } }, device: { __typename?: 'UserPushSubscriptionDevice', vendor?: string | undefined, model?: string | undefined, type?: string | undefined, browser?: string | undefined, os?: string | undefined } }> | undefined, notifications?: { __typename?: 'UserNotifications', orders?: boolean | undefined, bookings?: boolean | undefined, messages?: boolean | undefined } | undefined, hotels: Array<{ __typename?: 'Hotel', name: string, id: string }>, roles: Array<{ __typename?: 'Role', role: UserRole, id: string, hotel: { __typename?: 'Hotel', id: string } }> } };

export type AccessTokenQueryVariables = Exact<{
  authToken?: InputMaybe<Scalars['String']>;
  refreshToken?: InputMaybe<Scalars['String']>;
  hotelId?: InputMaybe<Scalars['String']>;
}>;


export type AccessTokenQuery = { __typename?: 'Query', accessToken: { __typename?: 'GetAccessTokenResponse', accessToken: string, refreshToken: string, ttl: number, grantLevel: Array<AccessTokenGrantLevel> } };

export type AccessTokenValidQueryVariables = Exact<{ [key: string]: never; }>;


export type AccessTokenValidQuery = { __typename?: 'Query', accessTokenValid: boolean };

export type ActiveOrdersCountQueryVariables = Exact<{ [key: string]: never; }>;


export type ActiveOrdersCountQuery = { __typename?: 'Query', activeOrdersCount: number };

export type ApaleoPropertiesQueryVariables = Exact<{ [key: string]: never; }>;


export type ApaleoPropertiesQuery = { __typename?: 'Query', apaleoProperties: Array<{ __typename?: 'ApaleoPropertyResponse', id: string, name: string }> };

export type AttractionQueryVariables = Exact<{ [key: string]: never; }>;


export type AttractionQuery = { __typename?: 'Query', attraction?: { __typename?: 'Attraction', enabled?: boolean | undefined, description?: string | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, catalog?: { __typename?: 'AttractionCatalog', categories: Array<{ __typename?: 'AttractionCategory', id: string, name: string, description?: string | undefined, places: Array<{ __typename?: 'AttractionPlace', id?: string | undefined, placeId?: string | undefined, name: string, address: string, rating?: number | undefined, note?: string | undefined, photos: Array<string>, description?: string | undefined, website?: string | undefined, phone?: string | undefined, requestBooking: boolean, coordinates?: { __typename?: 'Coordinates', lat: number, lng: number } | undefined, labels: Array<{ __typename?: 'AttractionPlaceLabel', id: string, name: string }> }> }>, labels?: Array<{ __typename?: 'AttractionPlaceLabel', id: string, name: string }> | undefined } | undefined } | undefined };

export type AttractionPlacebyPlaceIdQueryVariables = Exact<{
  placeId: Scalars['String'];
}>;


export type AttractionPlacebyPlaceIdQuery = { __typename?: 'Query', attractionPlacebyPlaceID: { __typename?: 'AttractionPlace', id?: string | undefined, placeId?: string | undefined, name: string, address: string, rating?: number | undefined, note?: string | undefined, photos: Array<string>, description?: string | undefined, website?: string | undefined, phone?: string | undefined, requestBooking: boolean, coordinates?: { __typename?: 'Coordinates', lat: number, lng: number } | undefined, labels: Array<{ __typename?: 'AttractionPlaceLabel', id: string, name: string }> } };

export type BookingQueryVariables = Exact<{
  where: WhereInputType;
}>;


export type BookingQuery = { __typename?: 'Query', booking: { __typename?: 'Booking', roomNumber?: string | undefined, bookingReference?: string | undefined, checkInDate?: any | undefined, checkOutDate?: any | undefined, carRegistration?: string | undefined, roomType?: string | undefined, estimatedTimeOfArrival?: string | undefined, numberOfAdults?: number | undefined, numberOfChildren?: number | undefined, clubMemberNumber?: string | undefined, purposeOfStay?: string | undefined, pmsId?: string | undefined, dateReviewed?: any | undefined, dateSubmitted?: any | undefined, dateCheckedIn?: any | undefined, dateCheckedOut?: any | undefined, dateCanceled?: any | undefined, status: BookingStatus, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, party?: Array<{ __typename?: 'BookingParty', id: string, firstName?: string | undefined, lastName?: string | undefined, ageGroup: AgeGroup, email?: string | undefined, mobile?: string | undefined, mobileCountryCode?: string | undefined, countryOfResidence?: string | undefined, address?: string | undefined, nationality?: string | undefined, passportNumber?: string | undefined, nextDestination?: string | undefined, dateOfBirth?: any | undefined, dietaryRequirements?: string | undefined, purposeOfStay?: string | undefined, specialOccasions?: string | undefined, job?: string | undefined, company?: string | undefined, pmsId?: string | undefined, carRegistration?: string | undefined }> | undefined, bookingDetails?: { __typename?: 'BookingDetails', toggleQuestion: Array<{ __typename?: 'BookingToggleQuestion', result?: string | undefined, toggle?: boolean | undefined, title: string, type: CustomFieldType }> } | undefined, guest?: { __typename?: 'Guest', mobileCountryCode?: string | undefined, email?: string | undefined, mobile?: string | undefined, lastName?: string | undefined, firstName?: string | undefined, id: string } | undefined } };

export type BookingAnalyticsQueryVariables = Exact<{
  startDate?: InputMaybe<Scalars['DateTime']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
}>;


export type BookingAnalyticsQuery = { __typename?: 'Query', bookingAnalytics: { __typename?: 'BookingAnalyticsResponse', noArrivals: number, noDepartures: number, noSubmittedBookings: number } };

export type BookingsQueryVariables = Exact<{
  sort?: InputMaybe<BookingSortInput>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  guestId?: InputMaybe<Scalars['String']>;
}>;


export type BookingsQuery = { __typename?: 'Query', bookings: Array<{ __typename?: 'Booking', roomNumber?: string | undefined, bookingReference?: string | undefined, checkInDate?: any | undefined, checkOutDate?: any | undefined, carRegistration?: string | undefined, roomType?: string | undefined, estimatedTimeOfArrival?: string | undefined, numberOfAdults?: number | undefined, numberOfChildren?: number | undefined, clubMemberNumber?: string | undefined, purposeOfStay?: string | undefined, pmsId?: string | undefined, dateReviewed?: any | undefined, dateSubmitted?: any | undefined, dateCheckedIn?: any | undefined, dateCheckedOut?: any | undefined, dateCanceled?: any | undefined, status: BookingStatus, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, party?: Array<{ __typename?: 'BookingParty', id: string, firstName?: string | undefined, lastName?: string | undefined, ageGroup: AgeGroup, email?: string | undefined, mobile?: string | undefined, mobileCountryCode?: string | undefined, countryOfResidence?: string | undefined, address?: string | undefined, nationality?: string | undefined, passportNumber?: string | undefined, nextDestination?: string | undefined, dateOfBirth?: any | undefined, dietaryRequirements?: string | undefined, purposeOfStay?: string | undefined, specialOccasions?: string | undefined, job?: string | undefined, company?: string | undefined, pmsId?: string | undefined, carRegistration?: string | undefined }> | undefined, bookingDetails?: { __typename?: 'BookingDetails', toggleQuestion: Array<{ __typename?: 'BookingToggleQuestion', result?: string | undefined, toggle?: boolean | undefined, title: string, type: CustomFieldType }> } | undefined, guest?: { __typename?: 'Guest', mobileCountryCode?: string | undefined, email?: string | undefined, mobile?: string | undefined, lastName?: string | undefined, firstName?: string | undefined, id: string } | undefined }> };

export type CustomDomainQueryVariables = Exact<{ [key: string]: never; }>;


export type CustomDomainQuery = { __typename?: 'Query', customDomain?: { __typename?: 'GetCustomDomainResponse', id: string, domain: string, configured: boolean, clientStatus: string } | undefined };

export type CustomerQueryVariables = Exact<{
  where: WhereInputType;
}>;


export type CustomerQuery = { __typename?: 'Query', customer: { __typename?: 'Customer', firstName: string, lastName: string, nic: string, phone: string, address: string, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any } };

export type CustomersQueryVariables = Exact<{ [key: string]: never; }>;


export type CustomersQuery = { __typename?: 'Query', customers: Array<{ __typename?: 'Customer', firstName: string, lastName: string, nic: string, phone: string, address: string, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any }> };

export type FindBookingQueryVariables = Exact<{
  bookingReference?: InputMaybe<Scalars['String']>;
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  checkInDate: Scalars['DateTime'];
  checkOutDate: Scalars['DateTime'];
}>;


export type FindBookingQuery = { __typename?: 'Query', findBooking: { __typename?: 'Booking', roomNumber?: string | undefined, bookingReference?: string | undefined, checkInDate?: any | undefined, checkOutDate?: any | undefined, carRegistration?: string | undefined, roomType?: string | undefined, estimatedTimeOfArrival?: string | undefined, numberOfAdults?: number | undefined, numberOfChildren?: number | undefined, clubMemberNumber?: string | undefined, purposeOfStay?: string | undefined, pmsId?: string | undefined, dateReviewed?: any | undefined, dateSubmitted?: any | undefined, dateCheckedIn?: any | undefined, dateCheckedOut?: any | undefined, dateCanceled?: any | undefined, status: BookingStatus, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, party?: Array<{ __typename?: 'BookingParty', id: string, firstName?: string | undefined, lastName?: string | undefined, ageGroup: AgeGroup, email?: string | undefined, mobile?: string | undefined, mobileCountryCode?: string | undefined, countryOfResidence?: string | undefined, address?: string | undefined, nationality?: string | undefined, passportNumber?: string | undefined, nextDestination?: string | undefined, dateOfBirth?: any | undefined, dietaryRequirements?: string | undefined, purposeOfStay?: string | undefined, specialOccasions?: string | undefined, job?: string | undefined, company?: string | undefined, pmsId?: string | undefined, carRegistration?: string | undefined }> | undefined, bookingDetails?: { __typename?: 'BookingDetails', toggleQuestion: Array<{ __typename?: 'BookingToggleQuestion', result?: string | undefined, toggle?: boolean | undefined, title: string, type: CustomFieldType }> } | undefined, guest?: { __typename?: 'Guest', mobileCountryCode?: string | undefined, email?: string | undefined, mobile?: string | undefined, lastName?: string | undefined, firstName?: string | undefined, id: string } | undefined } };

export type GenerateAttractionPlacesCategoriesQueryVariables = Exact<{ [key: string]: never; }>;


export type GenerateAttractionPlacesCategoriesQuery = { __typename?: 'Query', generateAttractionPlacesCategories: Array<{ __typename?: 'GenerateAttractionPlacesCategoryResponse', name: string }> };

export type GooglePlacesHotelDetailsQueryVariables = Exact<{
  placeId: Scalars['String'];
  sessionToken: Scalars['String'];
}>;


export type GooglePlacesHotelDetailsQuery = { __typename?: 'Query', googlePlacesHotelDetails: { __typename?: 'GooglePlaceHotelDetailsResponse', placeId: string, name: string, line1: string, line2: string, town: string, postalCode: string, country: string, countryCode: string, coordinates: { __typename?: 'Coordinates', lat: number, lng: number } } };

export type GooglePlacesHotelSearchQueryVariables = Exact<{
  query: Scalars['String'];
  sessionToken: Scalars['String'];
}>;


export type GooglePlacesHotelSearchQuery = { __typename?: 'Query', googlePlacesHotelSearch: Array<{ __typename?: 'GooglePlaceHotelSearchResponse', placeId: string, title: string, description: string }> };

export type GuestQueryVariables = Exact<{
  where?: InputMaybe<WhereInputType>;
}>;


export type GuestQuery = { __typename?: 'Query', guest: { __typename?: 'GuestWithStatistics', deviceId?: string | undefined, email?: string | undefined, firstName?: string | undefined, lastName?: string | undefined, mobile?: string | undefined, mobileCountryCode?: string | undefined, dateOfBirth?: any | undefined, countryOfResidence?: string | undefined, address?: string | undefined, nationality?: string | undefined, passportNumber?: string | undefined, dietaryRequirements?: string | undefined, company?: string | undefined, job?: string | undefined, pmsId?: string | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, bookings?: Array<{ __typename?: 'Booking', roomNumber?: string | undefined, bookingReference?: string | undefined, checkInDate?: any | undefined, checkOutDate?: any | undefined, carRegistration?: string | undefined, roomType?: string | undefined, estimatedTimeOfArrival?: string | undefined, numberOfAdults?: number | undefined, numberOfChildren?: number | undefined, clubMemberNumber?: string | undefined, purposeOfStay?: string | undefined, pmsId?: string | undefined, dateReviewed?: any | undefined, dateSubmitted?: any | undefined, dateCheckedIn?: any | undefined, dateCheckedOut?: any | undefined, dateCanceled?: any | undefined, status: BookingStatus, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, party?: Array<{ __typename?: 'BookingParty', id: string, firstName?: string | undefined, lastName?: string | undefined, ageGroup: AgeGroup, email?: string | undefined, mobile?: string | undefined, mobileCountryCode?: string | undefined, countryOfResidence?: string | undefined, address?: string | undefined, nationality?: string | undefined, passportNumber?: string | undefined, nextDestination?: string | undefined, dateOfBirth?: any | undefined, dietaryRequirements?: string | undefined, purposeOfStay?: string | undefined, specialOccasions?: string | undefined, job?: string | undefined, company?: string | undefined, pmsId?: string | undefined, carRegistration?: string | undefined }> | undefined, bookingDetails?: { __typename?: 'BookingDetails', toggleQuestion: Array<{ __typename?: 'BookingToggleQuestion', result?: string | undefined, toggle?: boolean | undefined, title: string, type: CustomFieldType }> } | undefined, guest?: { __typename?: 'Guest', mobileCountryCode?: string | undefined, email?: string | undefined, mobile?: string | undefined, lastName?: string | undefined, firstName?: string | undefined, id: string } | undefined }> | undefined, threads: Array<{ __typename?: 'Thread', id: string }>, orders: Array<{ __typename?: 'Order', id: string }> } };

export type GuestPaymentMethodsQueryVariables = Exact<{ [key: string]: never; }>;


export type GuestPaymentMethodsQuery = { __typename?: 'Query', guestPaymentMethods: Array<{ __typename?: 'GuestPaymentMethodsResponse', id: string, brand: string, country?: string | undefined, last4: string }> };

export type GuestWithStatisticsQueryVariables = Exact<{
  where?: InputMaybe<WhereInputType>;
}>;


export type GuestWithStatisticsQuery = { __typename?: 'Query', guest: { __typename?: 'GuestWithStatistics', totalSpend: number, ordersCount: number, itemsCount: number, deviceId?: string | undefined, email?: string | undefined, firstName?: string | undefined, lastName?: string | undefined, mobile?: string | undefined, mobileCountryCode?: string | undefined, dateOfBirth?: any | undefined, countryOfResidence?: string | undefined, address?: string | undefined, nationality?: string | undefined, passportNumber?: string | undefined, dietaryRequirements?: string | undefined, company?: string | undefined, job?: string | undefined, pmsId?: string | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, bookings?: Array<{ __typename?: 'Booking', roomNumber?: string | undefined, bookingReference?: string | undefined, checkInDate?: any | undefined, checkOutDate?: any | undefined, carRegistration?: string | undefined, roomType?: string | undefined, estimatedTimeOfArrival?: string | undefined, numberOfAdults?: number | undefined, numberOfChildren?: number | undefined, clubMemberNumber?: string | undefined, purposeOfStay?: string | undefined, pmsId?: string | undefined, dateReviewed?: any | undefined, dateSubmitted?: any | undefined, dateCheckedIn?: any | undefined, dateCheckedOut?: any | undefined, dateCanceled?: any | undefined, status: BookingStatus, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, party?: Array<{ __typename?: 'BookingParty', id: string, firstName?: string | undefined, lastName?: string | undefined, ageGroup: AgeGroup, email?: string | undefined, mobile?: string | undefined, mobileCountryCode?: string | undefined, countryOfResidence?: string | undefined, address?: string | undefined, nationality?: string | undefined, passportNumber?: string | undefined, nextDestination?: string | undefined, dateOfBirth?: any | undefined, dietaryRequirements?: string | undefined, purposeOfStay?: string | undefined, specialOccasions?: string | undefined, job?: string | undefined, company?: string | undefined, pmsId?: string | undefined, carRegistration?: string | undefined }> | undefined, bookingDetails?: { __typename?: 'BookingDetails', toggleQuestion: Array<{ __typename?: 'BookingToggleQuestion', result?: string | undefined, toggle?: boolean | undefined, title: string, type: CustomFieldType }> } | undefined, guest?: { __typename?: 'Guest', mobileCountryCode?: string | undefined, email?: string | undefined, mobile?: string | undefined, lastName?: string | undefined, firstName?: string | undefined, id: string } | undefined }> | undefined, threads: Array<{ __typename?: 'Thread', id: string }>, orders: Array<{ __typename?: 'Order', id: string }> } };

export type GuestsQueryVariables = Exact<{
  sort?: InputMaybe<GuestsSortInput>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
}>;


export type GuestsQuery = { __typename?: 'Query', guests: Array<{ __typename?: 'Guest', deviceId?: string | undefined, email?: string | undefined, firstName?: string | undefined, lastName?: string | undefined, mobile?: string | undefined, mobileCountryCode?: string | undefined, dateOfBirth?: any | undefined, countryOfResidence?: string | undefined, address?: string | undefined, nationality?: string | undefined, passportNumber?: string | undefined, dietaryRequirements?: string | undefined, company?: string | undefined, job?: string | undefined, pmsId?: string | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, bookings?: Array<{ __typename?: 'Booking', roomNumber?: string | undefined, bookingReference?: string | undefined, checkInDate?: any | undefined, checkOutDate?: any | undefined, carRegistration?: string | undefined, roomType?: string | undefined, estimatedTimeOfArrival?: string | undefined, numberOfAdults?: number | undefined, numberOfChildren?: number | undefined, clubMemberNumber?: string | undefined, purposeOfStay?: string | undefined, pmsId?: string | undefined, dateReviewed?: any | undefined, dateSubmitted?: any | undefined, dateCheckedIn?: any | undefined, dateCheckedOut?: any | undefined, dateCanceled?: any | undefined, status: BookingStatus, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, party?: Array<{ __typename?: 'BookingParty', id: string, firstName?: string | undefined, lastName?: string | undefined, ageGroup: AgeGroup, email?: string | undefined, mobile?: string | undefined, mobileCountryCode?: string | undefined, countryOfResidence?: string | undefined, address?: string | undefined, nationality?: string | undefined, passportNumber?: string | undefined, nextDestination?: string | undefined, dateOfBirth?: any | undefined, dietaryRequirements?: string | undefined, purposeOfStay?: string | undefined, specialOccasions?: string | undefined, job?: string | undefined, company?: string | undefined, pmsId?: string | undefined, carRegistration?: string | undefined }> | undefined, bookingDetails?: { __typename?: 'BookingDetails', toggleQuestion: Array<{ __typename?: 'BookingToggleQuestion', result?: string | undefined, toggle?: boolean | undefined, title: string, type: CustomFieldType }> } | undefined, guest?: { __typename?: 'Guest', mobileCountryCode?: string | undefined, email?: string | undefined, mobile?: string | undefined, lastName?: string | undefined, firstName?: string | undefined, id: string } | undefined }> | undefined, threads: Array<{ __typename?: 'Thread', id: string }>, orders: Array<{ __typename?: 'Order', id: string }> }> };

export type HmPayAccountQueryVariables = Exact<{ [key: string]: never; }>;


export type HmPayAccountQuery = { __typename?: 'Query', hmPayAccount: Array<{ __typename?: 'HMPayAccountResponse', accountNumberLast4: string, sortCode: string, dateCreated: any, payoutSchedule?: { __typename?: 'HMPayAccountPayoutSchedule', interval: PayoutInterval, date: string } | undefined }> };

export type HmPayPayoutsQueryVariables = Exact<{ [key: string]: never; }>;


export type HmPayPayoutsQuery = { __typename?: 'Query', hmPayPayouts: Array<{ __typename?: 'PayoutValueResponse', totalPrice: number, arrivalDate?: any | undefined }> };

export type HotelQueryVariables = Exact<{ [key: string]: never; }>;


export type HotelQuery = { __typename?: 'Query', hotel: { __typename?: 'Hotel', name: string, telephone: string, website: string, currencyCode: string, countryCode: string, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, address: { __typename?: 'HotelAddress', line1: string, line2: string, town: string, country: string, postalCode: string, placeId?: string | undefined, coordinates?: { __typename?: 'Coordinates', lat: number, lng: number } | undefined }, app?: { __typename?: 'HotelApp', versionCode?: number | undefined, domain?: string | undefined, disabled?: boolean | undefined, disabledReason?: string | undefined, forceUpdate?: boolean | undefined, metadata?: { __typename?: 'HotelAppMetadata', title?: string | undefined, subtitle?: string | undefined, shortDescription?: string | undefined, fullDescription?: string | undefined, keywords?: string | undefined, icon?: string | undefined, screenshots?: { __typename?: 'HotelAppScreenshots', ios: { __typename?: 'HotelAppIOSScreenshots', _1: string, _2: string, _3: string }, ios55: { __typename?: 'HotelAppIOSScreenshots', _1: string, _2: string, _3: string }, android: { __typename?: 'HotelAppAndroidScreenshots', featureGraphic: string } } | undefined, ios?: { __typename?: 'HotelAppMetadataIOS', appStoreId: string } | undefined } | undefined, assets?: { __typename?: 'HotelAppAssets', featuredImage?: string | undefined, featuredLogo?: string | undefined } | undefined, experimental?: { __typename?: 'HotelAppExperimental', hideProfile?: boolean | undefined } | undefined } | undefined, payouts?: { __typename?: 'HotelPayouts', enabled?: PayoutsStrategy | undefined, stripe?: { __typename?: 'StripeAccount', accountId: string, linked?: boolean | undefined, publicKey?: string | undefined, dateCreated: any } | undefined, hm?: { __typename?: 'HMPayAccount', accountNumberLast4: string, sortCode: string, dateCreated: any, payoutSchedule?: { __typename?: 'HMPayAccountPayoutSchedule', interval: PayoutInterval, date: string } | undefined } | undefined } | undefined, messagesSettings?: { __typename?: 'MessagesSettings', enabled?: boolean | undefined, checkedInOnly?: boolean | undefined, hideResolvedChats?: boolean | undefined, availability?: { __typename?: 'Availability', m?: { __typename?: 'DaysTime', start: string, end: string } | undefined, t?: { __typename?: 'DaysTime', start: string, end: string } | undefined, w?: { __typename?: 'DaysTime', start: string, end: string } | undefined, th?: { __typename?: 'DaysTime', start: string, end: string } | undefined, f?: { __typename?: 'DaysTime', start: string, end: string } | undefined, sa?: { __typename?: 'DaysTime', start: string, end: string } | undefined, s?: { __typename?: 'DaysTime', start: string, end: string } | undefined } | undefined, awayMessage?: { __typename?: 'MessagesAwayMessage', message?: string | undefined, showTime: boolean } | undefined } | undefined, bookingsSettings?: { __typename?: 'BookingsSettings', enabled: boolean, checkInTime: string, checkOutTime: string, maxNumberOfRooms?: number | undefined, maxPartySize?: number | undefined, contactMethods: { __typename?: 'BookingContactMethods', appMessaging?: boolean | undefined, phoneNumber?: boolean | undefined, email?: boolean | undefined }, preArrival: { __typename?: 'BookingPreArrival', minHoursBeforeCheckIn: number, email?: boolean | undefined, notifications: { __typename?: 'BookingNotifications', app?: boolean | undefined, email?: boolean | undefined, reminders?: Array<{ __typename?: 'BookingReminder', value: number, duration: ReminderDurationType }> | undefined }, fields: { __typename?: 'BookingFields', bookingReference: boolean, name: boolean, datesOfStay: boolean, estimatedTimeOfArrival: boolean, numberOfAdults: boolean, numberOfChildren: boolean, clubMemberNumber: boolean, countryOfResidence: boolean, address: boolean, nationality: boolean, dateOfBirth: boolean, dietaryRequirements: boolean, purposeOfStay?: boolean | undefined, specialOccasions: boolean, job: boolean, company: boolean, passportScan: boolean, passportNumber: boolean, foreignNationalPassportNumber?: boolean | undefined, customFields?: Array<{ __typename?: 'CustomField', title: string, type: CustomFieldType }> | undefined, party?: { __typename?: 'BookingPartyFields', adult?: { __typename?: 'BookingAdultFields', nextDestination: boolean, foreignNationalNextDestination?: boolean | undefined, job: boolean, company: boolean, name: boolean, countryOfResidence: boolean, address: boolean, nationality: boolean, passportNumber: boolean, foreignNationalPassportNumber?: boolean | undefined, mobile: boolean, email: boolean, dateOfBirth: boolean, dietaryRequirements: boolean } | undefined, child?: { __typename?: 'BookingChildFields', name: boolean, countryOfResidence: boolean, address: boolean, nationality: boolean, passportNumber: boolean, foreignNationalPassportNumber?: boolean | undefined, mobile: boolean, email: boolean, dateOfBirth: boolean, dietaryRequirements: boolean } | undefined } | undefined }, terms?: Array<{ __typename?: 'BookingTerm', message: string, link?: string | undefined }> | undefined }, arrival: { __typename?: 'BookingArrival', entryMethods: { __typename?: 'BookingEntryMethods', frontDesk?: boolean | undefined, appKey?: boolean | undefined }, instructions?: { __typename?: 'BookingInstructions', display: BookingInstructionsDisplayType, steps?: Array<string> | undefined } | undefined }, departure: { __typename?: 'BookingDeparture', notifications: { __typename?: 'BookingNotifications', app?: boolean | undefined, email?: boolean | undefined, reminders?: Array<{ __typename?: 'BookingReminder', value: number, duration: ReminderDurationType }> | undefined } }, customization: { __typename?: 'BookingCustomization', checkInStart: { __typename?: 'BookingCustomizationFields', title: string, message: string }, checkInReview: { __typename?: 'BookingCustomizationFields', title: string, message: string }, checkInSuccess: { __typename?: 'BookingCustomizationFields', title: string, message: string }, checkInUnsuccessful: { __typename?: 'BookingCustomizationFields', title: string, message: string } } } | undefined, pmsSettings?: { __typename?: 'HotelPMSSettings', pmsId?: string | undefined, mewsSettings?: { __typename?: 'HotelPMSMewsSettings', orderableServiceId: string, bookableServiceId: string } | undefined } | undefined, customLinks?: Array<{ __typename?: 'HotelCustomLink', id: string, enabled: boolean, name: string, link: string, photo?: string | undefined }> | undefined, integrations?: { __typename?: 'HotelIntegrations', mews?: { __typename?: 'HotelIntegrationsMews', provider: string, type: IntegrationType } | undefined, marketplaceApps?: Array<{ __typename?: 'HotelMarketplaceApp', id: string, name: string, type: string }> | undefined } | undefined, group: { __typename?: 'Group', id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, integrations?: { __typename?: 'GroupIntegrations', apaleo?: { __typename?: 'GroupIntegrationsApaleo', provider: IntegrationProvider, type: IntegrationType } | undefined, omnivore?: { __typename?: 'GroupIntegrationsOmnivore', type: IntegrationType } | undefined } | undefined, app?: { __typename?: 'GroupApp', aggregator?: boolean | undefined, versionCode?: number | undefined, domain?: string | undefined, disabled?: boolean | undefined, disabledReason?: string | undefined, forceUpdate?: boolean | undefined, metadata?: { __typename?: 'HotelAppMetadata', title?: string | undefined, subtitle?: string | undefined, shortDescription?: string | undefined, fullDescription?: string | undefined, keywords?: string | undefined, icon?: string | undefined, screenshots?: { __typename?: 'HotelAppScreenshots', ios: { __typename?: 'HotelAppIOSScreenshots', _1: string, _2: string, _3: string }, ios55: { __typename?: 'HotelAppIOSScreenshots', _1: string, _2: string, _3: string }, android: { __typename?: 'HotelAppAndroidScreenshots', featureGraphic: string } } | undefined, ios?: { __typename?: 'HotelAppMetadataIOS', appStoreId: string } | undefined } | undefined, assets?: { __typename?: 'HotelAppAssets', featuredImage?: string | undefined, featuredLogo?: string | undefined } | undefined, experimental?: { __typename?: 'HotelAppExperimental', hideProfile?: boolean | undefined } | undefined } | undefined } } };

export type HotelIdByDomainQueryVariables = Exact<{
  domain: Scalars['String'];
}>;


export type HotelIdByDomainQuery = { __typename?: 'Query', hotelIDByDomain: string };

export type HotelsQueryVariables = Exact<{
  groupId: Scalars['String'];
}>;


export type HotelsQuery = { __typename?: 'Query', hotels: Array<{ __typename?: 'Hotel', name: string, telephone: string, website: string, currencyCode: string, countryCode: string, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, address: { __typename?: 'HotelAddress', line1: string, line2: string, town: string, country: string, postalCode: string, placeId?: string | undefined, coordinates?: { __typename?: 'Coordinates', lat: number, lng: number } | undefined }, app?: { __typename?: 'HotelApp', versionCode?: number | undefined, domain?: string | undefined, disabled?: boolean | undefined, disabledReason?: string | undefined, forceUpdate?: boolean | undefined, metadata?: { __typename?: 'HotelAppMetadata', title?: string | undefined, subtitle?: string | undefined, shortDescription?: string | undefined, fullDescription?: string | undefined, keywords?: string | undefined, icon?: string | undefined, screenshots?: { __typename?: 'HotelAppScreenshots', ios: { __typename?: 'HotelAppIOSScreenshots', _1: string, _2: string, _3: string }, ios55: { __typename?: 'HotelAppIOSScreenshots', _1: string, _2: string, _3: string }, android: { __typename?: 'HotelAppAndroidScreenshots', featureGraphic: string } } | undefined, ios?: { __typename?: 'HotelAppMetadataIOS', appStoreId: string } | undefined } | undefined, assets?: { __typename?: 'HotelAppAssets', featuredImage?: string | undefined, featuredLogo?: string | undefined } | undefined, experimental?: { __typename?: 'HotelAppExperimental', hideProfile?: boolean | undefined } | undefined } | undefined, payouts?: { __typename?: 'HotelPayouts', enabled?: PayoutsStrategy | undefined, stripe?: { __typename?: 'StripeAccount', accountId: string, linked?: boolean | undefined, publicKey?: string | undefined, dateCreated: any } | undefined, hm?: { __typename?: 'HMPayAccount', accountNumberLast4: string, sortCode: string, dateCreated: any, payoutSchedule?: { __typename?: 'HMPayAccountPayoutSchedule', interval: PayoutInterval, date: string } | undefined } | undefined } | undefined, messagesSettings?: { __typename?: 'MessagesSettings', enabled?: boolean | undefined, checkedInOnly?: boolean | undefined, hideResolvedChats?: boolean | undefined, availability?: { __typename?: 'Availability', m?: { __typename?: 'DaysTime', start: string, end: string } | undefined, t?: { __typename?: 'DaysTime', start: string, end: string } | undefined, w?: { __typename?: 'DaysTime', start: string, end: string } | undefined, th?: { __typename?: 'DaysTime', start: string, end: string } | undefined, f?: { __typename?: 'DaysTime', start: string, end: string } | undefined, sa?: { __typename?: 'DaysTime', start: string, end: string } | undefined, s?: { __typename?: 'DaysTime', start: string, end: string } | undefined } | undefined, awayMessage?: { __typename?: 'MessagesAwayMessage', message?: string | undefined, showTime: boolean } | undefined } | undefined, bookingsSettings?: { __typename?: 'BookingsSettings', enabled: boolean, checkInTime: string, checkOutTime: string, maxNumberOfRooms?: number | undefined, maxPartySize?: number | undefined, contactMethods: { __typename?: 'BookingContactMethods', appMessaging?: boolean | undefined, phoneNumber?: boolean | undefined, email?: boolean | undefined }, preArrival: { __typename?: 'BookingPreArrival', minHoursBeforeCheckIn: number, email?: boolean | undefined, notifications: { __typename?: 'BookingNotifications', app?: boolean | undefined, email?: boolean | undefined, reminders?: Array<{ __typename?: 'BookingReminder', value: number, duration: ReminderDurationType }> | undefined }, fields: { __typename?: 'BookingFields', bookingReference: boolean, name: boolean, datesOfStay: boolean, estimatedTimeOfArrival: boolean, numberOfAdults: boolean, numberOfChildren: boolean, clubMemberNumber: boolean, countryOfResidence: boolean, address: boolean, nationality: boolean, dateOfBirth: boolean, dietaryRequirements: boolean, purposeOfStay?: boolean | undefined, specialOccasions: boolean, job: boolean, company: boolean, passportScan: boolean, passportNumber: boolean, foreignNationalPassportNumber?: boolean | undefined, customFields?: Array<{ __typename?: 'CustomField', title: string, type: CustomFieldType }> | undefined, party?: { __typename?: 'BookingPartyFields', adult?: { __typename?: 'BookingAdultFields', nextDestination: boolean, foreignNationalNextDestination?: boolean | undefined, job: boolean, company: boolean, name: boolean, countryOfResidence: boolean, address: boolean, nationality: boolean, passportNumber: boolean, foreignNationalPassportNumber?: boolean | undefined, mobile: boolean, email: boolean, dateOfBirth: boolean, dietaryRequirements: boolean } | undefined, child?: { __typename?: 'BookingChildFields', name: boolean, countryOfResidence: boolean, address: boolean, nationality: boolean, passportNumber: boolean, foreignNationalPassportNumber?: boolean | undefined, mobile: boolean, email: boolean, dateOfBirth: boolean, dietaryRequirements: boolean } | undefined } | undefined }, terms?: Array<{ __typename?: 'BookingTerm', message: string, link?: string | undefined }> | undefined }, arrival: { __typename?: 'BookingArrival', entryMethods: { __typename?: 'BookingEntryMethods', frontDesk?: boolean | undefined, appKey?: boolean | undefined }, instructions?: { __typename?: 'BookingInstructions', display: BookingInstructionsDisplayType, steps?: Array<string> | undefined } | undefined }, departure: { __typename?: 'BookingDeparture', notifications: { __typename?: 'BookingNotifications', app?: boolean | undefined, email?: boolean | undefined, reminders?: Array<{ __typename?: 'BookingReminder', value: number, duration: ReminderDurationType }> | undefined } }, customization: { __typename?: 'BookingCustomization', checkInStart: { __typename?: 'BookingCustomizationFields', title: string, message: string }, checkInReview: { __typename?: 'BookingCustomizationFields', title: string, message: string }, checkInSuccess: { __typename?: 'BookingCustomizationFields', title: string, message: string }, checkInUnsuccessful: { __typename?: 'BookingCustomizationFields', title: string, message: string } } } | undefined, pmsSettings?: { __typename?: 'HotelPMSSettings', pmsId?: string | undefined, mewsSettings?: { __typename?: 'HotelPMSMewsSettings', orderableServiceId: string, bookableServiceId: string } | undefined } | undefined, customLinks?: Array<{ __typename?: 'HotelCustomLink', id: string, enabled: boolean, name: string, link: string, photo?: string | undefined }> | undefined, integrations?: { __typename?: 'HotelIntegrations', mews?: { __typename?: 'HotelIntegrationsMews', provider: string, type: IntegrationType } | undefined, marketplaceApps?: Array<{ __typename?: 'HotelMarketplaceApp', id: string, name: string, type: string }> | undefined } | undefined, group: { __typename?: 'Group', id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, integrations?: { __typename?: 'GroupIntegrations', apaleo?: { __typename?: 'GroupIntegrationsApaleo', provider: IntegrationProvider, type: IntegrationType } | undefined, omnivore?: { __typename?: 'GroupIntegrationsOmnivore', type: IntegrationType } | undefined } | undefined, app?: { __typename?: 'GroupApp', aggregator?: boolean | undefined, versionCode?: number | undefined, domain?: string | undefined, disabled?: boolean | undefined, disabledReason?: string | undefined, forceUpdate?: boolean | undefined, metadata?: { __typename?: 'HotelAppMetadata', title?: string | undefined, subtitle?: string | undefined, shortDescription?: string | undefined, fullDescription?: string | undefined, keywords?: string | undefined, icon?: string | undefined, screenshots?: { __typename?: 'HotelAppScreenshots', ios: { __typename?: 'HotelAppIOSScreenshots', _1: string, _2: string, _3: string }, ios55: { __typename?: 'HotelAppIOSScreenshots', _1: string, _2: string, _3: string }, android: { __typename?: 'HotelAppAndroidScreenshots', featureGraphic: string } } | undefined, ios?: { __typename?: 'HotelAppMetadataIOS', appStoreId: string } | undefined } | undefined, assets?: { __typename?: 'HotelAppAssets', featuredImage?: string | undefined, featuredLogo?: string | undefined } | undefined, experimental?: { __typename?: 'HotelAppExperimental', hideProfile?: boolean | undefined } | undefined } | undefined } }> };

export type MarketplaceAppQueryVariables = Exact<{
  live?: InputMaybe<Scalars['Boolean']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
  where: GetMarketplaceAppWhereInput;
}>;


export type MarketplaceAppQuery = { __typename?: 'Query', marketplaceApp?: { __typename?: 'MarketplaceApp', name: string, description: string, type: IntegrationType, logo: string, websiteURL: string, documentationURL: string, helpURL: string, redirectURLs: Array<string>, connectLink: string, live: boolean, enabled: boolean, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, developer: { __typename?: 'User', id: string } } | undefined };

export type MarketplaceAppSubscriptionsQueryVariables = Exact<{ [key: string]: never; }>;


export type MarketplaceAppSubscriptionsQuery = { __typename?: 'Query', marketplaceAppSubscriptions: Array<{ __typename?: 'HotelMarketplaceAppSubscription', id: string, endpoint: string, topics: Array<HotelMarketplaceAppSubscriptionTopic> }> };

export type MarketplaceAppsQueryVariables = Exact<{
  live?: InputMaybe<Scalars['Boolean']>;
  enabled?: InputMaybe<Scalars['Boolean']>;
}>;


export type MarketplaceAppsQuery = { __typename?: 'Query', marketplaceApps: Array<{ __typename?: 'MarketplaceApp', name: string, description: string, type: IntegrationType, logo: string, websiteURL: string, documentationURL: string, helpURL: string, redirectURLs: Array<string>, connectLink: string, live: boolean, enabled: boolean, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, developer: { __typename?: 'User', id: string } }> };

export type MessagesQueryVariables = Exact<{
  sort?: InputMaybe<OrdersSortInput>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  threadId: Scalars['String'];
}>;


export type MessagesQuery = { __typename?: 'Query', messages: Array<{ __typename?: 'Message', text: string, author: MessageAuthor, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, thread: { __typename?: 'Thread', resolved?: boolean | undefined, dateUpdated: any, dateCreated: any, id: string, guest: { __typename?: 'Guest', firstName?: string | undefined, email?: string | undefined, id: string, lastName?: string | undefined } } }> };

export type MewsServicesQueryVariables = Exact<{ [key: string]: never; }>;


export type MewsServicesQuery = { __typename?: 'Query', mewsServices: Array<{ __typename?: 'MewsServiceResponse', id: string, name: string, type: string }> };

export type OmnivoreDiscountsQueryVariables = Exact<{
  locationId: Scalars['String'];
}>;


export type OmnivoreDiscountsQuery = { __typename?: 'Query', omnivoreDiscounts: Array<{ __typename?: 'OmnivoreDiscountsResponse', id: string, value: number, name: string, available?: boolean | undefined, order?: boolean | undefined, item?: boolean | undefined, open?: boolean | undefined, maxAmount?: number | undefined, minAmount?: number | undefined, maxPercent?: number | undefined, minPercent?: number | undefined, minOrderAmount?: number | undefined, type: PricelistMultiplierType, posId?: string | undefined }> };

export type OmnivoreLocationsQueryVariables = Exact<{ [key: string]: never; }>;


export type OmnivoreLocationsQuery = { __typename?: 'Query', omnivoreLocations: Array<{ __typename?: 'OmnivoreLocationsResponse', id: string, provider: string }> };

export type OmnivoreOptionsQueryVariables = Exact<{
  locationId: Scalars['String'];
}>;


export type OmnivoreOptionsQuery = { __typename?: 'Query', omnivoreOptions: { __typename?: 'OmnivoreOptionsResponse', employees: Array<{ __typename?: 'OmnivoreOption', id: string, name: string }>, orderTypes: Array<{ __typename?: 'OmnivoreOption', id: string, name: string }>, revenueCenters: Array<{ __typename?: 'OmnivoreOption', id: string, name: string }> } };

export type OmnivoreTablesQueryVariables = Exact<{
  locationId: Scalars['String'];
}>;


export type OmnivoreTablesQuery = { __typename?: 'Query', omnivoreTables: Array<{ __typename?: 'OmnivoreOption', id: string, name: string }> };

export type OrderQueryVariables = Exact<{
  where: WhereInputType;
}>;


export type OrderQuery = { __typename?: 'Query', order: { __typename?: 'Order', dateApproved?: any | undefined, dateReady?: any | undefined, dateCompleted?: any | undefined, dateScheduled?: any | undefined, totalPrice: number, roomNumber: string, notes?: string | undefined, paymentProvider?: PayoutsStrategy | undefined, paymentType: PaymentType, orderReference?: string | undefined, posId?: string | undefined, subtotal: number, reasonRejected?: string | undefined, rejected?: boolean | undefined, delivery?: PricelistDeliveryType | undefined, collection?: PricelistCollectionType | undefined, paid?: boolean | undefined, status: OrderStatus, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, items: Array<{ __typename?: 'OrderItem', id: string, name: string, posId?: string | undefined, quantity: number, totalPrice: number, modifiers: Array<{ __typename?: 'OrderItemModifier', id: string, name: string, posId?: string | undefined, options: Array<{ __typename?: 'OrderItemOption', id: string, name: string, posId?: string | undefined, price: number }> }>, discount?: { __typename?: 'PriceMultiplier', id: string, posId?: string | undefined, value: number, type: PricelistMultiplierType, name: string } | undefined, posSettings?: { __typename?: 'PricelistPOSSettingsFulfilment', posId: string, name: string } | undefined, omnivoreSettings?: { __typename?: 'OrderItemPOSSettings', tableService?: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number } | undefined, roomService?: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number } | undefined } | undefined }>, cardDetails?: { __typename?: 'CardDetails', id?: string | undefined, country?: string | undefined, brand: string, last4: string } | undefined, discount?: { __typename?: 'PriceMultiplier', id: string, posId?: string | undefined, value: number, type: PricelistMultiplierType, name: string } | undefined, surcharges?: Array<{ __typename?: 'PriceMultiplier', id: string, posId?: string | undefined, value: number, type: PricelistMultiplierType, name: string }> | undefined, feedback?: { __typename?: 'OrderFeedback', rating?: number | undefined } | undefined, guest: { __typename?: 'Guest', lastName?: string | undefined, firstName?: string | undefined, id: string }, space: { __typename?: 'Space', name: string, id: string }, pricelist: { __typename?: 'Pricelist', name: string, id: string }, thread?: { __typename?: 'Thread', id: string } | undefined } };

export type OrdersQueryVariables = Exact<{
  sort?: InputMaybe<OrdersSortInput>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  guestId?: InputMaybe<Scalars['String']>;
  completed?: InputMaybe<Scalars['Boolean']>;
  rejected?: InputMaybe<Scalars['Boolean']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
}>;


export type OrdersQuery = { __typename?: 'Query', orders: Array<{ __typename?: 'Order', dateApproved?: any | undefined, dateReady?: any | undefined, dateCompleted?: any | undefined, dateScheduled?: any | undefined, totalPrice: number, roomNumber: string, notes?: string | undefined, paymentProvider?: PayoutsStrategy | undefined, paymentType: PaymentType, orderReference?: string | undefined, posId?: string | undefined, subtotal: number, reasonRejected?: string | undefined, rejected?: boolean | undefined, delivery?: PricelistDeliveryType | undefined, collection?: PricelistCollectionType | undefined, paid?: boolean | undefined, status: OrderStatus, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, items: Array<{ __typename?: 'OrderItem', id: string, name: string, posId?: string | undefined, quantity: number, totalPrice: number, modifiers: Array<{ __typename?: 'OrderItemModifier', id: string, name: string, posId?: string | undefined, options: Array<{ __typename?: 'OrderItemOption', id: string, name: string, posId?: string | undefined, price: number }> }>, discount?: { __typename?: 'PriceMultiplier', id: string, posId?: string | undefined, value: number, type: PricelistMultiplierType, name: string } | undefined, posSettings?: { __typename?: 'PricelistPOSSettingsFulfilment', posId: string, name: string } | undefined, omnivoreSettings?: { __typename?: 'OrderItemPOSSettings', tableService?: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number } | undefined, roomService?: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number } | undefined } | undefined }>, cardDetails?: { __typename?: 'CardDetails', id?: string | undefined, country?: string | undefined, brand: string, last4: string } | undefined, discount?: { __typename?: 'PriceMultiplier', id: string, posId?: string | undefined, value: number, type: PricelistMultiplierType, name: string } | undefined, surcharges?: Array<{ __typename?: 'PriceMultiplier', id: string, posId?: string | undefined, value: number, type: PricelistMultiplierType, name: string }> | undefined, feedback?: { __typename?: 'OrderFeedback', rating?: number | undefined } | undefined, guest: { __typename?: 'Guest', lastName?: string | undefined, firstName?: string | undefined, id: string }, space: { __typename?: 'Space', name: string, id: string }, pricelist: { __typename?: 'Pricelist', name: string, id: string }, thread?: { __typename?: 'Thread', id: string } | undefined }> };

export type OutstandingGuestsQueryVariables = Exact<{
  guestId?: InputMaybe<Scalars['String']>;
  completed?: InputMaybe<Scalars['Boolean']>;
  rejected?: InputMaybe<Scalars['Boolean']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
  sort?: InputMaybe<OrdersSortInput>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  paymentType?: InputMaybe<PaymentType>;
}>;


export type OutstandingGuestsQuery = { __typename?: 'Query', outstandingGuests: { __typename?: 'OutstandingGuestsResponse', count: number, data: Array<{ __typename?: 'OutstandingGuest', noOrders: number, totalPrice: number, guest: { __typename?: 'Guest', lastName?: string | undefined, firstName?: string | undefined, id: string } }> } };

export type OutstandingOrdersStatisticsQueryVariables = Exact<{ [key: string]: never; }>;


export type OutstandingOrdersStatisticsQuery = { __typename?: 'Query', outstandingOrdersStatistics: { __typename?: 'OutstandingOrdersStatisticsResponse', cash: { __typename?: 'OutstandingOrdersStatistics', paymentType: PaymentType, noOrders: number, totalPrice: number, noGuests: number }, roomBill: { __typename?: 'OutstandingOrdersStatistics', paymentType: PaymentType, noOrders: number, totalPrice: number, noGuests: number } } };

export type PricelistQueryVariables = Exact<{
  where: WhereInputType;
}>;


export type PricelistQuery = { __typename?: 'Query', pricelist: { __typename?: 'Pricelist', name: string, description?: string | undefined, commerce?: boolean | undefined, autoApprove?: boolean | undefined, feedback?: boolean | undefined, posId?: string | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, availability: { __typename?: 'Availability', m?: { __typename?: 'DaysTime', start: string, end: string } | undefined, t?: { __typename?: 'DaysTime', start: string, end: string } | undefined, w?: { __typename?: 'DaysTime', start: string, end: string } | undefined, th?: { __typename?: 'DaysTime', start: string, end: string } | undefined, f?: { __typename?: 'DaysTime', start: string, end: string } | undefined, sa?: { __typename?: 'DaysTime', start: string, end: string } | undefined, s?: { __typename?: 'DaysTime', start: string, end: string } | undefined }, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, catalog?: { __typename?: 'PricelistCatalog', categories: Array<{ __typename?: 'PricelistCategory', id: string, name: string, description?: string | undefined, posId?: string | undefined, items: Array<{ __typename?: 'PricelistItem', id: string, name: string, description?: string | undefined, photos?: Array<string> | undefined, regularPrice: number, roomServicePrice: number, note?: string | undefined, posId?: string | undefined, snoozed?: boolean | undefined, modifiers: Array<{ __typename?: 'PricelistItemModifier', id: string, name: string, posId?: string | undefined, required: boolean, maxSelection: number, options: Array<{ __typename?: 'PricelistItemOption', id: string, name: string, posId?: string | undefined, price: number }> }>, posSettings?: { __typename?: 'PricelistItemPOSSettings', roomService: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number }, tableService: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number }, priceLevels?: Array<{ __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number }> | undefined } | undefined, labels?: Array<{ __typename?: 'PricelistLabel', id: string, name: string }> | undefined, promotions?: { __typename?: 'PricelistPromotions', discounts?: Array<{ __typename?: 'PricelistDiscount', id: string, name: string, value: number, available?: boolean | undefined, level?: PricelistDiscountLevel | undefined, minOrderAmount?: number | undefined, type: PricelistMultiplierType, posId?: string | undefined, count?: number | undefined, posSettings?: { __typename?: 'PricelistDiscountPOSSettings', open?: boolean | undefined } | undefined, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined }> | undefined } | undefined }> }>, labels?: Array<{ __typename?: 'PricelistLabel', id: string, name: string }> | undefined } | undefined, posSettings?: { __typename?: 'PricelistPOSSettings', enabled?: boolean | undefined, posId?: string | undefined, revenueCenterId?: string | undefined, employeeId?: string | undefined, provider?: string | undefined, tableService: { __typename?: 'PricelistPOSSettingsFulfilment', posId: string, name: string }, roomService: { __typename?: 'PricelistPOSSettingsFulfilment', posId: string, name: string } } | undefined, promotions?: { __typename?: 'PricelistPromotions', discounts?: Array<{ __typename?: 'PricelistDiscount', id: string, name: string, value: number, available?: boolean | undefined, level?: PricelistDiscountLevel | undefined, minOrderAmount?: number | undefined, type: PricelistMultiplierType, posId?: string | undefined, count?: number | undefined, posSettings?: { __typename?: 'PricelistDiscountPOSSettings', open?: boolean | undefined } | undefined, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined }> | undefined } | undefined, surcharges?: Array<{ __typename?: 'PricelistSurcharge', id: string, name: string, value: number, type: PricelistMultiplierType, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined }> | undefined, enabledPayments?: { __typename?: 'PricelistEnabledPayments', card?: boolean | undefined, roomBill?: boolean | undefined, cash?: boolean | undefined } | undefined, space: { __typename?: 'Space', name: string, location: string, enabled?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, availability: { __typename?: 'Availability', m?: { __typename?: 'DaysTime', start: string, end: string } | undefined, t?: { __typename?: 'DaysTime', start: string, end: string } | undefined, w?: { __typename?: 'DaysTime', start: string, end: string } | undefined, th?: { __typename?: 'DaysTime', start: string, end: string } | undefined, f?: { __typename?: 'DaysTime', start: string, end: string } | undefined, sa?: { __typename?: 'DaysTime', start: string, end: string } | undefined, s?: { __typename?: 'DaysTime', start: string, end: string } | undefined } } } };

export type PricelistFeedbackQueryVariables = Exact<{
  where: WhereInputType;
}>;


export type PricelistFeedbackQuery = { __typename?: 'Query', pricelistFeedback: { __typename?: 'PricelistFeedback', averageRating: number, noReviews: number, recentOrders: Array<{ __typename?: 'Order', dateApproved?: any | undefined, dateReady?: any | undefined, dateCompleted?: any | undefined, dateScheduled?: any | undefined, totalPrice: number, roomNumber: string, notes?: string | undefined, paymentProvider?: PayoutsStrategy | undefined, paymentType: PaymentType, orderReference?: string | undefined, posId?: string | undefined, subtotal: number, reasonRejected?: string | undefined, rejected?: boolean | undefined, delivery?: PricelistDeliveryType | undefined, collection?: PricelistCollectionType | undefined, paid?: boolean | undefined, status: OrderStatus, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, items: Array<{ __typename?: 'OrderItem', id: string, name: string, posId?: string | undefined, quantity: number, totalPrice: number, modifiers: Array<{ __typename?: 'OrderItemModifier', id: string, name: string, posId?: string | undefined, options: Array<{ __typename?: 'OrderItemOption', id: string, name: string, posId?: string | undefined, price: number }> }>, discount?: { __typename?: 'PriceMultiplier', id: string, posId?: string | undefined, value: number, type: PricelistMultiplierType, name: string } | undefined, posSettings?: { __typename?: 'PricelistPOSSettingsFulfilment', posId: string, name: string } | undefined, omnivoreSettings?: { __typename?: 'OrderItemPOSSettings', tableService?: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number } | undefined, roomService?: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number } | undefined } | undefined }>, cardDetails?: { __typename?: 'CardDetails', id?: string | undefined, country?: string | undefined, brand: string, last4: string } | undefined, discount?: { __typename?: 'PriceMultiplier', id: string, posId?: string | undefined, value: number, type: PricelistMultiplierType, name: string } | undefined, surcharges?: Array<{ __typename?: 'PriceMultiplier', id: string, posId?: string | undefined, value: number, type: PricelistMultiplierType, name: string }> | undefined, feedback?: { __typename?: 'OrderFeedback', rating?: number | undefined } | undefined, guest: { __typename?: 'Guest', lastName?: string | undefined, firstName?: string | undefined, id: string }, space: { __typename?: 'Space', name: string, id: string }, pricelist: { __typename?: 'Pricelist', name: string, id: string }, thread?: { __typename?: 'Thread', id: string } | undefined }>, ratings: Array<{ __typename?: 'PricelistFeedbackRating', value: number, count: number, percentage: number }> } };

export type PricelistsQueryVariables = Exact<{ [key: string]: never; }>;


export type PricelistsQuery = { __typename?: 'Query', pricelists: Array<{ __typename?: 'Pricelist', name: string, description?: string | undefined, commerce?: boolean | undefined, autoApprove?: boolean | undefined, feedback?: boolean | undefined, posId?: string | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, availability: { __typename?: 'Availability', m?: { __typename?: 'DaysTime', start: string, end: string } | undefined, t?: { __typename?: 'DaysTime', start: string, end: string } | undefined, w?: { __typename?: 'DaysTime', start: string, end: string } | undefined, th?: { __typename?: 'DaysTime', start: string, end: string } | undefined, f?: { __typename?: 'DaysTime', start: string, end: string } | undefined, sa?: { __typename?: 'DaysTime', start: string, end: string } | undefined, s?: { __typename?: 'DaysTime', start: string, end: string } | undefined }, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, catalog?: { __typename?: 'PricelistCatalog', categories: Array<{ __typename?: 'PricelistCategory', id: string, name: string, description?: string | undefined, posId?: string | undefined, items: Array<{ __typename?: 'PricelistItem', id: string, name: string, description?: string | undefined, photos?: Array<string> | undefined, regularPrice: number, roomServicePrice: number, note?: string | undefined, posId?: string | undefined, snoozed?: boolean | undefined, modifiers: Array<{ __typename?: 'PricelistItemModifier', id: string, name: string, posId?: string | undefined, required: boolean, maxSelection: number, options: Array<{ __typename?: 'PricelistItemOption', id: string, name: string, posId?: string | undefined, price: number }> }>, posSettings?: { __typename?: 'PricelistItemPOSSettings', roomService: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number }, tableService: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number }, priceLevels?: Array<{ __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number }> | undefined } | undefined, labels?: Array<{ __typename?: 'PricelistLabel', id: string, name: string }> | undefined, promotions?: { __typename?: 'PricelistPromotions', discounts?: Array<{ __typename?: 'PricelistDiscount', id: string, name: string, value: number, available?: boolean | undefined, level?: PricelistDiscountLevel | undefined, minOrderAmount?: number | undefined, type: PricelistMultiplierType, posId?: string | undefined, count?: number | undefined, posSettings?: { __typename?: 'PricelistDiscountPOSSettings', open?: boolean | undefined } | undefined, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined }> | undefined } | undefined }> }>, labels?: Array<{ __typename?: 'PricelistLabel', id: string, name: string }> | undefined } | undefined, posSettings?: { __typename?: 'PricelistPOSSettings', enabled?: boolean | undefined, posId?: string | undefined, revenueCenterId?: string | undefined, employeeId?: string | undefined, provider?: string | undefined, tableService: { __typename?: 'PricelistPOSSettingsFulfilment', posId: string, name: string }, roomService: { __typename?: 'PricelistPOSSettingsFulfilment', posId: string, name: string } } | undefined, promotions?: { __typename?: 'PricelistPromotions', discounts?: Array<{ __typename?: 'PricelistDiscount', id: string, name: string, value: number, available?: boolean | undefined, level?: PricelistDiscountLevel | undefined, minOrderAmount?: number | undefined, type: PricelistMultiplierType, posId?: string | undefined, count?: number | undefined, posSettings?: { __typename?: 'PricelistDiscountPOSSettings', open?: boolean | undefined } | undefined, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined }> | undefined } | undefined, surcharges?: Array<{ __typename?: 'PricelistSurcharge', id: string, name: string, value: number, type: PricelistMultiplierType, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined }> | undefined, enabledPayments?: { __typename?: 'PricelistEnabledPayments', card?: boolean | undefined, roomBill?: boolean | undefined, cash?: boolean | undefined } | undefined, space: { __typename?: 'Space', name: string, location: string, enabled?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, availability: { __typename?: 'Availability', m?: { __typename?: 'DaysTime', start: string, end: string } | undefined, t?: { __typename?: 'DaysTime', start: string, end: string } | undefined, w?: { __typename?: 'DaysTime', start: string, end: string } | undefined, th?: { __typename?: 'DaysTime', start: string, end: string } | undefined, f?: { __typename?: 'DaysTime', start: string, end: string } | undefined, sa?: { __typename?: 'DaysTime', start: string, end: string } | undefined, s?: { __typename?: 'DaysTime', start: string, end: string } | undefined } } }> };

export type ProductQueryVariables = Exact<{
  where: WhereInputType;
}>;


export type ProductQuery = { __typename?: 'Query', product: { __typename?: 'Product', name: string, code: string, stock: number, sellPrice: number, costPrice: number, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any } };

export type ProductsQueryVariables = Exact<{ [key: string]: never; }>;


export type ProductsQuery = { __typename?: 'Query', products: Array<{ __typename?: 'Product', name: string, code: string, stock: number, sellPrice: number, costPrice: number, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any }> };

export type SaleQueryVariables = Exact<{
  where: WhereInputType;
}>;


export type SaleQuery = { __typename?: 'Query', sale: { __typename?: 'Sale', totalPrice: number, salesReference?: string | undefined, subtotal: number, cancelled?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, items: Array<{ __typename?: 'SaleItem', id: string, productId: string, title: string, quantity: number, totalSell: number, totalCost: number }>, customer: { __typename?: 'Customer', address: string, phone: string, nic: string, lastName: string, firstName: string, id: string }, instalmentPlan: { __typename?: 'SaleInstalmentPlan', noTerms: number, initialPayment: number, terms: Array<{ __typename?: 'SaleInstalmentTerm', id: string, dueDate?: any | undefined, dueAmount: number, paidAmount: number, completed: boolean }> } } };

export type SalesQueryVariables = Exact<{
  sort?: InputMaybe<SalesSortInput>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  guestId?: InputMaybe<Scalars['String']>;
  completed?: InputMaybe<Scalars['Boolean']>;
  rejected?: InputMaybe<Scalars['Boolean']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
}>;


export type SalesQuery = { __typename?: 'Query', sales: Array<{ __typename?: 'Sale', totalPrice: number, salesReference?: string | undefined, subtotal: number, cancelled?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, items: Array<{ __typename?: 'SaleItem', id: string, productId: string, title: string, quantity: number, totalSell: number, totalCost: number }>, customer: { __typename?: 'Customer', address: string, phone: string, nic: string, lastName: string, firstName: string, id: string }, instalmentPlan: { __typename?: 'SaleInstalmentPlan', noTerms: number, initialPayment: number, terms: Array<{ __typename?: 'SaleInstalmentTerm', id: string, dueDate?: any | undefined, dueAmount: number, paidAmount: number, completed: boolean }> } }> };

export type SearchBookingsQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  status?: InputMaybe<Scalars['String']>;
  startCheckInDate?: InputMaybe<Scalars['DateTime']>;
  startCheckOutDate?: InputMaybe<Scalars['DateTime']>;
  endCheckInDate?: InputMaybe<Scalars['DateTime']>;
  endCheckOutDate?: InputMaybe<Scalars['DateTime']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
}>;


export type SearchBookingsQuery = { __typename?: 'Query', searchBookings: { __typename?: 'SearchBookingsResponse', count: number, data: Array<{ __typename?: 'Booking', roomNumber?: string | undefined, bookingReference?: string | undefined, checkInDate?: any | undefined, checkOutDate?: any | undefined, carRegistration?: string | undefined, roomType?: string | undefined, estimatedTimeOfArrival?: string | undefined, numberOfAdults?: number | undefined, numberOfChildren?: number | undefined, clubMemberNumber?: string | undefined, purposeOfStay?: string | undefined, pmsId?: string | undefined, dateReviewed?: any | undefined, dateSubmitted?: any | undefined, dateCheckedIn?: any | undefined, dateCheckedOut?: any | undefined, dateCanceled?: any | undefined, status: BookingStatus, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, party?: Array<{ __typename?: 'BookingParty', id: string, firstName?: string | undefined, lastName?: string | undefined, ageGroup: AgeGroup, email?: string | undefined, mobile?: string | undefined, mobileCountryCode?: string | undefined, countryOfResidence?: string | undefined, address?: string | undefined, nationality?: string | undefined, passportNumber?: string | undefined, nextDestination?: string | undefined, dateOfBirth?: any | undefined, dietaryRequirements?: string | undefined, purposeOfStay?: string | undefined, specialOccasions?: string | undefined, job?: string | undefined, company?: string | undefined, pmsId?: string | undefined, carRegistration?: string | undefined }> | undefined, bookingDetails?: { __typename?: 'BookingDetails', toggleQuestion: Array<{ __typename?: 'BookingToggleQuestion', result?: string | undefined, toggle?: boolean | undefined, title: string, type: CustomFieldType }> } | undefined, guest?: { __typename?: 'Guest', mobileCountryCode?: string | undefined, email?: string | undefined, mobile?: string | undefined, lastName?: string | undefined, firstName?: string | undefined, id: string } | undefined }> } };

export type SearchCustomAttractionPlaceQueryVariables = Exact<{
  query: Scalars['String'];
}>;


export type SearchCustomAttractionPlaceQuery = { __typename?: 'Query', searchCustomAttractionPlace: Array<{ __typename?: 'SearchCustomAttractionPlaceResponse', placeId: string, title: string, description: string }> };

export type SearchCustomersQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  outOfStockItems?: InputMaybe<Scalars['Boolean']>;
}>;


export type SearchCustomersQuery = { __typename?: 'Query', searchCustomers: { __typename?: 'SearchCustomersResponse', count: number, data: Array<{ __typename?: 'Customer', firstName: string, lastName: string, nic: string, phone: string, address: string, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any }> } };

export type SearchGuestsQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  anonGuests?: InputMaybe<Scalars['Boolean']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
}>;


export type SearchGuestsQuery = { __typename?: 'Query', searchGuests: { __typename?: 'SearchGuestsResponse', count: number, data: Array<{ __typename?: 'Guest', email?: string | undefined, firstName?: string | undefined, lastName?: string | undefined, mobile?: string | undefined, mobileCountryCode?: string | undefined, dateOfBirth?: any | undefined, countryOfResidence?: string | undefined, address?: string | undefined, nationality?: string | undefined, passportNumber?: string | undefined, dietaryRequirements?: string | undefined, company?: string | undefined, job?: string | undefined, pmsId?: string | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any }> } };

export type SearchOrdersQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
}>;


export type SearchOrdersQuery = { __typename?: 'Query', searchOrders: { __typename?: 'SearchOrdersResponse', count: number, data: Array<{ __typename?: 'Order', dateApproved?: any | undefined, dateReady?: any | undefined, dateCompleted?: any | undefined, dateScheduled?: any | undefined, totalPrice: number, roomNumber: string, notes?: string | undefined, paymentProvider?: PayoutsStrategy | undefined, paymentType: PaymentType, orderReference?: string | undefined, posId?: string | undefined, subtotal: number, reasonRejected?: string | undefined, rejected?: boolean | undefined, delivery?: PricelistDeliveryType | undefined, collection?: PricelistCollectionType | undefined, paid?: boolean | undefined, status: OrderStatus, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, items: Array<{ __typename?: 'OrderItem', id: string, name: string, posId?: string | undefined, quantity: number, totalPrice: number, modifiers: Array<{ __typename?: 'OrderItemModifier', id: string, name: string, posId?: string | undefined, options: Array<{ __typename?: 'OrderItemOption', id: string, name: string, posId?: string | undefined, price: number }> }>, discount?: { __typename?: 'PriceMultiplier', id: string, posId?: string | undefined, value: number, type: PricelistMultiplierType, name: string } | undefined, posSettings?: { __typename?: 'PricelistPOSSettingsFulfilment', posId: string, name: string } | undefined, omnivoreSettings?: { __typename?: 'OrderItemPOSSettings', tableService?: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number } | undefined, roomService?: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number } | undefined } | undefined }>, cardDetails?: { __typename?: 'CardDetails', id?: string | undefined, country?: string | undefined, brand: string, last4: string } | undefined, discount?: { __typename?: 'PriceMultiplier', id: string, posId?: string | undefined, value: number, type: PricelistMultiplierType, name: string } | undefined, surcharges?: Array<{ __typename?: 'PriceMultiplier', id: string, posId?: string | undefined, value: number, type: PricelistMultiplierType, name: string }> | undefined, feedback?: { __typename?: 'OrderFeedback', rating?: number | undefined } | undefined, guest: { __typename?: 'Guest', mobile?: string | undefined, mobileCountryCode?: string | undefined, lastName?: string | undefined, firstName?: string | undefined, id: string }, space: { __typename?: 'Space', name: string, id: string }, pricelist: { __typename?: 'Pricelist', name: string, id: string }, thread?: { __typename?: 'Thread', id: string } | undefined }> } };

export type SearchOutstandingOrdersQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  guestId?: InputMaybe<Scalars['String']>;
  paymentType?: InputMaybe<PaymentType>;
}>;


export type SearchOutstandingOrdersQuery = { __typename?: 'Query', searchOutstandingOrders: { __typename?: 'SearchOutstandingOrdersResponse', count: number, data: Array<{ __typename?: 'Order', dateApproved?: any | undefined, dateReady?: any | undefined, dateCompleted?: any | undefined, dateScheduled?: any | undefined, totalPrice: number, roomNumber: string, notes?: string | undefined, paymentProvider?: PayoutsStrategy | undefined, paymentType: PaymentType, orderReference?: string | undefined, posId?: string | undefined, subtotal: number, reasonRejected?: string | undefined, rejected?: boolean | undefined, delivery?: PricelistDeliveryType | undefined, collection?: PricelistCollectionType | undefined, paid?: boolean | undefined, status: OrderStatus, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, items: Array<{ __typename?: 'OrderItem', id: string, name: string, posId?: string | undefined, quantity: number, totalPrice: number, modifiers: Array<{ __typename?: 'OrderItemModifier', id: string, name: string, posId?: string | undefined, options: Array<{ __typename?: 'OrderItemOption', id: string, name: string, posId?: string | undefined, price: number }> }>, discount?: { __typename?: 'PriceMultiplier', id: string, posId?: string | undefined, value: number, type: PricelistMultiplierType, name: string } | undefined, posSettings?: { __typename?: 'PricelistPOSSettingsFulfilment', posId: string, name: string } | undefined, omnivoreSettings?: { __typename?: 'OrderItemPOSSettings', tableService?: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number } | undefined, roomService?: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number } | undefined } | undefined }>, cardDetails?: { __typename?: 'CardDetails', id?: string | undefined, country?: string | undefined, brand: string, last4: string } | undefined, discount?: { __typename?: 'PriceMultiplier', id: string, posId?: string | undefined, value: number, type: PricelistMultiplierType, name: string } | undefined, surcharges?: Array<{ __typename?: 'PriceMultiplier', id: string, posId?: string | undefined, value: number, type: PricelistMultiplierType, name: string }> | undefined, feedback?: { __typename?: 'OrderFeedback', rating?: number | undefined } | undefined, guest: { __typename?: 'Guest', mobile?: string | undefined, mobileCountryCode?: string | undefined, lastName?: string | undefined, firstName?: string | undefined, id: string }, space: { __typename?: 'Space', name: string, id: string }, pricelist: { __typename?: 'Pricelist', name: string, id: string }, thread?: { __typename?: 'Thread', id: string } | undefined }> } };

export type SearchProductsQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  outOfStockItems?: InputMaybe<Scalars['Boolean']>;
}>;


export type SearchProductsQuery = { __typename?: 'Query', searchProducts: { __typename?: 'SearchProductsResponse', count: number, data: Array<{ __typename?: 'Product', name: string, code: string, stock: number, sellPrice: number, costPrice: number, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any }> } };

export type SearchSalesQueryVariables = Exact<{
  query?: InputMaybe<Scalars['String']>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  startDate?: InputMaybe<Scalars['DateTime']>;
  endDate?: InputMaybe<Scalars['DateTime']>;
}>;


export type SearchSalesQuery = { __typename?: 'Query', searchSales: { __typename?: 'SearchSalesResponse', count: number, data: Array<{ __typename?: 'Sale', totalPrice: number, salesReference?: string | undefined, subtotal: number, cancelled?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, items: Array<{ __typename?: 'SaleItem', id: string, productId: string, title: string, quantity: number, totalSell: number, totalCost: number }>, customer: { __typename?: 'Customer', address: string, phone: string, nic: string, lastName: string, firstName: string, id: string }, instalmentPlan: { __typename?: 'SaleInstalmentPlan', noTerms: number, initialPayment: number, terms: Array<{ __typename?: 'SaleInstalmentTerm', id: string, dueDate?: any | undefined, dueAmount: number, paidAmount: number, completed: boolean }> } }> } };

export type SpaceQueryVariables = Exact<{
  where: WhereInputType;
}>;


export type SpaceQuery = { __typename?: 'Query', space: { __typename?: 'Space', name: string, location: string, enabled?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, availability: { __typename?: 'Availability', m?: { __typename?: 'DaysTime', start: string, end: string } | undefined, t?: { __typename?: 'DaysTime', start: string, end: string } | undefined, w?: { __typename?: 'DaysTime', start: string, end: string } | undefined, th?: { __typename?: 'DaysTime', start: string, end: string } | undefined, f?: { __typename?: 'DaysTime', start: string, end: string } | undefined, sa?: { __typename?: 'DaysTime', start: string, end: string } | undefined, s?: { __typename?: 'DaysTime', start: string, end: string } | undefined }, pricelists: Array<{ __typename?: 'Pricelist', name: string, description?: string | undefined, commerce?: boolean | undefined, autoApprove?: boolean | undefined, feedback?: boolean | undefined, posId?: string | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, availability: { __typename?: 'Availability', m?: { __typename?: 'DaysTime', start: string, end: string } | undefined, t?: { __typename?: 'DaysTime', start: string, end: string } | undefined, w?: { __typename?: 'DaysTime', start: string, end: string } | undefined, th?: { __typename?: 'DaysTime', start: string, end: string } | undefined, f?: { __typename?: 'DaysTime', start: string, end: string } | undefined, sa?: { __typename?: 'DaysTime', start: string, end: string } | undefined, s?: { __typename?: 'DaysTime', start: string, end: string } | undefined }, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, catalog?: { __typename?: 'PricelistCatalog', categories: Array<{ __typename?: 'PricelistCategory', id: string, name: string, description?: string | undefined, posId?: string | undefined, items: Array<{ __typename?: 'PricelistItem', id: string, name: string, description?: string | undefined, photos?: Array<string> | undefined, regularPrice: number, roomServicePrice: number, note?: string | undefined, posId?: string | undefined, snoozed?: boolean | undefined, modifiers: Array<{ __typename?: 'PricelistItemModifier', id: string, name: string, posId?: string | undefined, required: boolean, maxSelection: number, options: Array<{ __typename?: 'PricelistItemOption', id: string, name: string, posId?: string | undefined, price: number }> }>, posSettings?: { __typename?: 'PricelistItemPOSSettings', roomService: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number }, tableService: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number }, priceLevels?: Array<{ __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number }> | undefined } | undefined, labels?: Array<{ __typename?: 'PricelistLabel', id: string, name: string }> | undefined, promotions?: { __typename?: 'PricelistPromotions', discounts?: Array<{ __typename?: 'PricelistDiscount', id: string, name: string, value: number, available?: boolean | undefined, level?: PricelistDiscountLevel | undefined, minOrderAmount?: number | undefined, type: PricelistMultiplierType, posId?: string | undefined, count?: number | undefined, posSettings?: { __typename?: 'PricelistDiscountPOSSettings', open?: boolean | undefined } | undefined, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined }> | undefined } | undefined }> }>, labels?: Array<{ __typename?: 'PricelistLabel', id: string, name: string }> | undefined } | undefined, posSettings?: { __typename?: 'PricelistPOSSettings', enabled?: boolean | undefined, posId?: string | undefined, revenueCenterId?: string | undefined, employeeId?: string | undefined, provider?: string | undefined, tableService: { __typename?: 'PricelistPOSSettingsFulfilment', posId: string, name: string }, roomService: { __typename?: 'PricelistPOSSettingsFulfilment', posId: string, name: string } } | undefined, promotions?: { __typename?: 'PricelistPromotions', discounts?: Array<{ __typename?: 'PricelistDiscount', id: string, name: string, value: number, available?: boolean | undefined, level?: PricelistDiscountLevel | undefined, minOrderAmount?: number | undefined, type: PricelistMultiplierType, posId?: string | undefined, count?: number | undefined, posSettings?: { __typename?: 'PricelistDiscountPOSSettings', open?: boolean | undefined } | undefined, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined }> | undefined } | undefined, surcharges?: Array<{ __typename?: 'PricelistSurcharge', id: string, name: string, value: number, type: PricelistMultiplierType, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined }> | undefined, enabledPayments?: { __typename?: 'PricelistEnabledPayments', card?: boolean | undefined, roomBill?: boolean | undefined, cash?: boolean | undefined } | undefined, space: { __typename?: 'Space', name: string, location: string, enabled?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, availability: { __typename?: 'Availability', m?: { __typename?: 'DaysTime', start: string, end: string } | undefined, t?: { __typename?: 'DaysTime', start: string, end: string } | undefined, w?: { __typename?: 'DaysTime', start: string, end: string } | undefined, th?: { __typename?: 'DaysTime', start: string, end: string } | undefined, f?: { __typename?: 'DaysTime', start: string, end: string } | undefined, sa?: { __typename?: 'DaysTime', start: string, end: string } | undefined, s?: { __typename?: 'DaysTime', start: string, end: string } | undefined } } }> } };

export type SpacesQueryVariables = Exact<{ [key: string]: never; }>;


export type SpacesQuery = { __typename?: 'Query', spaces: Array<{ __typename?: 'Space', name: string, location: string, enabled?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, availability: { __typename?: 'Availability', m?: { __typename?: 'DaysTime', start: string, end: string } | undefined, t?: { __typename?: 'DaysTime', start: string, end: string } | undefined, w?: { __typename?: 'DaysTime', start: string, end: string } | undefined, th?: { __typename?: 'DaysTime', start: string, end: string } | undefined, f?: { __typename?: 'DaysTime', start: string, end: string } | undefined, sa?: { __typename?: 'DaysTime', start: string, end: string } | undefined, s?: { __typename?: 'DaysTime', start: string, end: string } | undefined }, pricelists: Array<{ __typename?: 'Pricelist', name: string, description?: string | undefined, commerce?: boolean | undefined, autoApprove?: boolean | undefined, feedback?: boolean | undefined, posId?: string | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, availability: { __typename?: 'Availability', m?: { __typename?: 'DaysTime', start: string, end: string } | undefined, t?: { __typename?: 'DaysTime', start: string, end: string } | undefined, w?: { __typename?: 'DaysTime', start: string, end: string } | undefined, th?: { __typename?: 'DaysTime', start: string, end: string } | undefined, f?: { __typename?: 'DaysTime', start: string, end: string } | undefined, sa?: { __typename?: 'DaysTime', start: string, end: string } | undefined, s?: { __typename?: 'DaysTime', start: string, end: string } | undefined }, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, catalog?: { __typename?: 'PricelistCatalog', categories: Array<{ __typename?: 'PricelistCategory', id: string, name: string, description?: string | undefined, posId?: string | undefined, items: Array<{ __typename?: 'PricelistItem', id: string, name: string, description?: string | undefined, photos?: Array<string> | undefined, regularPrice: number, roomServicePrice: number, note?: string | undefined, posId?: string | undefined, snoozed?: boolean | undefined, modifiers: Array<{ __typename?: 'PricelistItemModifier', id: string, name: string, posId?: string | undefined, required: boolean, maxSelection: number, options: Array<{ __typename?: 'PricelistItemOption', id: string, name: string, posId?: string | undefined, price: number }> }>, posSettings?: { __typename?: 'PricelistItemPOSSettings', roomService: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number }, tableService: { __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number }, priceLevels?: Array<{ __typename?: 'PricelistItemPOSPriceLevel', posId: string, name: string, price: number }> | undefined } | undefined, labels?: Array<{ __typename?: 'PricelistLabel', id: string, name: string }> | undefined, promotions?: { __typename?: 'PricelistPromotions', discounts?: Array<{ __typename?: 'PricelistDiscount', id: string, name: string, value: number, available?: boolean | undefined, level?: PricelistDiscountLevel | undefined, minOrderAmount?: number | undefined, type: PricelistMultiplierType, posId?: string | undefined, count?: number | undefined, posSettings?: { __typename?: 'PricelistDiscountPOSSettings', open?: boolean | undefined } | undefined, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined }> | undefined } | undefined }> }>, labels?: Array<{ __typename?: 'PricelistLabel', id: string, name: string }> | undefined } | undefined, posSettings?: { __typename?: 'PricelistPOSSettings', enabled?: boolean | undefined, posId?: string | undefined, revenueCenterId?: string | undefined, employeeId?: string | undefined, provider?: string | undefined, tableService: { __typename?: 'PricelistPOSSettingsFulfilment', posId: string, name: string }, roomService: { __typename?: 'PricelistPOSSettingsFulfilment', posId: string, name: string } } | undefined, promotions?: { __typename?: 'PricelistPromotions', discounts?: Array<{ __typename?: 'PricelistDiscount', id: string, name: string, value: number, available?: boolean | undefined, level?: PricelistDiscountLevel | undefined, minOrderAmount?: number | undefined, type: PricelistMultiplierType, posId?: string | undefined, count?: number | undefined, posSettings?: { __typename?: 'PricelistDiscountPOSSettings', open?: boolean | undefined } | undefined, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined }> | undefined } | undefined, surcharges?: Array<{ __typename?: 'PricelistSurcharge', id: string, name: string, value: number, type: PricelistMultiplierType, delivery?: Array<{ __typename?: 'PricelistDelivery', enabled?: boolean | undefined, type: PricelistDeliveryType }> | undefined, collection?: Array<{ __typename?: 'PricelistCollection', enabled?: boolean | undefined, type: PricelistCollectionType }> | undefined }> | undefined, enabledPayments?: { __typename?: 'PricelistEnabledPayments', card?: boolean | undefined, roomBill?: boolean | undefined, cash?: boolean | undefined } | undefined, space: { __typename?: 'Space', name: string, location: string, enabled?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, availability: { __typename?: 'Availability', m?: { __typename?: 'DaysTime', start: string, end: string } | undefined, t?: { __typename?: 'DaysTime', start: string, end: string } | undefined, w?: { __typename?: 'DaysTime', start: string, end: string } | undefined, th?: { __typename?: 'DaysTime', start: string, end: string } | undefined, f?: { __typename?: 'DaysTime', start: string, end: string } | undefined, sa?: { __typename?: 'DaysTime', start: string, end: string } | undefined, s?: { __typename?: 'DaysTime', start: string, end: string } | undefined } } }> }> };

export type StripeAccountQueryVariables = Exact<{ [key: string]: never; }>;


export type StripeAccountQuery = { __typename?: 'Query', stripeAccount: { __typename?: 'StripeAccountResponse', payoutsEnabled: boolean, paymentsEnabled: boolean, accountLink?: string | undefined, accountNumberLast4?: string | undefined, sortCode?: string | undefined, dateCreated: any, payoutSchedule?: { __typename?: 'HMPayAccountPayoutSchedule', interval: PayoutInterval, date: string } | undefined } };

export type StripePayoutsQueryVariables = Exact<{ [key: string]: never; }>;


export type StripePayoutsQuery = { __typename?: 'Query', stripePayouts?: Array<{ __typename?: 'PayoutValueResponse', totalPrice: number, arrivalDate?: any | undefined }> | undefined };

export type ThreadQueryVariables = Exact<{
  where: WhereInputType;
}>;


export type ThreadQuery = { __typename?: 'Query', thread: { __typename?: 'Thread', resolved?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, guest: { __typename?: 'Guest', mobileCountryCode?: string | undefined, mobile?: string | undefined, lastName?: string | undefined, firstName?: string | undefined, email?: string | undefined, id: string }, order?: { __typename?: 'Order', subtotal: number, orderReference?: string | undefined, totalPrice: number, dateCreated: any, id: string, pricelist: { __typename?: 'Pricelist', id: string, name: string }, space: { __typename?: 'Space', id: string, name: string }, discount?: { __typename?: 'PriceMultiplier', value: number, name: string } | undefined } | undefined, lastMessage?: { __typename?: 'Message', author: MessageAuthor, text: string, dateCreated: any, id: string } | undefined } };

export type ThreadsQueryVariables = Exact<{
  sort?: InputMaybe<ThreadSortInput>;
  limit?: InputMaybe<Scalars['Float']>;
  offset?: InputMaybe<Scalars['Float']>;
  guestId?: InputMaybe<Scalars['String']>;
  resolved?: InputMaybe<Scalars['Boolean']>;
}>;


export type ThreadsQuery = { __typename?: 'Query', threads: Array<{ __typename?: 'Thread', resolved?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, guest: { __typename?: 'Guest', mobileCountryCode?: string | undefined, mobile?: string | undefined, lastName?: string | undefined, firstName?: string | undefined, email?: string | undefined, id: string }, order?: { __typename?: 'Order', subtotal: number, orderReference?: string | undefined, totalPrice: number, dateCreated: any, id: string, pricelist: { __typename?: 'Pricelist', id: string, name: string }, space: { __typename?: 'Space', id: string, name: string }, discount?: { __typename?: 'PriceMultiplier', value: number, name: string } | undefined } | undefined, lastMessage?: { __typename?: 'Message', author: MessageAuthor, text: string, dateCreated: any, id: string } | undefined }> };

export type UnreadThreadCountQueryVariables = Exact<{ [key: string]: never; }>;


export type UnreadThreadCountQuery = { __typename?: 'Query', unreadThreadCount: number };

export type UserQueryVariables = Exact<{ [key: string]: never; }>;


export type UserQuery = { __typename?: 'Query', user: { __typename?: 'User', email: string, firstName?: string | undefined, lastName?: string | undefined, mobile?: string | undefined, jobTitle?: string | undefined, groupAdmin?: boolean | undefined, hotelManager?: boolean | undefined, developer?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, pushSubscriptions?: Array<{ __typename?: 'UserPushSubscription', id: string, enabled: boolean, sound: boolean, dateUpdated: any, pushSubscription: { __typename?: 'WebPushSubscription', endpoint: string, expirationTime?: number | undefined, keys: { __typename?: 'WebPushSubscriptionKeys', p256dh: string, auth: string } }, device: { __typename?: 'UserPushSubscriptionDevice', vendor?: string | undefined, model?: string | undefined, type?: string | undefined, browser?: string | undefined, os?: string | undefined } }> | undefined, notifications?: { __typename?: 'UserNotifications', orders?: boolean | undefined, bookings?: boolean | undefined, messages?: boolean | undefined } | undefined, group: { __typename?: 'Group', hotelManager?: boolean | undefined, name: string, id: string }, hotels: Array<{ __typename?: 'Hotel', name: string, id: string }>, roles: Array<{ __typename?: 'Role', role: UserRole, id: string, hotel: { __typename?: 'Hotel', id: string } }> } };

export type UserExistsQueryVariables = Exact<{
  where: WhereUserExistsInput;
}>;


export type UserExistsQuery = { __typename?: 'Query', userExists: boolean };

export type UserLoginTokenQueryVariables = Exact<{
  redirectURL?: InputMaybe<Scalars['String']>;
  hotelId?: InputMaybe<Scalars['String']>;
  hideSidebar?: InputMaybe<Scalars['Boolean']>;
}>;


export type UserLoginTokenQuery = { __typename?: 'Query', userLoginToken: { __typename?: 'GetUserLoginTokenResponse', loginLink: string } };

export type UsersQueryVariables = Exact<{ [key: string]: never; }>;


export type UsersQuery = { __typename?: 'Query', users: Array<{ __typename?: 'User', email: string, firstName?: string | undefined, lastName?: string | undefined, mobile?: string | undefined, jobTitle?: string | undefined, groupAdmin?: boolean | undefined, hotelManager?: boolean | undefined, developer?: boolean | undefined, id: string, dateCreated: any, deleted?: boolean | undefined, dateUpdated: any, pushSubscriptions?: Array<{ __typename?: 'UserPushSubscription', id: string, enabled: boolean, sound: boolean, dateUpdated: any, pushSubscription: { __typename?: 'WebPushSubscription', endpoint: string, expirationTime?: number | undefined, keys: { __typename?: 'WebPushSubscriptionKeys', p256dh: string, auth: string } }, device: { __typename?: 'UserPushSubscriptionDevice', vendor?: string | undefined, model?: string | undefined, type?: string | undefined, browser?: string | undefined, os?: string | undefined } }> | undefined, notifications?: { __typename?: 'UserNotifications', orders?: boolean | undefined, bookings?: boolean | undefined, messages?: boolean | undefined } | undefined, hotels: Array<{ __typename?: 'Hotel', name: string, id: string }>, roles: Array<{ __typename?: 'Role', role: UserRole, id: string, hotel: { __typename?: 'Hotel', id: string } }> }> };


export const AddCustomDomainDocument = gql`
    mutation addCustomDomain($domain: String!) {
  addCustomDomain(domain: $domain)
}
    `;
export const AddCustomLinkDocument = gql`
    mutation addCustomLink($id: String!, $enabled: Boolean!, $name: String!, $link: String!, $photo: String) {
  addCustomLink(
    id: $id
    enabled: $enabled
    name: $name
    link: $link
    photo: $photo
  ) {
    id
    enabled
    name
    link
    photo
  }
}
    `;
export const AnonGuestLoginDocument = gql`
    mutation anonGuestLogin($deviceId: String!) {
  anonGuestLogin(deviceId: $deviceId) {
    deviceId
    dateUpdated
    dateCreated
    id
  }
}
    `;
export const AuthorizeApaleoDocument = gql`
    mutation authorizeApaleo($code: String!) {
  authorizeApaleo(code: $code)
}
    `;
export const AuthorizeMewsDocument = gql`
    mutation authorizeMews($accessToken: String!, $clientToken: String!) {
  authorizeMews(accessToken: $accessToken, clientToken: $clientToken)
}
    `;
export const AuthorizeOmnivoreDocument = gql`
    mutation authorizeOmnivore($apiKey: String!) {
  authorizeOmnivore(apiKey: $apiKey)
}
    `;
export const ConnectMarketplaceAppDocument = gql`
    mutation connectMarketplaceApp($id: String!, $redirectURL: String!) {
  connectMarketplaceApp(id: $id, redirectURL: $redirectURL) {
    redirectURL
  }
}
    `;
export const CreateAttractionDocument = gql`
    mutation createAttraction($catalog: AttractionCatalogInput, $enabled: Boolean, $description: String) {
  createAttraction(
    catalog: $catalog
    enabled: $enabled
    description: $description
  ) {
    description
  }
}
    `;
export const CreateBookingDocument = gql`
    mutation createBooking($roomNumber: String, $bookingReference: String, $checkInDate: DateTime, $checkOutDate: DateTime, $carRegistration: String, $party: [BookingPartyInput!], $bookingDetails: BookingDetailsInput, $roomType: String, $estimatedTimeOfArrival: String, $numberOfAdults: Float, $numberOfChildren: Float, $clubMemberNumber: String, $dateReviewed: DateTime, $dateSubmitted: DateTime, $dateCheckedIn: DateTime, $guestId: String) {
  createBooking(
    roomNumber: $roomNumber
    bookingReference: $bookingReference
    checkInDate: $checkInDate
    checkOutDate: $checkOutDate
    carRegistration: $carRegistration
    party: $party
    bookingDetails: $bookingDetails
    roomType: $roomType
    estimatedTimeOfArrival: $estimatedTimeOfArrival
    numberOfAdults: $numberOfAdults
    numberOfChildren: $numberOfChildren
    clubMemberNumber: $clubMemberNumber
    dateReviewed: $dateReviewed
    dateSubmitted: $dateSubmitted
    dateCheckedIn: $dateCheckedIn
    guestId: $guestId
  ) {
    roomNumber
    bookingReference
    checkInDate
    checkOutDate
    carRegistration
    party {
      id
      firstName
      lastName
      ageGroup
      email
      mobile
      mobileCountryCode
      countryOfResidence
      address
      nationality
      passportNumber
      nextDestination
      dateOfBirth
      dietaryRequirements
      purposeOfStay
      specialOccasions
      job
      company
      pmsId
      carRegistration
    }
    bookingDetails {
      toggleQuestion {
        result
        toggle
        title
        type
      }
    }
    roomType
    estimatedTimeOfArrival
    numberOfAdults
    numberOfChildren
    clubMemberNumber
    purposeOfStay
    pmsId
    dateReviewed
    dateSubmitted
    dateCheckedIn
    dateCheckedOut
    dateCanceled
    guest {
      mobileCountryCode
      email
      mobile
      lastName
      firstName
      id
    }
    status
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const CreateCustomerDocument = gql`
    mutation createCustomer($firstName: String!, $lastName: String!, $nic: String!, $phone: String!, $address: String!) {
  createCustomer(
    firstName: $firstName
    lastName: $lastName
    nic: $nic
    phone: $phone
    address: $address
  ) {
    firstName
    lastName
    nic
    phone
    address
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const CreateGuestPaymentMethodDocument = gql`
    mutation createGuestPaymentMethod($name: String!, $token: String!) {
  createGuestPaymentMethod(name: $name, token: $token)
}
    `;
export const CreateHmPayAccountDocument = gql`
    mutation createHMPayAccount($accountNumber: String!, $sortCode: String!) {
  createHMPayAccount(accountNumber: $accountNumber, sortCode: $sortCode) {
    accountNumberLast4
    sortCode
    payoutSchedule {
      interval
      date
    }
    dateCreated
  }
}
    `;
export const CreateMarketplaceAppDocument = gql`
    mutation createMarketplaceApp($name: String!, $description: String!, $type: IntegrationType!, $logo: String!, $websiteURL: String!, $documentationURL: String!, $helpURL: String!, $redirectURLs: [String!]!, $connectLink: String!, $live: Boolean!, $enabled: Boolean!) {
  createMarketplaceApp(
    name: $name
    description: $description
    type: $type
    logo: $logo
    websiteURL: $websiteURL
    documentationURL: $documentationURL
    helpURL: $helpURL
    redirectURLs: $redirectURLs
    connectLink: $connectLink
    live: $live
    enabled: $enabled
  ) {
    name
    description
    type
    logo
    websiteURL
    documentationURL
    helpURL
    redirectURLs
    connectLink
    live
    enabled
    developer {
      id
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const CreateMarketplaceAppSubscriptionDocument = gql`
    mutation createMarketplaceAppSubscription($endpoint: String!, $topics: [HotelMarketplaceAppSubscriptionTopic!]!) {
  createMarketplaceAppSubscription(endpoint: $endpoint, topics: $topics) {
    id
    endpoint
    topics
  }
}
    `;
export const CreateOrderDocument = gql`
    mutation createOrder($dateApproved: DateTime, $dateReady: DateTime, $dateCompleted: DateTime, $dateScheduled: DateTime, $items: [OrderItemInput!]!, $totalPrice: Float!, $roomNumber: String!, $notes: String, $cardDetails: CardDetailsInput, $paymentProvider: PayoutsStrategy, $paymentType: PaymentType!, $orderReference: String, $paymentIntentId: String, $subtotal: Float!, $discount: PriceMultiplierInput, $surcharges: [PriceMultiplierInput!], $delivery: PricelistDeliveryType, $collection: PricelistCollectionType, $pricelistId: String!, $guestId: String) {
  createOrder(
    dateApproved: $dateApproved
    dateReady: $dateReady
    dateCompleted: $dateCompleted
    dateScheduled: $dateScheduled
    items: $items
    totalPrice: $totalPrice
    roomNumber: $roomNumber
    notes: $notes
    cardDetails: $cardDetails
    paymentProvider: $paymentProvider
    paymentType: $paymentType
    orderReference: $orderReference
    paymentIntentId: $paymentIntentId
    subtotal: $subtotal
    discount: $discount
    surcharges: $surcharges
    delivery: $delivery
    collection: $collection
    pricelistId: $pricelistId
    guestId: $guestId
  ) {
    order {
      dateApproved
      dateReady
      dateCompleted
      dateScheduled
      items {
        id
        name
        posId
        modifiers {
          id
          name
          posId
          options {
            id
            name
            posId
            price
          }
        }
        discount {
          id
          posId
          value
          type
          name
        }
        quantity
        posSettings {
          posId
          name
        }
        totalPrice
        omnivoreSettings {
          tableService {
            posId
            name
            price
          }
          roomService {
            posId
            name
            price
          }
        }
      }
      totalPrice
      roomNumber
      notes
      cardDetails {
        id
        country
        brand
        last4
      }
      paymentProvider
      paymentType
      orderReference
      posId
      subtotal
      discount {
        id
        posId
        value
        type
        name
      }
      surcharges {
        id
        posId
        value
        type
        name
      }
      reasonRejected
      rejected
      delivery
      collection
      paid
      feedback {
        rating
      }
      guest {
        lastName
        firstName
        id
      }
      space {
        name
        id
      }
      pricelist {
        name
        id
      }
      thread {
        id
      }
      status
      id
      dateCreated
      deleted
      dateUpdated
    }
    paymentIntent {
      status
      clientSecret
    }
  }
}
    `;
export const CreatePricelistDocument = gql`
    mutation createPricelist($name: String!, $description: String, $availability: AvailabilityInput!, $commerce: Boolean, $collection: [PricelistCollectionInput!], $delivery: [PricelistDeliveryInput!], $catalog: PricelistCatalogInput, $posSettings: PricelistPOSSettingsInput, $promotions: PricelistPromotionsInput, $surcharges: [PricelistSurchargeInput!], $enabledPayments: PricelistEnabledPaymentsInput, $autoApprove: Boolean, $feedback: Boolean, $spaceId: String!) {
  createPricelist(
    name: $name
    description: $description
    availability: $availability
    commerce: $commerce
    collection: $collection
    delivery: $delivery
    catalog: $catalog
    posSettings: $posSettings
    promotions: $promotions
    surcharges: $surcharges
    enabledPayments: $enabledPayments
    autoApprove: $autoApprove
    feedback: $feedback
    spaceId: $spaceId
  ) {
    name
    description
    availability {
      m {
        start
        end
      }
      t {
        start
        end
      }
      w {
        start
        end
      }
      th {
        start
        end
      }
      f {
        start
        end
      }
      sa {
        start
        end
      }
      s {
        start
        end
      }
    }
    commerce
    collection {
      enabled
      type
    }
    delivery {
      enabled
      type
    }
    catalog {
      categories {
        id
        name
        description
        posId
        items {
          id
          name
          description
          photos
          modifiers {
            id
            name
            posId
            required
            maxSelection
            options {
              id
              name
              posId
              price
            }
          }
          regularPrice
          roomServicePrice
          posSettings {
            roomService {
              posId
              name
              price
            }
            tableService {
              posId
              name
              price
            }
            priceLevels {
              posId
              name
              price
            }
          }
          labels {
            id
            name
          }
          note
          posId
          snoozed
          promotions {
            discounts {
              id
              name
              value
              available
              level
              minOrderAmount
              type
              posSettings {
                open
              }
              posId
              delivery {
                enabled
                type
              }
              collection {
                enabled
                type
              }
              count
            }
          }
        }
      }
      labels {
        id
        name
      }
    }
    posSettings {
      enabled
      posId
      revenueCenterId
      tableService {
        posId
        name
      }
      roomService {
        posId
        name
      }
      employeeId
      provider
    }
    promotions {
      discounts {
        id
        name
        value
        available
        level
        minOrderAmount
        type
        posSettings {
          open
        }
        posId
        delivery {
          enabled
          type
        }
        collection {
          enabled
          type
        }
        count
      }
    }
    surcharges {
      id
      name
      value
      type
      delivery {
        enabled
        type
      }
      collection {
        enabled
        type
      }
    }
    enabledPayments {
      card
      roomBill
      cash
    }
    autoApprove
    feedback
    posId
    space {
      name
      location
      availability {
        m {
          start
          end
        }
        t {
          start
          end
        }
        w {
          start
          end
        }
        th {
          start
          end
        }
        f {
          start
          end
        }
        sa {
          start
          end
        }
        s {
          start
          end
        }
      }
      enabled
      id
      dateCreated
      deleted
      dateUpdated
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const CreateProductDocument = gql`
    mutation createProduct($name: String!, $code: String!, $stock: Float!, $sellPrice: Float!, $costPrice: Float!) {
  createProduct(
    name: $name
    code: $code
    stock: $stock
    sellPrice: $sellPrice
    costPrice: $costPrice
  ) {
    name
    code
    stock
    sellPrice
    costPrice
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const CreateSaleDocument = gql`
    mutation createSale($items: [SaleItemInput!]!, $totalPrice: Float!, $salesReference: String, $subtotal: Float!, $instalmentPlan: SaleInstalmentPlanInput!, $customerNIC: String!) {
  createSale(
    items: $items
    totalPrice: $totalPrice
    salesReference: $salesReference
    subtotal: $subtotal
    instalmentPlan: $instalmentPlan
    customerNIC: $customerNIC
  ) {
    sale {
      items {
        id
        productId
        title
        quantity
        totalSell
        totalCost
      }
      totalPrice
      salesReference
      subtotal
      customer {
        address
        phone
        nic
        lastName
        firstName
        id
      }
      instalmentPlan {
        noTerms
        initialPayment
        terms {
          id
          dueDate
          dueAmount
          paidAmount
          completed
        }
      }
      cancelled
      id
      dateCreated
      deleted
      dateUpdated
    }
  }
}
    `;
export const CreateSpaceDocument = gql`
    mutation createSpace($name: String!, $location: String!, $availability: AvailabilityInput!, $enabled: Boolean) {
  createSpace(
    name: $name
    location: $location
    availability: $availability
    enabled: $enabled
  ) {
    name
    location
    availability {
      m {
        start
        end
      }
      t {
        start
        end
      }
      w {
        start
        end
      }
      th {
        start
        end
      }
      f {
        start
        end
      }
      sa {
        start
        end
      }
      s {
        start
        end
      }
    }
    enabled
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const CreateStripeAccountDocument = gql`
    mutation createStripeAccount {
  createStripeAccount {
    accountLink
  }
}
    `;
export const DeleteAttractionDocument = gql`
    mutation deleteAttraction {
  deleteAttraction
}
    `;
export const DeleteCustomDomainDocument = gql`
    mutation deleteCustomDomain {
  deleteCustomDomain
}
    `;
export const DeleteCustomLinkDocument = gql`
    mutation deleteCustomLink($where: WhereInputType!) {
  deleteCustomLink(where: $where)
}
    `;
export const DeleteCustomerDocument = gql`
    mutation deleteCustomer($where: WhereInputType!) {
  deleteCustomer(where: $where)
}
    `;
export const DeleteGuestDocument = gql`
    mutation deleteGuest {
  deleteGuest
}
    `;
export const DeleteGuestPaymentMethodDocument = gql`
    mutation deleteGuestPaymentMethod($paymentMethodId: String!) {
  deleteGuestPaymentMethod(paymentMethodId: $paymentMethodId)
}
    `;
export const DeleteMarketplaceAppDocument = gql`
    mutation deleteMarketplaceApp($where: WhereInputType!) {
  deleteMarketplaceApp(where: $where)
}
    `;
export const DeleteMarketplaceAppSubscriptionDocument = gql`
    mutation deleteMarketplaceAppSubscription($where: WhereInputType!) {
  deleteMarketplaceAppSubscription(where: $where)
}
    `;
export const DeleteMarketplaceAppSubscriptionsDocument = gql`
    mutation deleteMarketplaceAppSubscriptions {
  deleteMarketplaceAppSubscriptions
}
    `;
export const DeletePricelistDocument = gql`
    mutation deletePricelist($where: WhereInputType!) {
  deletePricelist(where: $where)
}
    `;
export const DeletePricelistsDocument = gql`
    mutation deletePricelists($where: [WhereInputType!]!) {
  deletePricelists(where: $where)
}
    `;
export const DeleteProductDocument = gql`
    mutation deleteProduct($where: WhereInputType!) {
  deleteProduct(where: $where)
}
    `;
export const DeleteProductsDocument = gql`
    mutation deleteProducts($where: [WhereInputType!]!) {
  deleteProducts(where: $where)
}
    `;
export const DeleteSpaceDocument = gql`
    mutation deleteSpace($where: WhereInputType!) {
  deleteSpace(where: $where)
}
    `;
export const DeleteSpacesDocument = gql`
    mutation deleteSpaces($where: [WhereInputType!]!) {
  deleteSpaces(where: $where)
}
    `;
export const DeleteUserDocument = gql`
    mutation deleteUser($where: WhereInputType!) {
  deleteUser(where: $where)
}
    `;
export const DisableHotelPayoutsDocument = gql`
    mutation disableHotelPayouts {
  disableHotelPayouts {
    stripe {
      accountId
      linked
      publicKey
      dateCreated
    }
    hm {
      accountNumberLast4
      sortCode
      payoutSchedule {
        interval
        date
      }
      dateCreated
    }
    enabled
  }
}
    `;
export const DisconnectApaleoDocument = gql`
    mutation disconnectApaleo {
  disconnectApaleo
}
    `;
export const DisconnectMarketplaceAppDocument = gql`
    mutation disconnectMarketplaceApp($id: String) {
  disconnectMarketplaceApp(id: $id)
}
    `;
export const DisconnectMewsDocument = gql`
    mutation disconnectMews {
  disconnectMews
}
    `;
export const DisconnectOmnivoreDocument = gql`
    mutation disconnectOmnivore {
  disconnectOmnivore
}
    `;
export const EnableHotelPayoutsDocument = gql`
    mutation enableHotelPayouts($payoutsStrategy: PayoutsStrategy!) {
  enableHotelPayouts(payoutsStrategy: $payoutsStrategy) {
    stripe {
      accountId
      linked
      publicKey
      dateCreated
    }
    hm {
      accountNumberLast4
      sortCode
      payoutSchedule {
        interval
        date
      }
      dateCreated
    }
    enabled
  }
}
    `;
export const GenerateAttractionPlacesDocument = gql`
    mutation generateAttractionPlaces($categories: [GenerateAttractionPlacesCategoryArgs!]!, $requestBooking: Boolean!, $radius: Float!) {
  generateAttractionPlaces(
    categories: $categories
    requestBooking: $requestBooking
    radius: $radius
  )
}
    `;
export const GenerateMarketplaceAppKeyDocument = gql`
    mutation generateMarketplaceAppKey {
  generateMarketplaceAppKey
}
    `;
export const GuestLoginDocument = gql`
    mutation guestLogin($deviceId: String!, $email: String!, $verificationToken: String!) {
  guestLogin(
    deviceId: $deviceId
    email: $email
    verificationToken: $verificationToken
  ) {
    id
  }
}
    `;
export const GuestLogoutDocument = gql`
    mutation guestLogout {
  guestLogout
}
    `;
export const GuestTokenLoginDocument = gql`
    mutation guestTokenLogin {
  guestTokenLogin {
    id
  }
}
    `;
export const InviteHotelUserDocument = gql`
    mutation inviteHotelUser($email: String!, $hotels: [InviteUserHotelInput!], $groupAdmin: Boolean) {
  inviteHotelUser(email: $email, hotels: $hotels, groupAdmin: $groupAdmin)
}
    `;
export const LinkStripeAccountDocument = gql`
    mutation linkStripeAccount($authCode: String!) {
  linkStripeAccount(authCode: $authCode)
}
    `;
export const RegisterGroupAdminDocument = gql`
    mutation registerGroupAdmin($user: RegisterGroupAdminUserInput!, $hotel: RegisterGroupAdminHotelInput!, $group: RegisterGroupAdminGroupInput, $termsAndConditions: Boolean!) {
  registerGroupAdmin(
    user: $user
    hotel: $hotel
    group: $group
    termsAndConditions: $termsAndConditions
  ) {
    user {
      hotelManager
      groupAdmin
      jobTitle
      mobile
      lastName
      firstName
      email
      dateUpdated
      dateCreated
      id
    }
    hotel {
      id
    }
    group {
      id
    }
  }
}
    `;
export const RegisterGuestDocument = gql`
    mutation registerGuest($email: String!, $firstName: String!, $lastName: String!, $countryCode: String, $mobile: String) {
  registerGuest(
    email: $email
    firstName: $firstName
    lastName: $lastName
    countryCode: $countryCode
    mobile: $mobile
  )
}
    `;
export const RegisterHotelUserDocument = gql`
    mutation registerHotelUser($id: String!, $firstName: String!, $lastName: String!, $mobile: String!, $termsAndConditions: Boolean!) {
  registerHotelUser(
    id: $id
    firstName: $firstName
    lastName: $lastName
    mobile: $mobile
    termsAndConditions: $termsAndConditions
  )
}
    `;
export const ResolveThreadDocument = gql`
    mutation resolveThread($where: WhereInputType!) {
  resolveThread(where: $where) {
    resolved
    guest {
      mobileCountryCode
      mobile
      lastName
      firstName
      email
      id
    }
    order {
      pricelist {
        id
        name
      }
      space {
        id
        name
      }
      discount {
        value
        name
      }
      subtotal
      orderReference
      totalPrice
      dateCreated
      id
      id
    }
    lastMessage {
      author
      text
      dateCreated
      id
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const ResyncPosDocument = gql`
    mutation resyncPOS {
  resyncPOS
}
    `;
export const SendGuestTokenDocument = gql`
    mutation sendGuestToken($email: String!, $deviceId: String!) {
  sendGuestToken(email: $email, deviceId: $deviceId)
}
    `;
export const SendUserTokenDocument = gql`
    mutation sendUserToken($email: String!, $verificationTokenOnly: Boolean) {
  sendUserToken(email: $email, verificationTokenOnly: $verificationTokenOnly)
}
    `;
export const SettleOrdersDocument = gql`
    mutation settleOrders($orderId: String, $guestId: String, $paymentType: PaymentType) {
  settleOrders(orderId: $orderId, guestId: $guestId, paymentType: $paymentType)
}
    `;
export const SubscribeGuestPushNotificationsDocument = gql`
    mutation subscribeGuestPushNotifications($pushNotificationToken: String!) {
  subscribeGuestPushNotifications(pushNotificationToken: $pushNotificationToken) {
    deviceId
    email
    firstName
    lastName
    mobile
    mobileCountryCode
    dateOfBirth
    countryOfResidence
    address
    nationality
    passportNumber
    dietaryRequirements
    company
    job
    pmsId
    threads {
      id
    }
    orders {
      id
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const SubscribeUserPushNotificationsDocument = gql`
    mutation subscribeUserPushNotifications($deviceId: String!, $pushSubscription: WebPushSubscriptionInput!, $sound: Boolean) {
  subscribeUserPushNotifications(
    deviceId: $deviceId
    pushSubscription: $pushSubscription
    sound: $sound
  ) {
    email
    firstName
    lastName
    mobile
    jobTitle
    groupAdmin
    hotelManager
    developer
    pushSubscriptions {
      id
      enabled
      pushSubscription {
        endpoint
        expirationTime
        keys {
          p256dh
          auth
        }
      }
      device {
        vendor
        model
        type
        browser
        os
      }
      sound
      dateUpdated
    }
    notifications {
      orders
      bookings
      messages
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const UnsubscribeUserPushNotificationsDocument = gql`
    mutation unsubscribeUserPushNotifications($deviceId: String!) {
  unsubscribeUserPushNotifications(deviceId: $deviceId) {
    email
    firstName
    lastName
    mobile
    jobTitle
    groupAdmin
    hotelManager
    developer
    pushSubscriptions {
      id
      enabled
      pushSubscription {
        endpoint
        expirationTime
        keys {
          p256dh
          auth
        }
      }
      device {
        vendor
        model
        type
        browser
        os
      }
      sound
      dateUpdated
    }
    notifications {
      orders
      bookings
      messages
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const UpdateAttractionDocument = gql`
    mutation updateAttraction($data: UpdateAttractionInput!) {
  updateAttraction(data: $data) {
    catalog {
      categories {
        id
        name
        description
        places {
          id
          placeId
          name
          address
          rating
          note
          coordinates {
            lat
            lng
          }
          photos
          description
          website
          phone
          requestBooking
          labels {
            id
            name
          }
        }
      }
      labels {
        id
        name
      }
    }
    enabled
    description
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const UpdateBookingDocument = gql`
    mutation updateBooking($data: UpdateBookingInput!, $where: BookingWhereInput!) {
  updateBooking(data: $data, where: $where) {
    roomNumber
    bookingReference
    checkInDate
    checkOutDate
    carRegistration
    party {
      id
      firstName
      lastName
      ageGroup
      email
      mobile
      mobileCountryCode
      countryOfResidence
      address
      nationality
      passportNumber
      nextDestination
      dateOfBirth
      dietaryRequirements
      purposeOfStay
      specialOccasions
      job
      company
      pmsId
      carRegistration
    }
    bookingDetails {
      toggleQuestion {
        result
        toggle
        title
        type
      }
    }
    roomType
    estimatedTimeOfArrival
    numberOfAdults
    numberOfChildren
    clubMemberNumber
    purposeOfStay
    pmsId
    dateReviewed
    dateSubmitted
    dateCheckedIn
    dateCheckedOut
    dateCanceled
    guest {
      mobileCountryCode
      email
      mobile
      lastName
      firstName
      id
    }
    status
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const UpdateCustomLinkDocument = gql`
    mutation updateCustomLink($where: CustomLinkWhereInput!, $data: UpdateCustomLinkInput!) {
  updateCustomLink(where: $where, data: $data) {
    id
    enabled
    name
    link
    photo
  }
}
    `;
export const UpdateCustomerDocument = gql`
    mutation updateCustomer($where: CustomerWhereInput!, $data: UpdateCustomerInput!) {
  updateCustomer(where: $where, data: $data) {
    firstName
    lastName
    nic
    phone
    address
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const UpdateGuestDocument = gql`
    mutation updateGuest($where: GuestWhereInput, $data: UpdateGuestInput!) {
  updateGuest(where: $where, data: $data) {
    deviceId
    email
    firstName
    lastName
    mobile
    mobileCountryCode
    dateOfBirth
    countryOfResidence
    address
    nationality
    passportNumber
    dietaryRequirements
    company
    job
    pmsId
    bookings {
      roomNumber
      bookingReference
      checkInDate
      checkOutDate
      carRegistration
      party {
        id
        firstName
        lastName
        ageGroup
        email
        mobile
        mobileCountryCode
        countryOfResidence
        address
        nationality
        passportNumber
        nextDestination
        dateOfBirth
        dietaryRequirements
        purposeOfStay
        specialOccasions
        job
        company
        pmsId
        carRegistration
      }
      bookingDetails {
        toggleQuestion {
          result
          toggle
          title
          type
        }
      }
      roomType
      estimatedTimeOfArrival
      numberOfAdults
      numberOfChildren
      clubMemberNumber
      purposeOfStay
      pmsId
      dateReviewed
      dateSubmitted
      dateCheckedIn
      dateCheckedOut
      dateCanceled
      guest {
        mobileCountryCode
        email
        mobile
        lastName
        firstName
        id
      }
      status
      id
      dateCreated
      deleted
      dateUpdated
    }
    threads {
      id
    }
    orders {
      id
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const UpdateHmPayExternalAccountDocument = gql`
    mutation updateHMPayExternalAccount($accountNumber: String!, $sortCode: String!, $payoutSchedule: HMPayAccountPayoutScheduleInput!) {
  updateHMPayExternalAccount(
    accountNumber: $accountNumber
    sortCode: $sortCode
    payoutSchedule: $payoutSchedule
  ) {
    accountNumberLast4
    sortCode
    payoutSchedule {
      interval
      date
    }
    dateCreated
  }
}
    `;
export const UpdateHotelDocument = gql`
    mutation updateHotel($data: UpdateHotelInput!) {
  updateHotel(data: $data) {
    name
    telephone
    address {
      line1
      line2
      town
      country
      postalCode
      coordinates {
        lat
        lng
      }
      placeId
    }
    website
    currencyCode
    countryCode
    app {
      versionCode
      domain
      disabled
      disabledReason
      metadata {
        title
        subtitle
        shortDescription
        fullDescription
        keywords
        icon
        screenshots {
          ios {
            _1
            _2
            _3
          }
          ios55 {
            _1
            _2
            _3
          }
          android {
            featureGraphic
          }
        }
        ios {
          appStoreId
        }
      }
      assets {
        featuredImage
        featuredLogo
      }
      forceUpdate
      experimental {
        hideProfile
      }
    }
    payouts {
      stripe {
        accountId
        linked
        publicKey
        dateCreated
      }
      hm {
        accountNumberLast4
        sortCode
        payoutSchedule {
          interval
          date
        }
        dateCreated
      }
      enabled
    }
    messagesSettings {
      enabled
      availability {
        m {
          start
          end
        }
        t {
          start
          end
        }
        w {
          start
          end
        }
        th {
          start
          end
        }
        f {
          start
          end
        }
        sa {
          start
          end
        }
        s {
          start
          end
        }
      }
      checkedInOnly
      hideResolvedChats
      awayMessage {
        message
        showTime
      }
    }
    bookingsSettings {
      enabled
      checkInTime
      checkOutTime
      contactMethods {
        appMessaging
        phoneNumber
        email
      }
      maxNumberOfRooms
      maxPartySize
      preArrival {
        notifications {
          app
          email
          reminders {
            value
            duration
          }
        }
        minHoursBeforeCheckIn
        email
        fields {
          bookingReference
          name
          datesOfStay
          estimatedTimeOfArrival
          numberOfAdults
          numberOfChildren
          clubMemberNumber
          countryOfResidence
          address
          nationality
          customFields {
            title
            type
          }
          dateOfBirth
          dietaryRequirements
          purposeOfStay
          specialOccasions
          job
          company
          passportScan
          passportNumber
          foreignNationalPassportNumber
          party {
            adult {
              nextDestination
              foreignNationalNextDestination
              job
              company
              name
              countryOfResidence
              address
              nationality
              passportNumber
              foreignNationalPassportNumber
              mobile
              email
              dateOfBirth
              dietaryRequirements
            }
            child {
              name
              countryOfResidence
              address
              nationality
              passportNumber
              foreignNationalPassportNumber
              mobile
              email
              dateOfBirth
              dietaryRequirements
            }
          }
        }
        terms {
          message
          link
        }
      }
      arrival {
        entryMethods {
          frontDesk
          appKey
        }
        instructions {
          display
          steps
        }
      }
      departure {
        notifications {
          app
          email
          reminders {
            value
            duration
          }
        }
      }
      customization {
        checkInStart {
          title
          message
        }
        checkInReview {
          title
          message
        }
        checkInSuccess {
          title
          message
        }
        checkInUnsuccessful {
          title
          message
        }
      }
    }
    pmsSettings {
      pmsId
      mewsSettings {
        orderableServiceId
        bookableServiceId
      }
    }
    customLinks {
      id
      enabled
      name
      link
      photo
    }
    integrations {
      mews {
        provider
        type
      }
      marketplaceApps {
        id
        name
        type
      }
    }
    group {
      integrations {
        apaleo {
          provider
          type
        }
        omnivore {
          type
        }
      }
      app {
        aggregator
        versionCode
        domain
        disabled
        disabledReason
        metadata {
          title
          subtitle
          shortDescription
          fullDescription
          keywords
          icon
          screenshots {
            ios {
              _1
              _2
              _3
            }
            ios55 {
              _1
              _2
              _3
            }
            android {
              featureGraphic
            }
          }
          ios {
            appStoreId
          }
        }
        assets {
          featuredImage
          featuredLogo
        }
        forceUpdate
        experimental {
          hideProfile
        }
      }
      id
      dateCreated
      deleted
      dateUpdated
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const UpdateMarketplaceAppDocument = gql`
    mutation updateMarketplaceApp($where: MarketplaceAppWhereInput!, $data: UpdateMarketplaceAppInput!) {
  updateMarketplaceApp(where: $where, data: $data) {
    name
    description
    type
    logo
    websiteURL
    documentationURL
    helpURL
    redirectURLs
    connectLink
    live
    enabled
    developer {
      id
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const UpdateMarketplaceAppSubscriptionDocument = gql`
    mutation updateMarketplaceAppSubscription($where: MarketplaceAppSubscriptionWhereInput!, $data: UpdateMarketplaceAppSubscriptionInput!) {
  updateMarketplaceAppSubscription(where: $where, data: $data) {
    id
    endpoint
    topics
  }
}
    `;
export const UpdateOrderDocument = gql`
    mutation updateOrder($where: OrderWhereInput!, $data: UpdateOrderInput!) {
  updateOrder(where: $where, data: $data) {
    dateApproved
    dateReady
    dateCompleted
    dateScheduled
    items {
      id
      name
      posId
      modifiers {
        id
        name
        posId
        options {
          id
          name
          posId
          price
        }
      }
      discount {
        id
        posId
        value
        type
        name
      }
      quantity
      posSettings {
        posId
        name
      }
      totalPrice
      omnivoreSettings {
        tableService {
          posId
          name
          price
        }
        roomService {
          posId
          name
          price
        }
      }
    }
    totalPrice
    roomNumber
    notes
    cardDetails {
      id
      country
      brand
      last4
    }
    paymentProvider
    paymentType
    orderReference
    posId
    subtotal
    discount {
      id
      posId
      value
      type
      name
    }
    surcharges {
      id
      posId
      value
      type
      name
    }
    reasonRejected
    rejected
    delivery
    collection
    paid
    feedback {
      rating
    }
    guest {
      lastName
      firstName
      id
    }
    space {
      name
      id
    }
    pricelist {
      name
      id
    }
    thread {
      id
    }
    status
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const UpdatePricelistDocument = gql`
    mutation updatePricelist($where: PricelistWhereInput!, $data: UpdatePricelistInput!) {
  updatePricelist(where: $where, data: $data) {
    name
    description
    availability {
      m {
        start
        end
      }
      t {
        start
        end
      }
      w {
        start
        end
      }
      th {
        start
        end
      }
      f {
        start
        end
      }
      sa {
        start
        end
      }
      s {
        start
        end
      }
    }
    commerce
    collection {
      enabled
      type
    }
    delivery {
      enabled
      type
    }
    catalog {
      categories {
        id
        name
        description
        posId
        items {
          id
          name
          description
          photos
          modifiers {
            id
            name
            posId
            required
            maxSelection
            options {
              id
              name
              posId
              price
            }
          }
          regularPrice
          roomServicePrice
          posSettings {
            roomService {
              posId
              name
              price
            }
            tableService {
              posId
              name
              price
            }
            priceLevels {
              posId
              name
              price
            }
          }
          labels {
            id
            name
          }
          note
          posId
          snoozed
          promotions {
            discounts {
              id
              name
              value
              available
              level
              minOrderAmount
              type
              posSettings {
                open
              }
              posId
              delivery {
                enabled
                type
              }
              collection {
                enabled
                type
              }
              count
            }
          }
        }
      }
      labels {
        id
        name
      }
    }
    posSettings {
      enabled
      posId
      revenueCenterId
      tableService {
        posId
        name
      }
      roomService {
        posId
        name
      }
      employeeId
      provider
    }
    promotions {
      discounts {
        id
        name
        value
        available
        level
        minOrderAmount
        type
        posSettings {
          open
        }
        posId
        delivery {
          enabled
          type
        }
        collection {
          enabled
          type
        }
        count
      }
    }
    surcharges {
      id
      name
      value
      type
      delivery {
        enabled
        type
      }
      collection {
        enabled
        type
      }
    }
    enabledPayments {
      card
      roomBill
      cash
    }
    autoApprove
    feedback
    posId
    space {
      name
      location
      availability {
        m {
          start
          end
        }
        t {
          start
          end
        }
        w {
          start
          end
        }
        th {
          start
          end
        }
        f {
          start
          end
        }
        sa {
          start
          end
        }
        s {
          start
          end
        }
      }
      enabled
      id
      dateCreated
      deleted
      dateUpdated
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const UpdateProductDocument = gql`
    mutation updateProduct($where: ProductWhereInput!, $data: UpdateProductInput!) {
  updateProduct(where: $where, data: $data) {
    name
    code
    stock
    sellPrice
    costPrice
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const UpdateSaleDocument = gql`
    mutation updateSale($where: SaleWhereInput!, $data: UpdateSaleInput!) {
  updateSale(where: $where, data: $data) {
    items {
      id
      productId
      title
      quantity
      totalSell
      totalCost
    }
    totalPrice
    salesReference
    subtotal
    customer {
      address
      phone
      nic
      lastName
      firstName
      id
    }
    instalmentPlan {
      noTerms
      initialPayment
      terms {
        id
        dueDate
        dueAmount
        paidAmount
        completed
      }
    }
    cancelled
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const UpdateSpaceDocument = gql`
    mutation updateSpace($where: SpaceWhereInput!, $data: UpdateSpaceInput!) {
  updateSpace(where: $where, data: $data) {
    name
    location
    availability {
      m {
        start
        end
      }
      t {
        start
        end
      }
      w {
        start
        end
      }
      th {
        start
        end
      }
      f {
        start
        end
      }
      sa {
        start
        end
      }
      s {
        start
        end
      }
    }
    enabled
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const UpdateStripeExternalAccountDocument = gql`
    mutation updateStripeExternalAccount($accountNumber: String!, $sortCode: String!, $payoutSchedule: StripeExternalAccountPayoutScheduleInput!) {
  updateStripeExternalAccount(
    accountNumber: $accountNumber
    sortCode: $sortCode
    payoutSchedule: $payoutSchedule
  )
}
    `;
export const UpdateThreadDocument = gql`
    mutation updateThread($where: ThreadWhereInput!, $data: UpdateThreadInput!) {
  updateThread(where: $where, data: $data) {
    resolved
    guest {
      mobileCountryCode
      mobile
      lastName
      firstName
      email
      id
    }
    order {
      pricelist {
        id
        name
      }
      space {
        id
        name
      }
      discount {
        value
        name
      }
      subtotal
      orderReference
      totalPrice
      dateCreated
      id
      id
    }
    lastMessage {
      author
      text
      dateCreated
      id
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const UpdateUserDocument = gql`
    mutation updateUser($where: UserWhereInput, $data: UpdateUserInput!) {
  updateUser(where: $where, data: $data) {
    email
    firstName
    lastName
    mobile
    jobTitle
    groupAdmin
    hotelManager
    developer
    pushSubscriptions {
      id
      enabled
      pushSubscription {
        endpoint
        expirationTime
        keys {
          p256dh
          auth
        }
      }
      device {
        vendor
        model
        type
        browser
        os
      }
      sound
      dateUpdated
    }
    notifications {
      orders
      bookings
      messages
    }
    group {
      hotelManager
      name
      id
    }
    hotels {
      name
      id
    }
    roles {
      hotel {
        id
      }
      role
      id
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const UploadAppAssetDocument = gql`
    mutation uploadAppAsset($file: Upload!) {
  uploadAppAsset(file: $file)
}
    `;
export const UserLoginDocument = gql`
    mutation userLogin {
  userLogin {
    email
    firstName
    lastName
    mobile
    jobTitle
    groupAdmin
    hotelManager
    developer
    pushSubscriptions {
      id
      enabled
      pushSubscription {
        endpoint
        expirationTime
        keys {
          p256dh
          auth
        }
      }
      device {
        vendor
        model
        type
        browser
        os
      }
      sound
      dateUpdated
    }
    notifications {
      orders
      bookings
      messages
    }
    hotels {
      name
      id
    }
    roles {
      hotel {
        id
      }
      role
      id
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const UserLogoutDocument = gql`
    mutation userLogout {
  userLogout
}
    `;
export const UserTokenLoginDocument = gql`
    mutation userTokenLogin($email: String!, $password: String!) {
  userTokenLogin(email: $email, password: $password) {
    email
    firstName
    lastName
    mobile
    jobTitle
    groupAdmin
    hotelManager
    developer
    pushSubscriptions {
      id
      enabled
      pushSubscription {
        endpoint
        expirationTime
        keys {
          p256dh
          auth
        }
      }
      device {
        vendor
        model
        type
        browser
        os
      }
      sound
      dateUpdated
    }
    notifications {
      orders
      bookings
      messages
    }
    hotels {
      name
      id
    }
    roles {
      hotel {
        id
      }
      role
      id
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const AccessTokenDocument = gql`
    query accessToken($authToken: String, $refreshToken: String, $hotelId: String) {
  accessToken(
    authToken: $authToken
    refreshToken: $refreshToken
    hotelId: $hotelId
  ) {
    accessToken
    refreshToken
    ttl
    grantLevel
  }
}
    `;
export const AccessTokenValidDocument = gql`
    query accessTokenValid {
  accessTokenValid
}
    `;
export const ActiveOrdersCountDocument = gql`
    query activeOrdersCount {
  activeOrdersCount
}
    `;
export const ApaleoPropertiesDocument = gql`
    query apaleoProperties {
  apaleoProperties {
    id
    name
  }
}
    `;
export const AttractionDocument = gql`
    query attraction {
  attraction {
    catalog {
      categories {
        id
        name
        description
        places {
          id
          placeId
          name
          address
          rating
          note
          coordinates {
            lat
            lng
          }
          photos
          description
          website
          phone
          requestBooking
          labels {
            id
            name
          }
        }
      }
      labels {
        id
        name
      }
    }
    enabled
    description
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const AttractionPlacebyPlaceIdDocument = gql`
    query attractionPlacebyPlaceID($placeId: String!) {
  attractionPlacebyPlaceID(placeId: $placeId) {
    id
    placeId
    name
    address
    rating
    note
    coordinates {
      lat
      lng
    }
    photos
    description
    website
    phone
    requestBooking
    labels {
      id
      name
    }
  }
}
    `;
export const BookingDocument = gql`
    query booking($where: WhereInputType!) {
  booking(where: $where) {
    roomNumber
    bookingReference
    checkInDate
    checkOutDate
    carRegistration
    party {
      id
      firstName
      lastName
      ageGroup
      email
      mobile
      mobileCountryCode
      countryOfResidence
      address
      nationality
      passportNumber
      nextDestination
      dateOfBirth
      dietaryRequirements
      purposeOfStay
      specialOccasions
      job
      company
      pmsId
      carRegistration
    }
    bookingDetails {
      toggleQuestion {
        result
        toggle
        title
        type
      }
    }
    roomType
    estimatedTimeOfArrival
    numberOfAdults
    numberOfChildren
    clubMemberNumber
    purposeOfStay
    pmsId
    dateReviewed
    dateSubmitted
    dateCheckedIn
    dateCheckedOut
    dateCanceled
    guest {
      mobileCountryCode
      email
      mobile
      lastName
      firstName
      id
    }
    status
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const BookingAnalyticsDocument = gql`
    query bookingAnalytics($startDate: DateTime, $endDate: DateTime) {
  bookingAnalytics(startDate: $startDate, endDate: $endDate) {
    noArrivals
    noDepartures
    noSubmittedBookings
  }
}
    `;
export const BookingsDocument = gql`
    query bookings($sort: BookingSortInput, $limit: Float, $offset: Float, $guestId: String) {
  bookings(sort: $sort, limit: $limit, offset: $offset, guestId: $guestId) {
    roomNumber
    bookingReference
    checkInDate
    checkOutDate
    carRegistration
    party {
      id
      firstName
      lastName
      ageGroup
      email
      mobile
      mobileCountryCode
      countryOfResidence
      address
      nationality
      passportNumber
      nextDestination
      dateOfBirth
      dietaryRequirements
      purposeOfStay
      specialOccasions
      job
      company
      pmsId
      carRegistration
    }
    bookingDetails {
      toggleQuestion {
        result
        toggle
        title
        type
      }
    }
    roomType
    estimatedTimeOfArrival
    numberOfAdults
    numberOfChildren
    clubMemberNumber
    purposeOfStay
    pmsId
    dateReviewed
    dateSubmitted
    dateCheckedIn
    dateCheckedOut
    dateCanceled
    guest {
      mobileCountryCode
      email
      mobile
      lastName
      firstName
      id
    }
    status
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const CustomDomainDocument = gql`
    query customDomain {
  customDomain {
    id
    domain
    configured
    clientStatus
  }
}
    `;
export const CustomerDocument = gql`
    query customer($where: WhereInputType!) {
  customer(where: $where) {
    firstName
    lastName
    nic
    phone
    address
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const CustomersDocument = gql`
    query customers {
  customers {
    firstName
    lastName
    nic
    phone
    address
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const FindBookingDocument = gql`
    query findBooking($bookingReference: String, $firstName: String!, $lastName: String!, $checkInDate: DateTime!, $checkOutDate: DateTime!) {
  findBooking(
    bookingReference: $bookingReference
    firstName: $firstName
    lastName: $lastName
    checkInDate: $checkInDate
    checkOutDate: $checkOutDate
  ) {
    roomNumber
    bookingReference
    checkInDate
    checkOutDate
    carRegistration
    party {
      id
      firstName
      lastName
      ageGroup
      email
      mobile
      mobileCountryCode
      countryOfResidence
      address
      nationality
      passportNumber
      nextDestination
      dateOfBirth
      dietaryRequirements
      purposeOfStay
      specialOccasions
      job
      company
      pmsId
      carRegistration
    }
    bookingDetails {
      toggleQuestion {
        result
        toggle
        title
        type
      }
    }
    roomType
    estimatedTimeOfArrival
    numberOfAdults
    numberOfChildren
    clubMemberNumber
    purposeOfStay
    pmsId
    dateReviewed
    dateSubmitted
    dateCheckedIn
    dateCheckedOut
    dateCanceled
    guest {
      mobileCountryCode
      email
      mobile
      lastName
      firstName
      id
    }
    status
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const GenerateAttractionPlacesCategoriesDocument = gql`
    query generateAttractionPlacesCategories {
  generateAttractionPlacesCategories {
    name
  }
}
    `;
export const GooglePlacesHotelDetailsDocument = gql`
    query googlePlacesHotelDetails($placeId: String!, $sessionToken: String!) {
  googlePlacesHotelDetails(placeId: $placeId, sessionToken: $sessionToken) {
    placeId
    name
    line1
    line2
    town
    postalCode
    country
    countryCode
    coordinates {
      lat
      lng
    }
  }
}
    `;
export const GooglePlacesHotelSearchDocument = gql`
    query googlePlacesHotelSearch($query: String!, $sessionToken: String!) {
  googlePlacesHotelSearch(query: $query, sessionToken: $sessionToken) {
    placeId
    title
    description
  }
}
    `;
export const GuestDocument = gql`
    query guest($where: WhereInputType) {
  guest(where: $where) {
    deviceId
    email
    firstName
    lastName
    mobile
    mobileCountryCode
    dateOfBirth
    countryOfResidence
    address
    nationality
    passportNumber
    dietaryRequirements
    company
    job
    pmsId
    bookings {
      roomNumber
      bookingReference
      checkInDate
      checkOutDate
      carRegistration
      party {
        id
        firstName
        lastName
        ageGroup
        email
        mobile
        mobileCountryCode
        countryOfResidence
        address
        nationality
        passportNumber
        nextDestination
        dateOfBirth
        dietaryRequirements
        purposeOfStay
        specialOccasions
        job
        company
        pmsId
        carRegistration
      }
      bookingDetails {
        toggleQuestion {
          result
          toggle
          title
          type
        }
      }
      roomType
      estimatedTimeOfArrival
      numberOfAdults
      numberOfChildren
      clubMemberNumber
      purposeOfStay
      pmsId
      dateReviewed
      dateSubmitted
      dateCheckedIn
      dateCheckedOut
      dateCanceled
      guest {
        mobileCountryCode
        email
        mobile
        lastName
        firstName
        id
      }
      status
      id
      dateCreated
      deleted
      dateUpdated
    }
    threads {
      id
    }
    orders {
      id
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const GuestPaymentMethodsDocument = gql`
    query guestPaymentMethods {
  guestPaymentMethods {
    id
    brand
    country
    last4
  }
}
    `;
export const GuestWithStatisticsDocument = gql`
    query guestWithStatistics($where: WhereInputType) {
  guest(where: $where) {
    totalSpend
    ordersCount
    itemsCount
    deviceId
    email
    firstName
    lastName
    mobile
    mobileCountryCode
    dateOfBirth
    countryOfResidence
    address
    nationality
    passportNumber
    dietaryRequirements
    company
    job
    pmsId
    bookings {
      roomNumber
      bookingReference
      checkInDate
      checkOutDate
      carRegistration
      party {
        id
        firstName
        lastName
        ageGroup
        email
        mobile
        mobileCountryCode
        countryOfResidence
        address
        nationality
        passportNumber
        nextDestination
        dateOfBirth
        dietaryRequirements
        purposeOfStay
        specialOccasions
        job
        company
        pmsId
        carRegistration
      }
      bookingDetails {
        toggleQuestion {
          result
          toggle
          title
          type
        }
      }
      roomType
      estimatedTimeOfArrival
      numberOfAdults
      numberOfChildren
      clubMemberNumber
      purposeOfStay
      pmsId
      dateReviewed
      dateSubmitted
      dateCheckedIn
      dateCheckedOut
      dateCanceled
      guest {
        mobileCountryCode
        email
        mobile
        lastName
        firstName
        id
      }
      status
      id
      dateCreated
      deleted
      dateUpdated
    }
    threads {
      id
    }
    orders {
      id
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const GuestsDocument = gql`
    query guests($sort: GuestsSortInput, $limit: Float, $offset: Float) {
  guests(sort: $sort, limit: $limit, offset: $offset) {
    deviceId
    email
    firstName
    lastName
    mobile
    mobileCountryCode
    dateOfBirth
    countryOfResidence
    address
    nationality
    passportNumber
    dietaryRequirements
    company
    job
    pmsId
    bookings {
      roomNumber
      bookingReference
      checkInDate
      checkOutDate
      carRegistration
      party {
        id
        firstName
        lastName
        ageGroup
        email
        mobile
        mobileCountryCode
        countryOfResidence
        address
        nationality
        passportNumber
        nextDestination
        dateOfBirth
        dietaryRequirements
        purposeOfStay
        specialOccasions
        job
        company
        pmsId
        carRegistration
      }
      bookingDetails {
        toggleQuestion {
          result
          toggle
          title
          type
        }
      }
      roomType
      estimatedTimeOfArrival
      numberOfAdults
      numberOfChildren
      clubMemberNumber
      purposeOfStay
      pmsId
      dateReviewed
      dateSubmitted
      dateCheckedIn
      dateCheckedOut
      dateCanceled
      guest {
        mobileCountryCode
        email
        mobile
        lastName
        firstName
        id
      }
      status
      id
      dateCreated
      deleted
      dateUpdated
    }
    threads {
      id
    }
    orders {
      id
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const HmPayAccountDocument = gql`
    query hmPayAccount {
  hmPayAccount {
    accountNumberLast4
    sortCode
    payoutSchedule {
      interval
      date
    }
    dateCreated
  }
}
    `;
export const HmPayPayoutsDocument = gql`
    query hmPayPayouts {
  hmPayPayouts {
    totalPrice
    arrivalDate
  }
}
    `;
export const HotelDocument = gql`
    query hotel {
  hotel {
    name
    telephone
    address {
      line1
      line2
      town
      country
      postalCode
      coordinates {
        lat
        lng
      }
      placeId
    }
    website
    currencyCode
    countryCode
    app {
      versionCode
      domain
      disabled
      disabledReason
      metadata {
        title
        subtitle
        shortDescription
        fullDescription
        keywords
        icon
        screenshots {
          ios {
            _1
            _2
            _3
          }
          ios55 {
            _1
            _2
            _3
          }
          android {
            featureGraphic
          }
        }
        ios {
          appStoreId
        }
      }
      assets {
        featuredImage
        featuredLogo
      }
      forceUpdate
      experimental {
        hideProfile
      }
    }
    payouts {
      stripe {
        accountId
        linked
        publicKey
        dateCreated
      }
      hm {
        accountNumberLast4
        sortCode
        payoutSchedule {
          interval
          date
        }
        dateCreated
      }
      enabled
    }
    messagesSettings {
      enabled
      availability {
        m {
          start
          end
        }
        t {
          start
          end
        }
        w {
          start
          end
        }
        th {
          start
          end
        }
        f {
          start
          end
        }
        sa {
          start
          end
        }
        s {
          start
          end
        }
      }
      checkedInOnly
      hideResolvedChats
      awayMessage {
        message
        showTime
      }
    }
    bookingsSettings {
      enabled
      checkInTime
      checkOutTime
      contactMethods {
        appMessaging
        phoneNumber
        email
      }
      maxNumberOfRooms
      maxPartySize
      preArrival {
        notifications {
          app
          email
          reminders {
            value
            duration
          }
        }
        minHoursBeforeCheckIn
        email
        fields {
          bookingReference
          name
          datesOfStay
          estimatedTimeOfArrival
          numberOfAdults
          numberOfChildren
          clubMemberNumber
          countryOfResidence
          address
          nationality
          customFields {
            title
            type
          }
          dateOfBirth
          dietaryRequirements
          purposeOfStay
          specialOccasions
          job
          company
          passportScan
          passportNumber
          foreignNationalPassportNumber
          party {
            adult {
              nextDestination
              foreignNationalNextDestination
              job
              company
              name
              countryOfResidence
              address
              nationality
              passportNumber
              foreignNationalPassportNumber
              mobile
              email
              dateOfBirth
              dietaryRequirements
            }
            child {
              name
              countryOfResidence
              address
              nationality
              passportNumber
              foreignNationalPassportNumber
              mobile
              email
              dateOfBirth
              dietaryRequirements
            }
          }
        }
        terms {
          message
          link
        }
      }
      arrival {
        entryMethods {
          frontDesk
          appKey
        }
        instructions {
          display
          steps
        }
      }
      departure {
        notifications {
          app
          email
          reminders {
            value
            duration
          }
        }
      }
      customization {
        checkInStart {
          title
          message
        }
        checkInReview {
          title
          message
        }
        checkInSuccess {
          title
          message
        }
        checkInUnsuccessful {
          title
          message
        }
      }
    }
    pmsSettings {
      pmsId
      mewsSettings {
        orderableServiceId
        bookableServiceId
      }
    }
    customLinks {
      id
      enabled
      name
      link
      photo
    }
    integrations {
      mews {
        provider
        type
      }
      marketplaceApps {
        id
        name
        type
      }
    }
    group {
      integrations {
        apaleo {
          provider
          type
        }
        omnivore {
          type
        }
      }
      app {
        aggregator
        versionCode
        domain
        disabled
        disabledReason
        metadata {
          title
          subtitle
          shortDescription
          fullDescription
          keywords
          icon
          screenshots {
            ios {
              _1
              _2
              _3
            }
            ios55 {
              _1
              _2
              _3
            }
            android {
              featureGraphic
            }
          }
          ios {
            appStoreId
          }
        }
        assets {
          featuredImage
          featuredLogo
        }
        forceUpdate
        experimental {
          hideProfile
        }
      }
      id
      dateCreated
      deleted
      dateUpdated
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const HotelIdByDomainDocument = gql`
    query hotelIDByDomain($domain: String!) {
  hotelIDByDomain(domain: $domain)
}
    `;
export const HotelsDocument = gql`
    query hotels($groupId: String!) {
  hotels(groupId: $groupId) {
    name
    telephone
    address {
      line1
      line2
      town
      country
      postalCode
      coordinates {
        lat
        lng
      }
      placeId
    }
    website
    currencyCode
    countryCode
    app {
      versionCode
      domain
      disabled
      disabledReason
      metadata {
        title
        subtitle
        shortDescription
        fullDescription
        keywords
        icon
        screenshots {
          ios {
            _1
            _2
            _3
          }
          ios55 {
            _1
            _2
            _3
          }
          android {
            featureGraphic
          }
        }
        ios {
          appStoreId
        }
      }
      assets {
        featuredImage
        featuredLogo
      }
      forceUpdate
      experimental {
        hideProfile
      }
    }
    payouts {
      stripe {
        accountId
        linked
        publicKey
        dateCreated
      }
      hm {
        accountNumberLast4
        sortCode
        payoutSchedule {
          interval
          date
        }
        dateCreated
      }
      enabled
    }
    messagesSettings {
      enabled
      availability {
        m {
          start
          end
        }
        t {
          start
          end
        }
        w {
          start
          end
        }
        th {
          start
          end
        }
        f {
          start
          end
        }
        sa {
          start
          end
        }
        s {
          start
          end
        }
      }
      checkedInOnly
      hideResolvedChats
      awayMessage {
        message
        showTime
      }
    }
    bookingsSettings {
      enabled
      checkInTime
      checkOutTime
      contactMethods {
        appMessaging
        phoneNumber
        email
      }
      maxNumberOfRooms
      maxPartySize
      preArrival {
        notifications {
          app
          email
          reminders {
            value
            duration
          }
        }
        minHoursBeforeCheckIn
        email
        fields {
          bookingReference
          name
          datesOfStay
          estimatedTimeOfArrival
          numberOfAdults
          numberOfChildren
          clubMemberNumber
          countryOfResidence
          address
          nationality
          customFields {
            title
            type
          }
          dateOfBirth
          dietaryRequirements
          purposeOfStay
          specialOccasions
          job
          company
          passportScan
          passportNumber
          foreignNationalPassportNumber
          party {
            adult {
              nextDestination
              foreignNationalNextDestination
              job
              company
              name
              countryOfResidence
              address
              nationality
              passportNumber
              foreignNationalPassportNumber
              mobile
              email
              dateOfBirth
              dietaryRequirements
            }
            child {
              name
              countryOfResidence
              address
              nationality
              passportNumber
              foreignNationalPassportNumber
              mobile
              email
              dateOfBirth
              dietaryRequirements
            }
          }
        }
        terms {
          message
          link
        }
      }
      arrival {
        entryMethods {
          frontDesk
          appKey
        }
        instructions {
          display
          steps
        }
      }
      departure {
        notifications {
          app
          email
          reminders {
            value
            duration
          }
        }
      }
      customization {
        checkInStart {
          title
          message
        }
        checkInReview {
          title
          message
        }
        checkInSuccess {
          title
          message
        }
        checkInUnsuccessful {
          title
          message
        }
      }
    }
    pmsSettings {
      pmsId
      mewsSettings {
        orderableServiceId
        bookableServiceId
      }
    }
    customLinks {
      id
      enabled
      name
      link
      photo
    }
    integrations {
      mews {
        provider
        type
      }
      marketplaceApps {
        id
        name
        type
      }
    }
    group {
      integrations {
        apaleo {
          provider
          type
        }
        omnivore {
          type
        }
      }
      app {
        aggregator
        versionCode
        domain
        disabled
        disabledReason
        metadata {
          title
          subtitle
          shortDescription
          fullDescription
          keywords
          icon
          screenshots {
            ios {
              _1
              _2
              _3
            }
            ios55 {
              _1
              _2
              _3
            }
            android {
              featureGraphic
            }
          }
          ios {
            appStoreId
          }
        }
        assets {
          featuredImage
          featuredLogo
        }
        forceUpdate
        experimental {
          hideProfile
        }
      }
      id
      dateCreated
      deleted
      dateUpdated
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const MarketplaceAppDocument = gql`
    query marketplaceApp($live: Boolean, $enabled: Boolean, $where: GetMarketplaceAppWhereInput!) {
  marketplaceApp(live: $live, enabled: $enabled, where: $where) {
    name
    description
    type
    logo
    websiteURL
    documentationURL
    helpURL
    redirectURLs
    connectLink
    live
    enabled
    developer {
      id
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const MarketplaceAppSubscriptionsDocument = gql`
    query marketplaceAppSubscriptions {
  marketplaceAppSubscriptions {
    id
    endpoint
    topics
  }
}
    `;
export const MarketplaceAppsDocument = gql`
    query marketplaceApps($live: Boolean, $enabled: Boolean) {
  marketplaceApps(live: $live, enabled: $enabled) {
    name
    description
    type
    logo
    websiteURL
    documentationURL
    helpURL
    redirectURLs
    connectLink
    live
    enabled
    developer {
      id
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const MessagesDocument = gql`
    query messages($sort: OrdersSortInput, $limit: Float, $offset: Float, $threadId: String!) {
  messages(sort: $sort, limit: $limit, offset: $offset, threadId: $threadId) {
    text
    author
    thread {
      guest {
        firstName
        email
        id
        lastName
      }
      resolved
      dateUpdated
      dateCreated
      id
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const MewsServicesDocument = gql`
    query mewsServices {
  mewsServices {
    id
    name
    type
  }
}
    `;
export const OmnivoreDiscountsDocument = gql`
    query omnivoreDiscounts($locationId: String!) {
  omnivoreDiscounts(locationId: $locationId) {
    id
    value
    name
    available
    order
    item
    open
    maxAmount
    minAmount
    maxPercent
    minPercent
    minOrderAmount
    type
    posId
  }
}
    `;
export const OmnivoreLocationsDocument = gql`
    query omnivoreLocations {
  omnivoreLocations {
    id
    provider
  }
}
    `;
export const OmnivoreOptionsDocument = gql`
    query omnivoreOptions($locationId: String!) {
  omnivoreOptions(locationId: $locationId) {
    employees {
      id
      name
    }
    orderTypes {
      id
      name
    }
    revenueCenters {
      id
      name
    }
  }
}
    `;
export const OmnivoreTablesDocument = gql`
    query omnivoreTables($locationId: String!) {
  omnivoreTables(locationId: $locationId) {
    id
    name
  }
}
    `;
export const OrderDocument = gql`
    query order($where: WhereInputType!) {
  order(where: $where) {
    dateApproved
    dateReady
    dateCompleted
    dateScheduled
    items {
      id
      name
      posId
      modifiers {
        id
        name
        posId
        options {
          id
          name
          posId
          price
        }
      }
      discount {
        id
        posId
        value
        type
        name
      }
      quantity
      posSettings {
        posId
        name
      }
      totalPrice
      omnivoreSettings {
        tableService {
          posId
          name
          price
        }
        roomService {
          posId
          name
          price
        }
      }
    }
    totalPrice
    roomNumber
    notes
    cardDetails {
      id
      country
      brand
      last4
    }
    paymentProvider
    paymentType
    orderReference
    posId
    subtotal
    discount {
      id
      posId
      value
      type
      name
    }
    surcharges {
      id
      posId
      value
      type
      name
    }
    reasonRejected
    rejected
    delivery
    collection
    paid
    feedback {
      rating
    }
    guest {
      lastName
      firstName
      id
    }
    space {
      name
      id
    }
    pricelist {
      name
      id
    }
    thread {
      id
    }
    status
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const OrdersDocument = gql`
    query orders($sort: OrdersSortInput, $limit: Float, $offset: Float, $guestId: String, $completed: Boolean, $rejected: Boolean, $startDate: DateTime, $endDate: DateTime) {
  orders(
    sort: $sort
    limit: $limit
    offset: $offset
    guestId: $guestId
    completed: $completed
    rejected: $rejected
    startDate: $startDate
    endDate: $endDate
  ) {
    dateApproved
    dateReady
    dateCompleted
    dateScheduled
    items {
      id
      name
      posId
      modifiers {
        id
        name
        posId
        options {
          id
          name
          posId
          price
        }
      }
      discount {
        id
        posId
        value
        type
        name
      }
      quantity
      posSettings {
        posId
        name
      }
      totalPrice
      omnivoreSettings {
        tableService {
          posId
          name
          price
        }
        roomService {
          posId
          name
          price
        }
      }
    }
    totalPrice
    roomNumber
    notes
    cardDetails {
      id
      country
      brand
      last4
    }
    paymentProvider
    paymentType
    orderReference
    posId
    subtotal
    discount {
      id
      posId
      value
      type
      name
    }
    surcharges {
      id
      posId
      value
      type
      name
    }
    reasonRejected
    rejected
    delivery
    collection
    paid
    feedback {
      rating
    }
    guest {
      lastName
      firstName
      id
    }
    space {
      name
      id
    }
    pricelist {
      name
      id
    }
    thread {
      id
    }
    status
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const OutstandingGuestsDocument = gql`
    query outstandingGuests($guestId: String, $completed: Boolean, $rejected: Boolean, $startDate: DateTime, $endDate: DateTime, $sort: OrdersSortInput, $limit: Float, $offset: Float, $paymentType: PaymentType) {
  outstandingGuests(
    guestId: $guestId
    completed: $completed
    rejected: $rejected
    startDate: $startDate
    endDate: $endDate
    sort: $sort
    limit: $limit
    offset: $offset
    paymentType: $paymentType
  ) {
    data {
      noOrders
      totalPrice
      guest {
        lastName
        firstName
        id
      }
    }
    count
  }
}
    `;
export const OutstandingOrdersStatisticsDocument = gql`
    query outstandingOrdersStatistics {
  outstandingOrdersStatistics {
    cash {
      paymentType
      noOrders
      totalPrice
      noGuests
    }
    roomBill {
      paymentType
      noOrders
      totalPrice
      noGuests
    }
  }
}
    `;
export const PricelistDocument = gql`
    query pricelist($where: WhereInputType!) {
  pricelist(where: $where) {
    name
    description
    availability {
      m {
        start
        end
      }
      t {
        start
        end
      }
      w {
        start
        end
      }
      th {
        start
        end
      }
      f {
        start
        end
      }
      sa {
        start
        end
      }
      s {
        start
        end
      }
    }
    commerce
    collection {
      enabled
      type
    }
    delivery {
      enabled
      type
    }
    catalog {
      categories {
        id
        name
        description
        posId
        items {
          id
          name
          description
          photos
          modifiers {
            id
            name
            posId
            required
            maxSelection
            options {
              id
              name
              posId
              price
            }
          }
          regularPrice
          roomServicePrice
          posSettings {
            roomService {
              posId
              name
              price
            }
            tableService {
              posId
              name
              price
            }
            priceLevels {
              posId
              name
              price
            }
          }
          labels {
            id
            name
          }
          note
          posId
          snoozed
          promotions {
            discounts {
              id
              name
              value
              available
              level
              minOrderAmount
              type
              posSettings {
                open
              }
              posId
              delivery {
                enabled
                type
              }
              collection {
                enabled
                type
              }
              count
            }
          }
        }
      }
      labels {
        id
        name
      }
    }
    posSettings {
      enabled
      posId
      revenueCenterId
      tableService {
        posId
        name
      }
      roomService {
        posId
        name
      }
      employeeId
      provider
    }
    promotions {
      discounts {
        id
        name
        value
        available
        level
        minOrderAmount
        type
        posSettings {
          open
        }
        posId
        delivery {
          enabled
          type
        }
        collection {
          enabled
          type
        }
        count
      }
    }
    surcharges {
      id
      name
      value
      type
      delivery {
        enabled
        type
      }
      collection {
        enabled
        type
      }
    }
    enabledPayments {
      card
      roomBill
      cash
    }
    autoApprove
    feedback
    posId
    space {
      name
      location
      availability {
        m {
          start
          end
        }
        t {
          start
          end
        }
        w {
          start
          end
        }
        th {
          start
          end
        }
        f {
          start
          end
        }
        sa {
          start
          end
        }
        s {
          start
          end
        }
      }
      enabled
      id
      dateCreated
      deleted
      dateUpdated
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const PricelistFeedbackDocument = gql`
    query pricelistFeedback($where: WhereInputType!) {
  pricelistFeedback(where: $where) {
    averageRating
    noReviews
    recentOrders {
      dateApproved
      dateReady
      dateCompleted
      dateScheduled
      items {
        id
        name
        posId
        modifiers {
          id
          name
          posId
          options {
            id
            name
            posId
            price
          }
        }
        discount {
          id
          posId
          value
          type
          name
        }
        quantity
        posSettings {
          posId
          name
        }
        totalPrice
        omnivoreSettings {
          tableService {
            posId
            name
            price
          }
          roomService {
            posId
            name
            price
          }
        }
      }
      totalPrice
      roomNumber
      notes
      cardDetails {
        id
        country
        brand
        last4
      }
      paymentProvider
      paymentType
      orderReference
      posId
      subtotal
      discount {
        id
        posId
        value
        type
        name
      }
      surcharges {
        id
        posId
        value
        type
        name
      }
      reasonRejected
      rejected
      delivery
      collection
      paid
      feedback {
        rating
      }
      guest {
        lastName
        firstName
        id
      }
      space {
        name
        id
      }
      pricelist {
        name
        id
      }
      thread {
        id
      }
      status
      id
      dateCreated
      deleted
      dateUpdated
    }
    ratings {
      value
      count
      percentage
    }
  }
}
    `;
export const PricelistsDocument = gql`
    query pricelists {
  pricelists {
    name
    description
    availability {
      m {
        start
        end
      }
      t {
        start
        end
      }
      w {
        start
        end
      }
      th {
        start
        end
      }
      f {
        start
        end
      }
      sa {
        start
        end
      }
      s {
        start
        end
      }
    }
    commerce
    collection {
      enabled
      type
    }
    delivery {
      enabled
      type
    }
    catalog {
      categories {
        id
        name
        description
        posId
        items {
          id
          name
          description
          photos
          modifiers {
            id
            name
            posId
            required
            maxSelection
            options {
              id
              name
              posId
              price
            }
          }
          regularPrice
          roomServicePrice
          posSettings {
            roomService {
              posId
              name
              price
            }
            tableService {
              posId
              name
              price
            }
            priceLevels {
              posId
              name
              price
            }
          }
          labels {
            id
            name
          }
          note
          posId
          snoozed
          promotions {
            discounts {
              id
              name
              value
              available
              level
              minOrderAmount
              type
              posSettings {
                open
              }
              posId
              delivery {
                enabled
                type
              }
              collection {
                enabled
                type
              }
              count
            }
          }
        }
      }
      labels {
        id
        name
      }
    }
    posSettings {
      enabled
      posId
      revenueCenterId
      tableService {
        posId
        name
      }
      roomService {
        posId
        name
      }
      employeeId
      provider
    }
    promotions {
      discounts {
        id
        name
        value
        available
        level
        minOrderAmount
        type
        posSettings {
          open
        }
        posId
        delivery {
          enabled
          type
        }
        collection {
          enabled
          type
        }
        count
      }
    }
    surcharges {
      id
      name
      value
      type
      delivery {
        enabled
        type
      }
      collection {
        enabled
        type
      }
    }
    enabledPayments {
      card
      roomBill
      cash
    }
    autoApprove
    feedback
    posId
    space {
      name
      location
      availability {
        m {
          start
          end
        }
        t {
          start
          end
        }
        w {
          start
          end
        }
        th {
          start
          end
        }
        f {
          start
          end
        }
        sa {
          start
          end
        }
        s {
          start
          end
        }
      }
      enabled
      id
      dateCreated
      deleted
      dateUpdated
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const ProductDocument = gql`
    query product($where: WhereInputType!) {
  product(where: $where) {
    name
    code
    stock
    sellPrice
    costPrice
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const ProductsDocument = gql`
    query products {
  products {
    name
    code
    stock
    sellPrice
    costPrice
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const SaleDocument = gql`
    query sale($where: WhereInputType!) {
  sale(where: $where) {
    items {
      id
      productId
      title
      quantity
      totalSell
      totalCost
    }
    totalPrice
    salesReference
    subtotal
    customer {
      address
      phone
      nic
      lastName
      firstName
      id
    }
    instalmentPlan {
      noTerms
      initialPayment
      terms {
        id
        dueDate
        dueAmount
        paidAmount
        completed
      }
    }
    cancelled
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const SalesDocument = gql`
    query sales($sort: SalesSortInput, $limit: Float, $offset: Float, $guestId: String, $completed: Boolean, $rejected: Boolean, $startDate: DateTime, $endDate: DateTime) {
  sales(
    sort: $sort
    limit: $limit
    offset: $offset
    guestId: $guestId
    completed: $completed
    rejected: $rejected
    startDate: $startDate
    endDate: $endDate
  ) {
    items {
      id
      productId
      title
      quantity
      totalSell
      totalCost
    }
    totalPrice
    salesReference
    subtotal
    customer {
      address
      phone
      nic
      lastName
      firstName
      id
    }
    instalmentPlan {
      noTerms
      initialPayment
      terms {
        id
        dueDate
        dueAmount
        paidAmount
        completed
      }
    }
    cancelled
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const SearchBookingsDocument = gql`
    query searchBookings($query: String, $limit: Float, $offset: Float, $status: String, $startCheckInDate: DateTime, $startCheckOutDate: DateTime, $endCheckInDate: DateTime, $endCheckOutDate: DateTime, $startDate: DateTime, $endDate: DateTime) {
  searchBookings(
    query: $query
    limit: $limit
    offset: $offset
    status: $status
    startCheckInDate: $startCheckInDate
    startCheckOutDate: $startCheckOutDate
    endCheckInDate: $endCheckInDate
    endCheckOutDate: $endCheckOutDate
    startDate: $startDate
    endDate: $endDate
  ) {
    data {
      roomNumber
      bookingReference
      checkInDate
      checkOutDate
      carRegistration
      party {
        id
        firstName
        lastName
        ageGroup
        email
        mobile
        mobileCountryCode
        countryOfResidence
        address
        nationality
        passportNumber
        nextDestination
        dateOfBirth
        dietaryRequirements
        purposeOfStay
        specialOccasions
        job
        company
        pmsId
        carRegistration
      }
      bookingDetails {
        toggleQuestion {
          result
          toggle
          title
          type
        }
      }
      roomType
      estimatedTimeOfArrival
      numberOfAdults
      numberOfChildren
      clubMemberNumber
      purposeOfStay
      pmsId
      dateReviewed
      dateSubmitted
      dateCheckedIn
      dateCheckedOut
      dateCanceled
      guest {
        mobileCountryCode
        email
        mobile
        lastName
        firstName
        id
      }
      status
      id
      dateCreated
      deleted
      dateUpdated
    }
    count
  }
}
    `;
export const SearchCustomAttractionPlaceDocument = gql`
    query searchCustomAttractionPlace($query: String!) {
  searchCustomAttractionPlace(query: $query) {
    placeId
    title
    description
  }
}
    `;
export const SearchCustomersDocument = gql`
    query searchCustomers($query: String, $limit: Float, $offset: Float, $outOfStockItems: Boolean) {
  searchCustomers(
    query: $query
    limit: $limit
    offset: $offset
    outOfStockItems: $outOfStockItems
  ) {
    data {
      firstName
      lastName
      nic
      phone
      address
      id
      dateCreated
      deleted
      dateUpdated
    }
    count
  }
}
    `;
export const SearchGuestsDocument = gql`
    query searchGuests($query: String, $limit: Float, $offset: Float, $anonGuests: Boolean, $startDate: DateTime, $endDate: DateTime) {
  searchGuests(
    query: $query
    limit: $limit
    offset: $offset
    anonGuests: $anonGuests
    startDate: $startDate
    endDate: $endDate
  ) {
    data {
      email
      firstName
      lastName
      mobile
      mobileCountryCode
      dateOfBirth
      countryOfResidence
      address
      nationality
      passportNumber
      dietaryRequirements
      company
      job
      pmsId
      id
      dateCreated
      deleted
      dateUpdated
    }
    count
  }
}
    `;
export const SearchOrdersDocument = gql`
    query searchOrders($query: String, $limit: Float, $offset: Float, $startDate: DateTime, $endDate: DateTime) {
  searchOrders(
    query: $query
    limit: $limit
    offset: $offset
    startDate: $startDate
    endDate: $endDate
  ) {
    data {
      dateApproved
      dateReady
      dateCompleted
      dateScheduled
      items {
        id
        name
        posId
        modifiers {
          id
          name
          posId
          options {
            id
            name
            posId
            price
          }
        }
        discount {
          id
          posId
          value
          type
          name
        }
        quantity
        posSettings {
          posId
          name
        }
        totalPrice
        omnivoreSettings {
          tableService {
            posId
            name
            price
          }
          roomService {
            posId
            name
            price
          }
        }
      }
      totalPrice
      roomNumber
      notes
      cardDetails {
        id
        country
        brand
        last4
      }
      paymentProvider
      paymentType
      orderReference
      posId
      subtotal
      discount {
        id
        posId
        value
        type
        name
      }
      surcharges {
        id
        posId
        value
        type
        name
      }
      reasonRejected
      rejected
      delivery
      collection
      paid
      feedback {
        rating
      }
      guest {
        mobile
        mobileCountryCode
        lastName
        firstName
        id
      }
      space {
        name
        id
      }
      pricelist {
        name
        id
      }
      thread {
        id
      }
      status
      id
      dateCreated
      deleted
      dateUpdated
    }
    count
  }
}
    `;
export const SearchOutstandingOrdersDocument = gql`
    query searchOutstandingOrders($query: String, $limit: Float, $offset: Float, $guestId: String, $paymentType: PaymentType) {
  searchOutstandingOrders(
    query: $query
    limit: $limit
    offset: $offset
    guestId: $guestId
    paymentType: $paymentType
  ) {
    data {
      dateApproved
      dateReady
      dateCompleted
      dateScheduled
      items {
        id
        name
        posId
        modifiers {
          id
          name
          posId
          options {
            id
            name
            posId
            price
          }
        }
        discount {
          id
          posId
          value
          type
          name
        }
        quantity
        posSettings {
          posId
          name
        }
        totalPrice
        omnivoreSettings {
          tableService {
            posId
            name
            price
          }
          roomService {
            posId
            name
            price
          }
        }
      }
      totalPrice
      roomNumber
      notes
      cardDetails {
        id
        country
        brand
        last4
      }
      paymentProvider
      paymentType
      orderReference
      posId
      subtotal
      discount {
        id
        posId
        value
        type
        name
      }
      surcharges {
        id
        posId
        value
        type
        name
      }
      reasonRejected
      rejected
      delivery
      collection
      paid
      feedback {
        rating
      }
      guest {
        mobile
        mobileCountryCode
        lastName
        firstName
        id
      }
      space {
        name
        id
      }
      pricelist {
        name
        id
      }
      thread {
        id
      }
      status
      id
      dateCreated
      deleted
      dateUpdated
    }
    count
  }
}
    `;
export const SearchProductsDocument = gql`
    query searchProducts($query: String, $limit: Float, $offset: Float, $outOfStockItems: Boolean) {
  searchProducts(
    query: $query
    limit: $limit
    offset: $offset
    outOfStockItems: $outOfStockItems
  ) {
    data {
      name
      code
      stock
      sellPrice
      costPrice
      id
      dateCreated
      deleted
      dateUpdated
    }
    count
  }
}
    `;
export const SearchSalesDocument = gql`
    query searchSales($query: String, $limit: Float, $offset: Float, $startDate: DateTime, $endDate: DateTime) {
  searchSales(
    query: $query
    limit: $limit
    offset: $offset
    startDate: $startDate
    endDate: $endDate
  ) {
    data {
      items {
        id
        productId
        title
        quantity
        totalSell
        totalCost
      }
      totalPrice
      salesReference
      subtotal
      customer {
        address
        phone
        nic
        lastName
        firstName
        id
      }
      instalmentPlan {
        noTerms
        initialPayment
        terms {
          id
          dueDate
          dueAmount
          paidAmount
          completed
        }
      }
      cancelled
      id
      dateCreated
      deleted
      dateUpdated
    }
    count
  }
}
    `;
export const SpaceDocument = gql`
    query space($where: WhereInputType!) {
  space(where: $where) {
    name
    location
    availability {
      m {
        start
        end
      }
      t {
        start
        end
      }
      w {
        start
        end
      }
      th {
        start
        end
      }
      f {
        start
        end
      }
      sa {
        start
        end
      }
      s {
        start
        end
      }
    }
    enabled
    pricelists {
      name
      description
      availability {
        m {
          start
          end
        }
        t {
          start
          end
        }
        w {
          start
          end
        }
        th {
          start
          end
        }
        f {
          start
          end
        }
        sa {
          start
          end
        }
        s {
          start
          end
        }
      }
      commerce
      collection {
        enabled
        type
      }
      delivery {
        enabled
        type
      }
      catalog {
        categories {
          id
          name
          description
          posId
          items {
            id
            name
            description
            photos
            modifiers {
              id
              name
              posId
              required
              maxSelection
              options {
                id
                name
                posId
                price
              }
            }
            regularPrice
            roomServicePrice
            posSettings {
              roomService {
                posId
                name
                price
              }
              tableService {
                posId
                name
                price
              }
              priceLevels {
                posId
                name
                price
              }
            }
            labels {
              id
              name
            }
            note
            posId
            snoozed
            promotions {
              discounts {
                id
                name
                value
                available
                level
                minOrderAmount
                type
                posSettings {
                  open
                }
                posId
                delivery {
                  enabled
                  type
                }
                collection {
                  enabled
                  type
                }
                count
              }
            }
          }
        }
        labels {
          id
          name
        }
      }
      posSettings {
        enabled
        posId
        revenueCenterId
        tableService {
          posId
          name
        }
        roomService {
          posId
          name
        }
        employeeId
        provider
      }
      promotions {
        discounts {
          id
          name
          value
          available
          level
          minOrderAmount
          type
          posSettings {
            open
          }
          posId
          delivery {
            enabled
            type
          }
          collection {
            enabled
            type
          }
          count
        }
      }
      surcharges {
        id
        name
        value
        type
        delivery {
          enabled
          type
        }
        collection {
          enabled
          type
        }
      }
      enabledPayments {
        card
        roomBill
        cash
      }
      autoApprove
      feedback
      posId
      space {
        name
        location
        availability {
          m {
            start
            end
          }
          t {
            start
            end
          }
          w {
            start
            end
          }
          th {
            start
            end
          }
          f {
            start
            end
          }
          sa {
            start
            end
          }
          s {
            start
            end
          }
        }
        enabled
        id
        dateCreated
        deleted
        dateUpdated
      }
      id
      dateCreated
      deleted
      dateUpdated
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const SpacesDocument = gql`
    query spaces {
  spaces {
    name
    location
    availability {
      m {
        start
        end
      }
      t {
        start
        end
      }
      w {
        start
        end
      }
      th {
        start
        end
      }
      f {
        start
        end
      }
      sa {
        start
        end
      }
      s {
        start
        end
      }
    }
    enabled
    pricelists {
      name
      description
      availability {
        m {
          start
          end
        }
        t {
          start
          end
        }
        w {
          start
          end
        }
        th {
          start
          end
        }
        f {
          start
          end
        }
        sa {
          start
          end
        }
        s {
          start
          end
        }
      }
      commerce
      collection {
        enabled
        type
      }
      delivery {
        enabled
        type
      }
      catalog {
        categories {
          id
          name
          description
          posId
          items {
            id
            name
            description
            photos
            modifiers {
              id
              name
              posId
              required
              maxSelection
              options {
                id
                name
                posId
                price
              }
            }
            regularPrice
            roomServicePrice
            posSettings {
              roomService {
                posId
                name
                price
              }
              tableService {
                posId
                name
                price
              }
              priceLevels {
                posId
                name
                price
              }
            }
            labels {
              id
              name
            }
            note
            posId
            snoozed
            promotions {
              discounts {
                id
                name
                value
                available
                level
                minOrderAmount
                type
                posSettings {
                  open
                }
                posId
                delivery {
                  enabled
                  type
                }
                collection {
                  enabled
                  type
                }
                count
              }
            }
          }
        }
        labels {
          id
          name
        }
      }
      posSettings {
        enabled
        posId
        revenueCenterId
        tableService {
          posId
          name
        }
        roomService {
          posId
          name
        }
        employeeId
        provider
      }
      promotions {
        discounts {
          id
          name
          value
          available
          level
          minOrderAmount
          type
          posSettings {
            open
          }
          posId
          delivery {
            enabled
            type
          }
          collection {
            enabled
            type
          }
          count
        }
      }
      surcharges {
        id
        name
        value
        type
        delivery {
          enabled
          type
        }
        collection {
          enabled
          type
        }
      }
      enabledPayments {
        card
        roomBill
        cash
      }
      autoApprove
      feedback
      posId
      space {
        name
        location
        availability {
          m {
            start
            end
          }
          t {
            start
            end
          }
          w {
            start
            end
          }
          th {
            start
            end
          }
          f {
            start
            end
          }
          sa {
            start
            end
          }
          s {
            start
            end
          }
        }
        enabled
        id
        dateCreated
        deleted
        dateUpdated
      }
      id
      dateCreated
      deleted
      dateUpdated
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const StripeAccountDocument = gql`
    query stripeAccount {
  stripeAccount {
    payoutsEnabled
    paymentsEnabled
    accountLink
    accountNumberLast4
    sortCode
    payoutSchedule {
      interval
      date
    }
    dateCreated
  }
}
    `;
export const StripePayoutsDocument = gql`
    query stripePayouts {
  stripePayouts {
    totalPrice
    arrivalDate
  }
}
    `;
export const ThreadDocument = gql`
    query thread($where: WhereInputType!) {
  thread(where: $where) {
    resolved
    guest {
      mobileCountryCode
      mobile
      lastName
      firstName
      email
      id
    }
    order {
      pricelist {
        id
        name
      }
      space {
        id
        name
      }
      discount {
        value
        name
      }
      subtotal
      orderReference
      totalPrice
      dateCreated
      id
      id
    }
    lastMessage {
      author
      text
      dateCreated
      id
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const ThreadsDocument = gql`
    query threads($sort: ThreadSortInput, $limit: Float, $offset: Float, $guestId: String, $resolved: Boolean) {
  threads(
    sort: $sort
    limit: $limit
    offset: $offset
    guestId: $guestId
    resolved: $resolved
  ) {
    resolved
    guest {
      mobileCountryCode
      mobile
      lastName
      firstName
      email
      id
    }
    order {
      pricelist {
        id
        name
      }
      space {
        id
        name
      }
      discount {
        value
        name
      }
      subtotal
      orderReference
      totalPrice
      dateCreated
      id
      id
    }
    lastMessage {
      author
      text
      dateCreated
      id
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const UnreadThreadCountDocument = gql`
    query unreadThreadCount {
  unreadThreadCount
}
    `;
export const UserDocument = gql`
    query user {
  user {
    email
    firstName
    lastName
    mobile
    jobTitle
    groupAdmin
    hotelManager
    developer
    pushSubscriptions {
      id
      enabled
      pushSubscription {
        endpoint
        expirationTime
        keys {
          p256dh
          auth
        }
      }
      device {
        vendor
        model
        type
        browser
        os
      }
      sound
      dateUpdated
    }
    notifications {
      orders
      bookings
      messages
    }
    group {
      hotelManager
      name
      id
    }
    hotels {
      name
      id
    }
    roles {
      hotel {
        id
      }
      role
      id
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;
export const UserExistsDocument = gql`
    query userExists($where: WhereUserExistsInput!) {
  userExists(where: $where)
}
    `;
export const UserLoginTokenDocument = gql`
    query userLoginToken($redirectURL: String, $hotelId: String, $hideSidebar: Boolean) {
  userLoginToken(
    redirectURL: $redirectURL
    hotelId: $hotelId
    hideSidebar: $hideSidebar
  ) {
    loginLink
  }
}
    `;
export const UsersDocument = gql`
    query users {
  users {
    email
    firstName
    lastName
    mobile
    jobTitle
    groupAdmin
    hotelManager
    developer
    pushSubscriptions {
      id
      enabled
      pushSubscription {
        endpoint
        expirationTime
        keys {
          p256dh
          auth
        }
      }
      device {
        vendor
        model
        type
        browser
        os
      }
      sound
      dateUpdated
    }
    notifications {
      orders
      bookings
      messages
    }
    hotels {
      name
      id
    }
    roles {
      hotel {
        id
      }
      role
      id
    }
    id
    dateCreated
    deleted
    dateUpdated
  }
}
    `;

export type SdkFunctionWrapper = <T>(action: (requestHeaders?:Record<string, string>) => Promise<T>, operationName: string) => Promise<T>;


const defaultWrapper: SdkFunctionWrapper = (action, _operationName) => action();

export function getSdk(client: GraphQLClient, withWrapper: SdkFunctionWrapper = defaultWrapper) {
  return {
    addCustomDomain(variables: AddCustomDomainMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddCustomDomainMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddCustomDomainMutation>(AddCustomDomainDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addCustomDomain');
    },
    addCustomLink(variables: AddCustomLinkMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AddCustomLinkMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AddCustomLinkMutation>(AddCustomLinkDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'addCustomLink');
    },
    anonGuestLogin(variables: AnonGuestLoginMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AnonGuestLoginMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AnonGuestLoginMutation>(AnonGuestLoginDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'anonGuestLogin');
    },
    authorizeApaleo(variables: AuthorizeApaleoMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AuthorizeApaleoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AuthorizeApaleoMutation>(AuthorizeApaleoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'authorizeApaleo');
    },
    authorizeMews(variables: AuthorizeMewsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AuthorizeMewsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AuthorizeMewsMutation>(AuthorizeMewsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'authorizeMews');
    },
    authorizeOmnivore(variables: AuthorizeOmnivoreMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AuthorizeOmnivoreMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<AuthorizeOmnivoreMutation>(AuthorizeOmnivoreDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'authorizeOmnivore');
    },
    connectMarketplaceApp(variables: ConnectMarketplaceAppMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ConnectMarketplaceAppMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ConnectMarketplaceAppMutation>(ConnectMarketplaceAppDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'connectMarketplaceApp');
    },
    createAttraction(variables?: CreateAttractionMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateAttractionMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateAttractionMutation>(CreateAttractionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createAttraction');
    },
    createBooking(variables?: CreateBookingMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateBookingMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateBookingMutation>(CreateBookingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createBooking');
    },
    createCustomer(variables: CreateCustomerMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateCustomerMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateCustomerMutation>(CreateCustomerDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createCustomer');
    },
    createGuestPaymentMethod(variables: CreateGuestPaymentMethodMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateGuestPaymentMethodMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateGuestPaymentMethodMutation>(CreateGuestPaymentMethodDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createGuestPaymentMethod');
    },
    createHMPayAccount(variables: CreateHmPayAccountMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateHmPayAccountMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateHmPayAccountMutation>(CreateHmPayAccountDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createHMPayAccount');
    },
    createMarketplaceApp(variables: CreateMarketplaceAppMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateMarketplaceAppMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateMarketplaceAppMutation>(CreateMarketplaceAppDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createMarketplaceApp');
    },
    createMarketplaceAppSubscription(variables: CreateMarketplaceAppSubscriptionMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateMarketplaceAppSubscriptionMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateMarketplaceAppSubscriptionMutation>(CreateMarketplaceAppSubscriptionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createMarketplaceAppSubscription');
    },
    createOrder(variables: CreateOrderMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateOrderMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateOrderMutation>(CreateOrderDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createOrder');
    },
    createPricelist(variables: CreatePricelistMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreatePricelistMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreatePricelistMutation>(CreatePricelistDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createPricelist');
    },
    createProduct(variables: CreateProductMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateProductMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateProductMutation>(CreateProductDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createProduct');
    },
    createSale(variables: CreateSaleMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateSaleMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateSaleMutation>(CreateSaleDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createSale');
    },
    createSpace(variables: CreateSpaceMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateSpaceMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateSpaceMutation>(CreateSpaceDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createSpace');
    },
    createStripeAccount(variables?: CreateStripeAccountMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CreateStripeAccountMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<CreateStripeAccountMutation>(CreateStripeAccountDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'createStripeAccount');
    },
    deleteAttraction(variables?: DeleteAttractionMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteAttractionMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteAttractionMutation>(DeleteAttractionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteAttraction');
    },
    deleteCustomDomain(variables?: DeleteCustomDomainMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteCustomDomainMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteCustomDomainMutation>(DeleteCustomDomainDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteCustomDomain');
    },
    deleteCustomLink(variables: DeleteCustomLinkMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteCustomLinkMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteCustomLinkMutation>(DeleteCustomLinkDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteCustomLink');
    },
    deleteCustomer(variables: DeleteCustomerMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteCustomerMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteCustomerMutation>(DeleteCustomerDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteCustomer');
    },
    deleteGuest(variables?: DeleteGuestMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteGuestMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteGuestMutation>(DeleteGuestDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteGuest');
    },
    deleteGuestPaymentMethod(variables: DeleteGuestPaymentMethodMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteGuestPaymentMethodMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteGuestPaymentMethodMutation>(DeleteGuestPaymentMethodDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteGuestPaymentMethod');
    },
    deleteMarketplaceApp(variables: DeleteMarketplaceAppMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteMarketplaceAppMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteMarketplaceAppMutation>(DeleteMarketplaceAppDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteMarketplaceApp');
    },
    deleteMarketplaceAppSubscription(variables: DeleteMarketplaceAppSubscriptionMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteMarketplaceAppSubscriptionMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteMarketplaceAppSubscriptionMutation>(DeleteMarketplaceAppSubscriptionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteMarketplaceAppSubscription');
    },
    deleteMarketplaceAppSubscriptions(variables?: DeleteMarketplaceAppSubscriptionsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteMarketplaceAppSubscriptionsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteMarketplaceAppSubscriptionsMutation>(DeleteMarketplaceAppSubscriptionsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteMarketplaceAppSubscriptions');
    },
    deletePricelist(variables: DeletePricelistMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeletePricelistMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeletePricelistMutation>(DeletePricelistDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deletePricelist');
    },
    deletePricelists(variables: DeletePricelistsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeletePricelistsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeletePricelistsMutation>(DeletePricelistsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deletePricelists');
    },
    deleteProduct(variables: DeleteProductMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteProductMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteProductMutation>(DeleteProductDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteProduct');
    },
    deleteProducts(variables: DeleteProductsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteProductsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteProductsMutation>(DeleteProductsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteProducts');
    },
    deleteSpace(variables: DeleteSpaceMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteSpaceMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteSpaceMutation>(DeleteSpaceDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteSpace');
    },
    deleteSpaces(variables: DeleteSpacesMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteSpacesMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteSpacesMutation>(DeleteSpacesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteSpaces');
    },
    deleteUser(variables: DeleteUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DeleteUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DeleteUserMutation>(DeleteUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'deleteUser');
    },
    disableHotelPayouts(variables?: DisableHotelPayoutsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DisableHotelPayoutsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DisableHotelPayoutsMutation>(DisableHotelPayoutsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'disableHotelPayouts');
    },
    disconnectApaleo(variables?: DisconnectApaleoMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DisconnectApaleoMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DisconnectApaleoMutation>(DisconnectApaleoDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'disconnectApaleo');
    },
    disconnectMarketplaceApp(variables?: DisconnectMarketplaceAppMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DisconnectMarketplaceAppMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DisconnectMarketplaceAppMutation>(DisconnectMarketplaceAppDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'disconnectMarketplaceApp');
    },
    disconnectMews(variables?: DisconnectMewsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DisconnectMewsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DisconnectMewsMutation>(DisconnectMewsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'disconnectMews');
    },
    disconnectOmnivore(variables?: DisconnectOmnivoreMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<DisconnectOmnivoreMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<DisconnectOmnivoreMutation>(DisconnectOmnivoreDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'disconnectOmnivore');
    },
    enableHotelPayouts(variables: EnableHotelPayoutsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<EnableHotelPayoutsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<EnableHotelPayoutsMutation>(EnableHotelPayoutsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'enableHotelPayouts');
    },
    generateAttractionPlaces(variables: GenerateAttractionPlacesMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GenerateAttractionPlacesMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<GenerateAttractionPlacesMutation>(GenerateAttractionPlacesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'generateAttractionPlaces');
    },
    generateMarketplaceAppKey(variables?: GenerateMarketplaceAppKeyMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GenerateMarketplaceAppKeyMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<GenerateMarketplaceAppKeyMutation>(GenerateMarketplaceAppKeyDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'generateMarketplaceAppKey');
    },
    guestLogin(variables: GuestLoginMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GuestLoginMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<GuestLoginMutation>(GuestLoginDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'guestLogin');
    },
    guestLogout(variables?: GuestLogoutMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GuestLogoutMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<GuestLogoutMutation>(GuestLogoutDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'guestLogout');
    },
    guestTokenLogin(variables?: GuestTokenLoginMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GuestTokenLoginMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<GuestTokenLoginMutation>(GuestTokenLoginDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'guestTokenLogin');
    },
    inviteHotelUser(variables: InviteHotelUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<InviteHotelUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<InviteHotelUserMutation>(InviteHotelUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'inviteHotelUser');
    },
    linkStripeAccount(variables: LinkStripeAccountMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<LinkStripeAccountMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<LinkStripeAccountMutation>(LinkStripeAccountDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'linkStripeAccount');
    },
    registerGroupAdmin(variables: RegisterGroupAdminMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RegisterGroupAdminMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RegisterGroupAdminMutation>(RegisterGroupAdminDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'registerGroupAdmin');
    },
    registerGuest(variables: RegisterGuestMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RegisterGuestMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RegisterGuestMutation>(RegisterGuestDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'registerGuest');
    },
    registerHotelUser(variables: RegisterHotelUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<RegisterHotelUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<RegisterHotelUserMutation>(RegisterHotelUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'registerHotelUser');
    },
    resolveThread(variables: ResolveThreadMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ResolveThreadMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ResolveThreadMutation>(ResolveThreadDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'resolveThread');
    },
    resyncPOS(variables?: ResyncPosMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ResyncPosMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<ResyncPosMutation>(ResyncPosDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'resyncPOS');
    },
    sendGuestToken(variables: SendGuestTokenMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SendGuestTokenMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SendGuestTokenMutation>(SendGuestTokenDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'sendGuestToken');
    },
    sendUserToken(variables: SendUserTokenMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SendUserTokenMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SendUserTokenMutation>(SendUserTokenDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'sendUserToken');
    },
    settleOrders(variables?: SettleOrdersMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SettleOrdersMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SettleOrdersMutation>(SettleOrdersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'settleOrders');
    },
    subscribeGuestPushNotifications(variables: SubscribeGuestPushNotificationsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SubscribeGuestPushNotificationsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SubscribeGuestPushNotificationsMutation>(SubscribeGuestPushNotificationsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'subscribeGuestPushNotifications');
    },
    subscribeUserPushNotifications(variables: SubscribeUserPushNotificationsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SubscribeUserPushNotificationsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<SubscribeUserPushNotificationsMutation>(SubscribeUserPushNotificationsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'subscribeUserPushNotifications');
    },
    unsubscribeUserPushNotifications(variables: UnsubscribeUserPushNotificationsMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UnsubscribeUserPushNotificationsMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UnsubscribeUserPushNotificationsMutation>(UnsubscribeUserPushNotificationsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'unsubscribeUserPushNotifications');
    },
    updateAttraction(variables: UpdateAttractionMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateAttractionMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateAttractionMutation>(UpdateAttractionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateAttraction');
    },
    updateBooking(variables: UpdateBookingMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateBookingMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateBookingMutation>(UpdateBookingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateBooking');
    },
    updateCustomLink(variables: UpdateCustomLinkMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateCustomLinkMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateCustomLinkMutation>(UpdateCustomLinkDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateCustomLink');
    },
    updateCustomer(variables: UpdateCustomerMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateCustomerMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateCustomerMutation>(UpdateCustomerDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateCustomer');
    },
    updateGuest(variables: UpdateGuestMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateGuestMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateGuestMutation>(UpdateGuestDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateGuest');
    },
    updateHMPayExternalAccount(variables: UpdateHmPayExternalAccountMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateHmPayExternalAccountMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateHmPayExternalAccountMutation>(UpdateHmPayExternalAccountDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateHMPayExternalAccount');
    },
    updateHotel(variables: UpdateHotelMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateHotelMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateHotelMutation>(UpdateHotelDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateHotel');
    },
    updateMarketplaceApp(variables: UpdateMarketplaceAppMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateMarketplaceAppMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateMarketplaceAppMutation>(UpdateMarketplaceAppDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateMarketplaceApp');
    },
    updateMarketplaceAppSubscription(variables: UpdateMarketplaceAppSubscriptionMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateMarketplaceAppSubscriptionMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateMarketplaceAppSubscriptionMutation>(UpdateMarketplaceAppSubscriptionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateMarketplaceAppSubscription');
    },
    updateOrder(variables: UpdateOrderMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateOrderMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateOrderMutation>(UpdateOrderDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateOrder');
    },
    updatePricelist(variables: UpdatePricelistMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdatePricelistMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdatePricelistMutation>(UpdatePricelistDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updatePricelist');
    },
    updateProduct(variables: UpdateProductMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateProductMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateProductMutation>(UpdateProductDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateProduct');
    },
    updateSale(variables: UpdateSaleMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateSaleMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateSaleMutation>(UpdateSaleDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateSale');
    },
    updateSpace(variables: UpdateSpaceMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateSpaceMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateSpaceMutation>(UpdateSpaceDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateSpace');
    },
    updateStripeExternalAccount(variables: UpdateStripeExternalAccountMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateStripeExternalAccountMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateStripeExternalAccountMutation>(UpdateStripeExternalAccountDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateStripeExternalAccount');
    },
    updateThread(variables: UpdateThreadMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateThreadMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateThreadMutation>(UpdateThreadDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateThread');
    },
    updateUser(variables: UpdateUserMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UpdateUserMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UpdateUserMutation>(UpdateUserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'updateUser');
    },
    uploadAppAsset(variables: UploadAppAssetMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UploadAppAssetMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UploadAppAssetMutation>(UploadAppAssetDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'uploadAppAsset');
    },
    userLogin(variables?: UserLoginMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UserLoginMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserLoginMutation>(UserLoginDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'userLogin');
    },
    userLogout(variables?: UserLogoutMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UserLogoutMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserLogoutMutation>(UserLogoutDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'userLogout');
    },
    userTokenLogin(variables: UserTokenLoginMutationVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UserTokenLoginMutation> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserTokenLoginMutation>(UserTokenLoginDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'userTokenLogin');
    },
    accessToken(variables?: AccessTokenQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AccessTokenQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AccessTokenQuery>(AccessTokenDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'accessToken');
    },
    accessTokenValid(variables?: AccessTokenValidQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AccessTokenValidQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AccessTokenValidQuery>(AccessTokenValidDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'accessTokenValid');
    },
    activeOrdersCount(variables?: ActiveOrdersCountQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ActiveOrdersCountQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ActiveOrdersCountQuery>(ActiveOrdersCountDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'activeOrdersCount');
    },
    apaleoProperties(variables?: ApaleoPropertiesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ApaleoPropertiesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ApaleoPropertiesQuery>(ApaleoPropertiesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'apaleoProperties');
    },
    attraction(variables?: AttractionQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AttractionQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AttractionQuery>(AttractionDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'attraction');
    },
    attractionPlacebyPlaceID(variables: AttractionPlacebyPlaceIdQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<AttractionPlacebyPlaceIdQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<AttractionPlacebyPlaceIdQuery>(AttractionPlacebyPlaceIdDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'attractionPlacebyPlaceID');
    },
    booking(variables: BookingQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<BookingQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BookingQuery>(BookingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'booking');
    },
    bookingAnalytics(variables?: BookingAnalyticsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<BookingAnalyticsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BookingAnalyticsQuery>(BookingAnalyticsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'bookingAnalytics');
    },
    bookings(variables?: BookingsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<BookingsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<BookingsQuery>(BookingsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'bookings');
    },
    customDomain(variables?: CustomDomainQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CustomDomainQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CustomDomainQuery>(CustomDomainDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'customDomain');
    },
    customer(variables: CustomerQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CustomerQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CustomerQuery>(CustomerDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'customer');
    },
    customers(variables?: CustomersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<CustomersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<CustomersQuery>(CustomersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'customers');
    },
    findBooking(variables: FindBookingQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<FindBookingQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<FindBookingQuery>(FindBookingDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'findBooking');
    },
    generateAttractionPlacesCategories(variables?: GenerateAttractionPlacesCategoriesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GenerateAttractionPlacesCategoriesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GenerateAttractionPlacesCategoriesQuery>(GenerateAttractionPlacesCategoriesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'generateAttractionPlacesCategories');
    },
    googlePlacesHotelDetails(variables: GooglePlacesHotelDetailsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GooglePlacesHotelDetailsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GooglePlacesHotelDetailsQuery>(GooglePlacesHotelDetailsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'googlePlacesHotelDetails');
    },
    googlePlacesHotelSearch(variables: GooglePlacesHotelSearchQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GooglePlacesHotelSearchQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GooglePlacesHotelSearchQuery>(GooglePlacesHotelSearchDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'googlePlacesHotelSearch');
    },
    guest(variables?: GuestQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GuestQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GuestQuery>(GuestDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'guest');
    },
    guestPaymentMethods(variables?: GuestPaymentMethodsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GuestPaymentMethodsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GuestPaymentMethodsQuery>(GuestPaymentMethodsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'guestPaymentMethods');
    },
    guestWithStatistics(variables?: GuestWithStatisticsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GuestWithStatisticsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GuestWithStatisticsQuery>(GuestWithStatisticsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'guestWithStatistics');
    },
    guests(variables?: GuestsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<GuestsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<GuestsQuery>(GuestsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'guests');
    },
    hmPayAccount(variables?: HmPayAccountQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<HmPayAccountQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<HmPayAccountQuery>(HmPayAccountDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'hmPayAccount');
    },
    hmPayPayouts(variables?: HmPayPayoutsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<HmPayPayoutsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<HmPayPayoutsQuery>(HmPayPayoutsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'hmPayPayouts');
    },
    hotel(variables?: HotelQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<HotelQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<HotelQuery>(HotelDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'hotel');
    },
    hotelIDByDomain(variables: HotelIdByDomainQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<HotelIdByDomainQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<HotelIdByDomainQuery>(HotelIdByDomainDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'hotelIDByDomain');
    },
    hotels(variables: HotelsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<HotelsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<HotelsQuery>(HotelsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'hotels');
    },
    marketplaceApp(variables: MarketplaceAppQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MarketplaceAppQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MarketplaceAppQuery>(MarketplaceAppDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'marketplaceApp');
    },
    marketplaceAppSubscriptions(variables?: MarketplaceAppSubscriptionsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MarketplaceAppSubscriptionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MarketplaceAppSubscriptionsQuery>(MarketplaceAppSubscriptionsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'marketplaceAppSubscriptions');
    },
    marketplaceApps(variables?: MarketplaceAppsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MarketplaceAppsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MarketplaceAppsQuery>(MarketplaceAppsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'marketplaceApps');
    },
    messages(variables: MessagesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MessagesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MessagesQuery>(MessagesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'messages');
    },
    mewsServices(variables?: MewsServicesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<MewsServicesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<MewsServicesQuery>(MewsServicesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'mewsServices');
    },
    omnivoreDiscounts(variables: OmnivoreDiscountsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<OmnivoreDiscountsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OmnivoreDiscountsQuery>(OmnivoreDiscountsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'omnivoreDiscounts');
    },
    omnivoreLocations(variables?: OmnivoreLocationsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<OmnivoreLocationsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OmnivoreLocationsQuery>(OmnivoreLocationsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'omnivoreLocations');
    },
    omnivoreOptions(variables: OmnivoreOptionsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<OmnivoreOptionsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OmnivoreOptionsQuery>(OmnivoreOptionsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'omnivoreOptions');
    },
    omnivoreTables(variables: OmnivoreTablesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<OmnivoreTablesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OmnivoreTablesQuery>(OmnivoreTablesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'omnivoreTables');
    },
    order(variables: OrderQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<OrderQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OrderQuery>(OrderDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'order');
    },
    orders(variables?: OrdersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<OrdersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OrdersQuery>(OrdersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'orders');
    },
    outstandingGuests(variables?: OutstandingGuestsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<OutstandingGuestsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OutstandingGuestsQuery>(OutstandingGuestsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'outstandingGuests');
    },
    outstandingOrdersStatistics(variables?: OutstandingOrdersStatisticsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<OutstandingOrdersStatisticsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<OutstandingOrdersStatisticsQuery>(OutstandingOrdersStatisticsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'outstandingOrdersStatistics');
    },
    pricelist(variables: PricelistQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PricelistQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PricelistQuery>(PricelistDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'pricelist');
    },
    pricelistFeedback(variables: PricelistFeedbackQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PricelistFeedbackQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PricelistFeedbackQuery>(PricelistFeedbackDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'pricelistFeedback');
    },
    pricelists(variables?: PricelistsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<PricelistsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<PricelistsQuery>(PricelistsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'pricelists');
    },
    product(variables: ProductQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProductQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProductQuery>(ProductDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'product');
    },
    products(variables?: ProductsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ProductsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ProductsQuery>(ProductsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'products');
    },
    sale(variables: SaleQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SaleQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SaleQuery>(SaleDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'sale');
    },
    sales(variables?: SalesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SalesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SalesQuery>(SalesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'sales');
    },
    searchBookings(variables?: SearchBookingsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchBookingsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchBookingsQuery>(SearchBookingsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'searchBookings');
    },
    searchCustomAttractionPlace(variables: SearchCustomAttractionPlaceQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchCustomAttractionPlaceQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchCustomAttractionPlaceQuery>(SearchCustomAttractionPlaceDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'searchCustomAttractionPlace');
    },
    searchCustomers(variables?: SearchCustomersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchCustomersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchCustomersQuery>(SearchCustomersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'searchCustomers');
    },
    searchGuests(variables?: SearchGuestsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchGuestsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchGuestsQuery>(SearchGuestsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'searchGuests');
    },
    searchOrders(variables?: SearchOrdersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchOrdersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchOrdersQuery>(SearchOrdersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'searchOrders');
    },
    searchOutstandingOrders(variables?: SearchOutstandingOrdersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchOutstandingOrdersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchOutstandingOrdersQuery>(SearchOutstandingOrdersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'searchOutstandingOrders');
    },
    searchProducts(variables?: SearchProductsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchProductsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchProductsQuery>(SearchProductsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'searchProducts');
    },
    searchSales(variables?: SearchSalesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SearchSalesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SearchSalesQuery>(SearchSalesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'searchSales');
    },
    space(variables: SpaceQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SpaceQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SpaceQuery>(SpaceDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'space');
    },
    spaces(variables?: SpacesQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<SpacesQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<SpacesQuery>(SpacesDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'spaces');
    },
    stripeAccount(variables?: StripeAccountQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<StripeAccountQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<StripeAccountQuery>(StripeAccountDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'stripeAccount');
    },
    stripePayouts(variables?: StripePayoutsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<StripePayoutsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<StripePayoutsQuery>(StripePayoutsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'stripePayouts');
    },
    thread(variables: ThreadQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ThreadQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ThreadQuery>(ThreadDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'thread');
    },
    threads(variables?: ThreadsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<ThreadsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<ThreadsQuery>(ThreadsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'threads');
    },
    unreadThreadCount(variables?: UnreadThreadCountQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UnreadThreadCountQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UnreadThreadCountQuery>(UnreadThreadCountDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'unreadThreadCount');
    },
    user(variables?: UserQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UserQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserQuery>(UserDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'user');
    },
    userExists(variables: UserExistsQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UserExistsQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserExistsQuery>(UserExistsDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'userExists');
    },
    userLoginToken(variables?: UserLoginTokenQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UserLoginTokenQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UserLoginTokenQuery>(UserLoginTokenDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'userLoginToken');
    },
    users(variables?: UsersQueryVariables, requestHeaders?: Dom.RequestInit["headers"]): Promise<UsersQuery> {
      return withWrapper((wrappedRequestHeaders) => client.request<UsersQuery>(UsersDocument, variables, {...requestHeaders, ...wrappedRequestHeaders}), 'users');
    }
  };
}
export type Sdk = ReturnType<typeof getSdk>;