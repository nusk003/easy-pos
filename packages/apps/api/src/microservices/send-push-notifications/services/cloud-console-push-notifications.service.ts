import {
  Connection,
  EntityData,
  IDatabaseDriver,
  MikroORM,
} from '@mikro-orm/core';
import { EntityManager, EntityRepository } from '@mikro-orm/mongodb';
import { mikroORMConfig } from '@src/config/mikro-orm.config';
import { __vapid_private_key__, __vapid_public_key__ } from '@src/constants';
import {
  CloudConsolePushNotificationsOptions,
  CloudConsoleSendOptions,
} from '@src/microservices/send-push-notifications/dto/send-push-notification-args';
import { Hotel } from '@src/modules/hotel/entities';
import { User } from '@src/modules/user/user.entity';
import { Action } from '@hm/sdk';
import push from 'web-push';

// push.setVapidDetails(
//   'mailto:dev@hotelmanager.co',
//   __vapid_public_key__,
//   __vapid_private_key__
// );

let orm: MikroORM<IDatabaseDriver<Connection>>;

export class CloudConsolePushNotificationsService {
  userRepository: EntityRepository<User>;
  hotelRepository: EntityRepository<Hotel>;
  hotelId: string;

  constructor({ hotelId }: CloudConsolePushNotificationsOptions) {
    this.hotelId = hotelId;
  }

  async init() {
    orm = await MikroORM.init(mikroORMConfig());
    const em = <EntityManager>orm.em.fork();

    this.userRepository = em.getRepository(User);
    this.hotelRepository = em.getRepository(Hotel);
  }

  async send(data: CloudConsoleSendOptions) {
    await this.init();

    const hotel = await this.hotelRepository.findOne(this.hotelId);

    const users = await this.userRepository.find({
      $or: [
        {
          hotels: hotel,
        },
        {
          groupAdmin: true,
          group: hotel?.group.id,
        },
      ],
    });

    await Promise.all(
      users.map(async (user) => {
        if (user.pushSubscriptions) {
          await Promise.all(
            user.pushSubscriptions.map(async (pushSubscription) => {
              try {
                if (pushSubscription.enabled) {
                  if (
                    data.data?.action === Action.NewMessage &&
                    !user.notifications?.messages
                  ) {
                    return;
                  }

                  if (
                    (data.data?.action === Action.NewOrder ||
                      data.data?.action === Action.UpdateOrder) &&
                    !user.notifications?.orders
                  ) {
                    return;
                  }

                  await push.sendNotification(
                    pushSubscription.pushSubscription,
                    JSON.stringify(data)
                  );
                }
              } catch (err) {
                console.error(err);
                await this.userRepository.nativeUpdate({ _id: user._id }, {
                  $pull: {
                    pushSubscriptions: { id: pushSubscription.id },
                  },
                } as EntityData<User>);
              }
            })
          );
        }
      })
    );
  }
}
