import { Space } from '@src/modules/space/space.entity';
import { ObjectId } from 'mongodb';
import { mainGroup } from './groups.factory';
import { mainHotel } from './hotels.factory';
import { pricelist } from './pricelists.factory';

export const space = new Space();

space._id = new ObjectId('5e7b1922dad63100084f409a');
space.name = 'The Quarterdeck Restaurant';
space.location = 'Ground floor of Elah Hotel';
space.enabled = true;
space.availability = {
  m: {
    start: '09:00',
    end: '18:00',
  },
  t: {
    start: '09:00',
    end: '18:00',
  },
  w: {
    start: '09:00',
    end: '18:00',
  },
  th: {
    start: '09:00',
    end: '18:00',
  },
  f: {
    start: '09:00',
    end: '18:00',
  },
  sa: {
    start: '09:00',
    end: '18:00',
  },
};

space.hotel = mainHotel;
space.group = mainGroup;
space.pricelists.add(pricelist);

export const spaces = [space];
