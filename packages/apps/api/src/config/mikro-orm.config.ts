import { Options } from '@mikro-orm/core';
import { MongoDriver } from '@mikro-orm/mongodb';
import { __mongodb_uri__, __mongodb_db_name__, __dev__ } from '@src/constants';
import { ConnectedGuest } from '@src/websockets/entities/connected-guest.entity';
import { ConnectedUser } from '@src/websockets/entities/connected-user.entity';
import { Group } from '@src/modules/group/entities';
import { Hotel, HotelDomain } from '@src/modules/hotel/entities';
import { User } from '@src/modules/user/user.entity';
import { Role } from '@src/modules/role/role.entity';
import { Guest } from '@src/modules/guest/guest.entity';
import { Booking } from '@src/modules/booking/booking.entity';
import { Space } from '@src/modules/space/space.entity';
import { Pricelist } from '@src/modules/pricelist/pricelist.entity';
import { Order } from '@src/modules/order/order.entity';
import { Message } from '@src/modules/message/message.entity';
import { Thread } from '@src/modules/thread/thread.entity';
import { Attraction } from '@src/modules/attraction/attraction.entity';
import { MongoClientOptions } from 'mongodb';
import { MarketplaceApp } from '@src/modules/marketplace-app/marketplace-app.entity';
import { Product } from '@src/modules/product/product.entity';
import { Customer } from '@src/modules/customer/customer.entity';
import { Sale } from '@src/modules/sale/sale.entity';

export const mikroORMConfig = (options?: Options): Options => ({
  driver: MongoDriver,
  clientUrl: __mongodb_uri__,
  driverOptions: __dev__
    ? <MongoClientOptions>{
        directConnection: true,
      }
    : {},
  dbName: __mongodb_db_name__,
  debug: false,
  discovery: { disableDynamicFileAccess: true },
  entities: [
    Space,
    Pricelist,
    Hotel,
    HotelDomain,
    Group,
    Guest,
    User,
    Order,
    Thread,
    Message,
    Role,
    ConnectedGuest,
    ConnectedUser,
    Attraction,
    Booking,
    MarketplaceApp,
    Product,
    Customer,
    Sale,
  ],
  ensureIndexes: true,
  pool: {
    min: 2,
    max: 3,
  },
  ...options,
});
