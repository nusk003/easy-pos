import { IntegrationType } from '@hm/sdk';
import { useApaleoProperties, useHotel } from '@src/xhr/query';

export const useIsPMSActive = () => {
  const { data: hotel } = useHotel();
  const { error: apaleoPropertiesError } = useApaleoProperties(
    !!hotel?.group.integrations?.apaleo
  );

  if (!hotel?.group.integrations && !hotel?.integrations) {
    return false;
  }

  let isGroupPMS = false;
  let isHotelPMS = false;

  if (hotel.group.integrations) {
    isGroupPMS = !!Object.values(hotel.group.integrations).find(
      (integration) =>
        typeof integration !== 'string' &&
        integration?.type === IntegrationType.Pms
    );
  }

  if (hotel.integrations) {
    isHotelPMS = !!Object.values(hotel.integrations || {}).find(
      (integration) => {
        if (Array.isArray(integration)) {
          return integration.find((i) => i.type === IntegrationType.Pms);
        }

        return (
          typeof integration !== 'string' &&
          integration?.type === IntegrationType.Pms
        );
      }
    );
  }

  if (hotel.group.integrations?.apaleo) {
    return !apaleoPropertiesError;
  }

  return isGroupPMS || isHotelPMS;
};
