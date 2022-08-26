import { customerIds } from '@dev/seed-data/constants';
import { faker } from '@dev/seed-data/util';
import { Customer } from '@src/modules/customer/customer.entity';
import { v4 } from 'uuid';
import { mainGroup } from './groups.factory';
import { mainHotel } from './hotels.factory';

export const customers = customerIds.map((id) => {
  const customer = new Customer();
  customer._id = id;
  customer.firstName = faker.name.firstName();
  customer.lastName = faker.name.lastName();
  customer.nic = v4();
  customer.phone = faker.phone.phoneNumber();
  customer.address = faker.address.streetAddress();
  customer.hotel = mainHotel;
  customer.group = mainGroup;
  return customer;
});
