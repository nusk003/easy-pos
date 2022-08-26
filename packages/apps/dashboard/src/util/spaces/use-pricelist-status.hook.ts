import { Pricelist, Space } from '@hm/sdk';
import {
  EditablePricelist,
  isPricelistEnabled,
  isPricelistVisible,
} from '@hm/spaces';
import { useSpaceDetails } from './use-space-details.hook';

export enum PricelistStatus {
  SpaceDisabled = 'space disabled',
  Disabled = 'disabled',
  Hidden = 'hidden',
  Live = 'live',
  CommerceDisabled = 'commerce disabled',
}

export const getPricelistStatus = (
  space: Space | undefined,
  pricelist: Pricelist | EditablePricelist | undefined
) => {
  const isVisible = pricelist ? isPricelistVisible(pricelist) : false;

  const isCommerceDisabled = !pricelist?.commerce;

  const isFulfilmentEnabled = pricelist ? isPricelistEnabled(pricelist) : false;

  if (!space?.enabled) {
    return PricelistStatus.SpaceDisabled;
  }

  if (!isVisible) {
    return PricelistStatus.Hidden;
  }

  if (isCommerceDisabled) {
    return PricelistStatus.CommerceDisabled;
  }

  if (!isFulfilmentEnabled) {
    return PricelistStatus.Disabled;
  }

  return PricelistStatus.Live;
};

export const usePricelistStatus = (
  pricelistId: string | undefined
): PricelistStatus => {
  const { pricelist, space } = useSpaceDetails({ pricelistId });

  return getPricelistStatus(space, pricelist);
};
