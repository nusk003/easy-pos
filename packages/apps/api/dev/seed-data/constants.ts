import { ObjectId } from 'mongodb';

export const __main_hotel_id__ = new ObjectId('5e7a267c757ab344eec9fc69');
export const __main_group_id__ = new ObjectId('5f7cad4fbe4fc767a0790bbd');
export const __hm_group_id__ = new ObjectId('5f7cae1cc806905c47eb9066');

export const __no_guests__ = 500;
export const __no_products__ = 500;
export const __no_customers__ = 500;
export const guestIds = [...Array(__no_guests__).keys()].map(
  () => new ObjectId()
);

export const customerIds = [...Array(__no_customers__).keys()].map(
  () => new ObjectId()
);

export const productIds = [...Array(__no_customers__).keys()].map(
  () => new ObjectId()
);
