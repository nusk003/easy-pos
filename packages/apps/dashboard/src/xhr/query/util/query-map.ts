import {
  Attraction,
  AttractionPlace,
  Booking,
  BookingAnalyticsQueryVariables,
  BookingAnalyticsResponse,
  BookingsQueryVariables,
  GuestWithStatistics,
  Hotel,
  MarketplaceApp,
  MarketplaceAppQueryVariables,
  MarketplaceAppsQueryVariables,
  Message,
  MessagesQueryVariables,
  OmnivoreLocationsResponse,
  Order,
  OrdersQueryVariables,
  PaginationSort,
  PricelistFeedback,
  Sale,
  SearchBookingsQueryVariables,
  SearchCustomAttractionPlaceResponse,
  SearchCustomersQueryVariables,
  SearchGuestsQueryVariables,
  SearchOrdersQueryVariables,
  SearchProductsQueryVariables,
  SearchSalesQueryVariables,
  Space,
  StripeAccountResponse,
  Thread,
  ThreadsQueryVariables,
  UpdateAttractionInput,
  User,
} from '@hm/sdk';
import { sdk } from '@src/xhr/graphql-request';

export const queryMap = {
  activeOrdersCount: {
    key: 'activeOrdersCount' as const,
    fetcher: () => sdk.activeOrdersCount().then((res) => res.activeOrdersCount),
  },
  spaces: {
    key: 'spaces' as const,
    fetcher: () => sdk.spaces().then((res) => res.spaces as Space[]),
  },
  updateAttraction: {
    key: 'updateAttraction' as const,
    fetcher: (data: UpdateAttractionInput) =>
      sdk
        .updateAttraction({ data })
        .then((res) => res.updateAttraction as Attraction),
  },
  searchCustomPlace: {
    key: 'searchCustomPlace' as const,
    fetcher: (query: string) =>
      sdk
        .searchCustomAttractionPlace({ query: query })
        .then(
          (res) =>
            res.searchCustomAttractionPlace as SearchCustomAttractionPlaceResponse[]
        ),
  },
  getPlaceByPlaceId: {
    key: 'getPlaceByPlaceId' as const,
    fetcher: (placeId: string) =>
      sdk
        .attractionPlacebyPlaceID({ placeId })
        .then((res) => res.attractionPlacebyPlaceID as AttractionPlace),
  },
  attraction: {
    key: 'attraction' as const,
    fetcher: () => sdk.attraction().then((res) => res.attraction as Attraction),
  },
  guest: (id: string | undefined) => ({
    key: JSON.stringify({
      key: 'guest',
      id,
    }),
    fetcher: id
      ? () =>
          sdk
            .guestWithStatistics({ where: { id } })
            .then((res) => res.guest as GuestWithStatistics)
      : null,
  }),
  hotel: {
    key: 'hotel' as const,
    fetcher: () => sdk.hotel().then((res) => res.hotel as Hotel),
  },
  customDomain: {
    key: 'customDomain' as const,
    fetcher: () => sdk.customDomain().then((res) => res.customDomain),
  },
  messages: (
    variables: Omit<MessagesQueryVariables, 'threadId'> & {
      threadId: string | undefined;
    }
  ) => ({
    key: () => {
      return JSON.stringify({
        key: 'messages',
        threadId: variables.threadId,
      });
    },
    fetcher: variables.threadId
      ? () =>
          sdk
            .messages({
              threadId: variables.threadId!,
              offset: 0,
              limit: 25,
            })
            .then((res) => res.messages as Message[])
      : null,
  }),
  order: (id: string | undefined) => ({
    key: JSON.stringify({
      key: 'order',
      id,
    }),
    fetcher: id
      ? () => sdk.order({ where: { id } }).then((res) => res.order as Order)
      : null,
  }),
  sale: (id: string | undefined) => ({
    key: JSON.stringify({
      key: 'sale',
      id,
    }),
    fetcher: id
      ? () => sdk.sale({ where: { id } }).then((res) => res.sale as Sale)
      : null,
  }),
  orders: (opts: OrdersQueryVariables) => ({
    key: JSON.stringify({
      key: 'orders',
      ...opts,
    }),
    fetcher: () =>
      sdk
        .orders({
          completed: false,
          rejected: false,
          sort: { dateCreated: PaginationSort.Desc },
          ...opts,
        })
        .then((res) => res.orders as Order[]),
  }),
  searchOrders: (opts: SearchOrdersQueryVariables) => ({
    key: JSON.stringify({
      key: 'search-orders',
      ...opts,
    }),
    fetcher: () => sdk.searchOrders(opts).then((res) => res.searchOrders),
  }),
  searchSales: (opts: SearchSalesQueryVariables) => ({
    key: JSON.stringify({
      key: 'search-sales',
      ...opts,
    }),
    fetcher: () => sdk.searchSales(opts).then((res) => res.searchSales),
  }),
  outstandingOrdersStatistics: {
    key: 'outstanding-orders-statistics' as const,
    fetcher: () =>
      sdk
        .outstandingOrdersStatistics()
        .then((res) => res.outstandingOrdersStatistics),
  },
  searchGuests: (opts: SearchGuestsQueryVariables) => ({
    key: JSON.stringify({
      key: 'search-guests',
      ...opts,
    }),
    fetcher: () => sdk.searchGuests(opts).then((res) => res.searchGuests),
  }),
  searchProducts: (opts: SearchProductsQueryVariables) => ({
    key: JSON.stringify({
      key: 'search-products',
      ...opts,
    }),
    fetcher: () => sdk.searchProducts(opts).then((res) => res.searchProducts),
  }),
  searchCustomers: (opts: SearchCustomersQueryVariables) => ({
    key: JSON.stringify({
      key: 'search-products',
      ...opts,
    }),
    fetcher: () => sdk.searchCustomers(opts).then((res) => res.searchCustomers),
  }),
  stripeAccount: {
    key: 'stripe-account' as const,
    fetcher: () =>
      sdk
        .stripeAccount()
        .then((res) => res.stripeAccount as StripeAccountResponse),
  },
  stripePayouts: {
    key: 'stripe-payouts' as const,
    fetcher: () => sdk.stripePayouts().then((res) => res.stripePayouts),
  },
  hmPayPayouts: {
    key: 'hm-payouts' as const,
    fetcher: () => sdk.hmPayPayouts().then((res) => res.hmPayPayouts),
  },
  thread: (id: string | undefined) => ({
    key: JSON.stringify({
      key: 'thread',
      id,
    }),
    fetcher: id
      ? () => sdk.thread({ where: { id } }).then((res) => res.thread as Thread)
      : null,
  }),
  pricelistFeedback: (id: string | undefined) => ({
    key: JSON.stringify({
      key: 'pricelist-feedback',
      id,
    }),
    fetcher: id
      ? () =>
          sdk
            .pricelistFeedback({ where: { id } })
            .then((res) => res.pricelistFeedback as PricelistFeedback)
      : null,
  }),
  threads: (opts: ThreadsQueryVariables) => ({
    key: JSON.stringify({
      key: 'thread',
      ...opts,
    }),
    fetcher: () => sdk.threads(opts).then((res) => res.threads as Thread[]),
  }),
  unreadThreadCount: {
    key: 'unreadThreadCount' as const,
    fetcher: () => sdk.unreadThreadCount().then((res) => res.unreadThreadCount),
  },
  user: {
    key: 'user' as const,
    fetcher: () => sdk.user().then((res) => res.user as User),
  },
  users: {
    key: 'users' as const,
    fetcher: () => sdk.users().then((res) => res.users as User[]),
  },
  bookingAnalytics: (opts: BookingAnalyticsQueryVariables) => {
    return {
      key: JSON.stringify({
        key: 'bookingAnalytics',
        ...opts,
      }),
      fetcher: () =>
        sdk.bookingAnalytics(opts).then((res) => {
          return res.bookingAnalytics as BookingAnalyticsResponse;
        }),
    };
  },
  omnivoreOptions: (locationId: string | undefined) => {
    return {
      key: JSON.stringify({
        key: 'omnivoreOptions',
        locationId,
      }),
      fetcher: locationId
        ? () =>
            sdk.omnivoreOptions({ locationId }).then((res) => {
              return res.omnivoreOptions;
            })
        : null,
    };
  },
  bookings: (opts: BookingsQueryVariables) => ({
    key: JSON.stringify({
      key: 'bookings',
      ...opts,
    }),
    fetcher: () => sdk.bookings(opts).then((res) => res.bookings as Booking[]),
  }),
  searchBookings: (opts: SearchBookingsQueryVariables) => ({
    key: () => {
      return JSON.stringify({
        key: 'searchBookings',
        ...opts,
      });
    },
    fetcher: () =>
      sdk
        .searchBookings(opts)
        .then((res) => res.searchBookings.data as Booking[]),
  }),
  apaleoProperties: {
    key: 'apaleoProperties',
    fetcher: () =>
      sdk.apaleoProperties().then(({ apaleoProperties }) => apaleoProperties),
  },
  mewsServices: {
    key: 'mewsServices',
    fetcher: () => sdk.mewsServices().then(({ mewsServices }) => mewsServices),
  },
  omnivoreLocations: {
    key: 'omnivoreLocations',
    fetcher: () =>
      sdk
        .omnivoreLocations()
        .then(
          ({ omnivoreLocations }) =>
            omnivoreLocations as OmnivoreLocationsResponse[]
        ),
  },
  omnivoreDiscounts: (locationId: string | undefined) => {
    return {
      key: JSON.stringify({
        key: 'omnivoreDiscounts',
        locationId,
      }),
      fetcher: locationId
        ? () =>
            sdk.omnivoreDiscounts({ locationId }).then((res) => {
              return res.omnivoreDiscounts;
            })
        : null,
    };
  },
  marketplaceApps: (opts?: MarketplaceAppsQueryVariables) => ({
    key: JSON.stringify({ key: 'marketplaceApps', ...opts }),
    fetcher: () =>
      sdk
        .marketplaceApps(opts)
        .then((res) => res.marketplaceApps as MarketplaceApp[]),
  }),
  marketplaceApp: (opts: MarketplaceAppQueryVariables) => ({
    key: JSON.stringify({ key: 'marketplaceApp', ...opts }),
    fetcher: () =>
      sdk
        .marketplaceApp(opts)
        .then((res) => res.marketplaceApp as MarketplaceApp),
  }),
};

export type QueryMap = typeof queryMap;

export type Query = QueryMap[keyof QueryMap];
