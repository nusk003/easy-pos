import { FlushEventArgs } from '@mikro-orm/core';

export const sendHotelStreamToSNS = async (args: FlushEventArgs) => {
  const changeSets = args.uow.getChangeSets();

  const {
    HotelStreamClient,
    // eslint-disable-next-line
  } = require('../microservices/hotel-stream/hotel-stream.client');

  if (changeSets?.length) {
    await new HotelStreamClient().trigger(changeSets);
  }
};
