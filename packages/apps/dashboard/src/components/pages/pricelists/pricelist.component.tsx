import { Pricelist as PricelistType } from '@hm/sdk';
import { PricelistsCatalog } from '@src/components/templates';
import { useSpaceDetails } from '@src/util/spaces';
import { useSpaces } from '@src/xhr/query';
import React, { useEffect } from 'react';
import { useHistory, useRouteMatch } from 'react-router-dom';

export const Pricelist: React.FC = () => {
  const history = useHistory();

  const { data: spaces } = useSpaces();

  const pricelistId = useRouteMatch<{ pricelistId: string }>(
    '/pricelists/:pricelistId'
  )?.params?.pricelistId;

  const { pricelist } = useSpaceDetails({ pricelistId });

  useEffect(() => {
    const existingPricelist = spaces?.find((s) =>
      s.pricelists.find((p) => p.id === pricelistId)
    );

    if (spaces && !existingPricelist) {
      history.push('/pricelists');
    }
  }, [history, pricelistId, spaces]);

  if (!spaces || !pricelist) {
    return null;
  }

  return <PricelistsCatalog pricelist={pricelist as PricelistType} />;
};
