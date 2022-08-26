import {
  Hotel,
  IntegrationProvider,
  IntegrationType,
  OmnivoreLocationsResponse,
} from '@hm/sdk';
import { integrationData } from '@src/components/templates';
import {
  queryMap,
  useApaleoProperties,
  useHotel,
  useOmnivoreLocations,
} from '@src/xhr/query';
import { useMemo } from 'react';
import { cache } from 'swr';

export enum IntegrationStatus {
  Active,
  Disabled,
  Error,
}

const isPMSIntegrationActive = (
  provider: IntegrationProvider | string | undefined,
  hotel?: Hotel
) => {
  if (!hotel) {
    hotel = cache.get(queryMap.hotel.key);
  }

  if (provider === IntegrationProvider.Apaleo) {
    return !!hotel?.group.integrations?.apaleo;
  }

  if (provider === IntegrationProvider.Mews) {
    return !!hotel?.integrations?.mews;
  }
};

const isPOSIntegrationActive = (
  provider: IntegrationProvider | string | undefined,
  hotel?: Hotel,
  locations?: OmnivoreLocationsResponse[]
) => {
  if (!hotel) {
    hotel = cache.get(queryMap.hotel.key);
  }

  if (hotel?.group.integrations?.omnivore) {
    return !!locations?.find((location) => location.provider === provider);
  }
};

export const isIntegrationActive = (
  provider: IntegrationProvider | string | undefined,
  hotel?: Hotel,
  locations?: OmnivoreLocationsResponse[]
) => {
  if (!hotel) {
    hotel = cache.get(queryMap.hotel.key);
  }
  if (!locations) {
    locations = cache.get(queryMap.omnivoreLocations.key);
  }

  const integration = integrationData.find(
    (integration) => integration.provider === provider
  );

  if (
    hotel?.integrations?.marketplaceApps?.find((app) => app.name === provider)
  ) {
    return true;
  }

  return integration?.type === IntegrationType.Pms
    ? isPMSIntegrationActive(provider, hotel)
    : isPOSIntegrationActive(provider, hotel, locations);

  return false;
};

export const useIntegrationStatus = (
  provider: IntegrationProvider | string | undefined
): IntegrationStatus => {
  const { data: hotel } = useHotel();
  const { data: locations } = useOmnivoreLocations();
  const { error: apaleoPropertiesError } = useApaleoProperties(
    provider === IntegrationProvider.Apaleo &&
      !!hotel?.group.integrations?.apaleo
  );

  const isActive = useMemo(() => {
    return isIntegrationActive(provider, hotel, locations);
  }, [hotel, provider, locations]);

  if (provider === IntegrationProvider.Apaleo) {
    if (hotel && hotel?.group.integrations?.apaleo && apaleoPropertiesError) {
      return IntegrationStatus.Error;
    }
  }

  return isActive ? IntegrationStatus.Active : IntegrationStatus.Disabled;
};
