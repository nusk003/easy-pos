import { FilterQuery, wrap } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { Guest } from '@src/modules/guest/guest.entity';
import { MessageAuthor } from '@src/modules/message/message.entity';
import { MessageService } from '@src/modules/message/message.service';
import { Context } from '@src/utils/context/context.type';
import { NotFoundError, UnauthorizedResourceError } from '@src/utils/errors';
import { FindOptions, TenantService } from '@src/utils/service';
import { ObjectId } from 'mongodb';
import { UpdateThreadArgs } from './dto/thread.args';
import { Thread } from './thread.entity';

@Injectable({ scope: Scope.REQUEST })
export class ThreadService extends TenantService<Thread> {
  constructor(
    @InjectRepository(Thread)
    private readonly threadRepository: EntityRepository<Thread>,
    private messageService: MessageService,
    @Inject(CONTEXT) context: Context
  ) {
    super(threadRepository, context);
  }

  async find<P extends string>(
    opts?: FindOptions<Thread, P> & { resolved?: boolean }
  ) {
    const query: FilterQuery<Thread> = {
      hotel: this.hotel,
    };

    if (opts?.resolved !== undefined) {
      query.resolved = opts.resolved;
    }

    const threads = await this.threadRepository.find(query, {
      populate: ['guest', 'order', 'order.space', 'order.pricelist'],
      orderBy: this.createSortArg(opts?.sort),
      limit: opts?.limit,
      offset: opts?.offset,
    });

    return threads;
  }

  async findThreadsByGuest<P extends string>(
    guestId: string,
    opts?: FindOptions<Thread, P>
  ) {
    const threads = await this.threadRepository.find(
      { hotel: this.hotel, guest: guestId },
      {
        populate: ['guest', 'order', 'order.space', 'order.pricelist'],
        orderBy: this.createSortArg(opts?.sort),
        limit: opts?.limit,
        offset: opts?.offset,
      }
    );
    return threads;
  }

  async findOne(threadId: string, guestId?: string) {
    const thread = await this.threadRepository.findOne(threadId, {
      populate: ['guest', 'order', 'order.space', 'order.pricelist'],
    });

    if (!thread) {
      throw new NotFoundError(Thread, { id: threadId });
    }

    if (guestId && thread.guest.id !== guestId) {
      throw new UnauthorizedResourceError(Guest, guestId);
    }

    return thread;
  }

  async getUnreadThreadCount() {
    const aggregation = await this.threadRepository.aggregate([
      {
        $match: {
          resolved: {
            $ne: true,
          },
          hotel: {
            $eq: new ObjectId(this.hotel),
          },
        },
      },
      {
        $lookup: {
          from: 'message',
          let: { id: '$_id' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $eq: ['$thread', '$$id'],
                },
              },
            },
          ],
          as: 'message',
        },
      },
      { $sort: { 'message.dateCreated': -1 } },
      {
        $project: {
          lastMessage: { $slice: ['$message', -1] },
        },
      },
      {
        $match: {
          'lastMessage.author': MessageAuthor.Guest,
        },
      },
      { $group: { _id: null, unreadThreads: { $sum: 1 } } },
    ]);

    if (!aggregation.length) {
      return 0;
    }

    return aggregation[0].unreadThreads;
  }

  async updateThread(updateThreadArgs: UpdateThreadArgs, guestId: string) {
    const thread = await this.findOne(updateThreadArgs.where.id, guestId);
    wrap(thread).assign(updateThreadArgs.data);
    this.persist(thread);
    return thread;
  }

  async getLastMessageByThreadId(id: string) {
    return this.messageService.getLastMessageByThreadId(id);
  }
}
