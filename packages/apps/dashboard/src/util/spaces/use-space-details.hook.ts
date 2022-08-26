import { Pricelist, Space } from '@hm/sdk';
import { EditablePricelist } from '@hm/spaces';
import { useSpaces } from '@src/xhr/query';

interface UseSpaceDetailsOptions {
  spaceId?: string;
  pricelistId?: string;
}

export const useSpaceDetails = ({
  spaceId,
  pricelistId,
}: UseSpaceDetailsOptions) => {
  const { data: spaces } = useSpaces();
  const pricelistsArray = spaces?.flatMap((s) => s.pricelists);

  let space: Space | undefined;
  let pricelist: Pricelist | EditablePricelist | undefined;
  let pricelists: Pricelist[] | EditablePricelist[] | undefined;

  if (spaceId && !pricelistId) {
    space = spaces?.find((s) => s.id === spaceId) as Space;
    pricelists = pricelistsArray?.filter(
      (p) => p.space.id === spaceId
    ) as Pricelist[];
  } else if (spaceId && pricelistId) {
    space = spaces?.find((s) => s.id === spaceId) as Space;
    pricelist = pricelistsArray?.find((p) => p.id === pricelistId) as Pricelist;
  } else if (pricelistId && !spaceId) {
    pricelist = pricelistsArray?.find((p) => p.id === pricelistId) as Pricelist;
    space = spaces?.find((s) => s.id === pricelist?.space.id) as Space;
  }

  return { space, pricelist, pricelists };
};
