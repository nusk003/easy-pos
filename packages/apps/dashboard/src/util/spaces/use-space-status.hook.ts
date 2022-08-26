import { isSpacePricelistsEnabled, isSpaceVisible } from '@hm/spaces';
import { useSpaceDetails } from './use-space-details.hook';

export enum SpaceStatus {
  Disabled = 'disabled',
  Hidden = 'hidden',
  Live = 'live',
  PricelistsDisabled = 'pricelists disabled',
}

export const useSpaceStatus = (spaceId: string | undefined): SpaceStatus => {
  const { space } = useSpaceDetails({ spaceId });

  const isVisible = space ? isSpaceVisible(space) : false;

  const isFulfilmentEnabled = space ? isSpacePricelistsEnabled(space) : false;

  if (!space?.enabled) {
    return SpaceStatus.Disabled;
  }

  if (!isVisible) {
    return SpaceStatus.Hidden;
  }

  if (!isFulfilmentEnabled) {
    return SpaceStatus.PricelistsDisabled;
  }

  return SpaceStatus.Live;
};
