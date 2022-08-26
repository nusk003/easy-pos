import { IntegrationProvider } from '@hm/sdk';
import { integrationData } from '@src/components/templates';
import { useHotel, useOmnivoreLocations } from '@src/xhr/query';
import { useMemo } from 'react';

export const usePOSLocations = () => {
  const { data: omnivoreLocations } = useOmnivoreLocations();

  const { data: hotel } = useHotel();

  const posLocations = useMemo(() => {
    const availablePosArray: {
      posId: string;
      provider: IntegrationProvider;
    }[] = [];

    if (hotel?.group.integrations?.omnivore) {
      integrationData.map(({ provider, available }) => {
        const pos = omnivoreLocations?.find(
          (location) => location.provider === provider && available
        );

        if (pos) {
          availablePosArray.push({
            posId: pos.id,
            provider: provider as IntegrationProvider,
          });
        }
      });
    }

    return availablePosArray;
  }, [hotel, omnivoreLocations]);

  return posLocations;
};
