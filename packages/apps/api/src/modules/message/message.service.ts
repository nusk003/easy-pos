import { QueryOrder } from '@mikro-orm/core';
import { EntityRepository } from '@mikro-orm/mongodb';
import { InjectRepository } from '@mikro-orm/nestjs';
import { Inject, Injectable, Scope } from '@nestjs/common';
import { CONTEXT } from '@nestjs/graphql';
import { Context } from '@src/utils/context/context.type';
import { NotFoundError } from '@src/utils/errors';
import { FindOptions, TenantService } from '@src/utils/service';
import { Message } from './message.entity';

@Injectable({ scope: Scope.REQUEST })
export class MessageService extends TenantService<Message> {
  constructor(
    @InjectRepository(Message)
    private readonly messageRepository: EntityRepository<Message>,
    @Inject(CONTEXT) context: Context
  ) {
    super(messageRepository, context);
  }

  async findMessagesByThreadID<P extends string>(
    opts?: FindOptions<Message, P> & { threadId: string }
  ) {
    const messages = await this.messageRepository.find(
      { hotel: this.hotel, thread: opts?.threadId },
      {
        populate: opts?.populate,
        orderBy: { dateCreated: 'desc' },
        limit: opts?.limit,
        offset: opts?.offset,
      }
    );

    return messages;
  }

  async getLastMessageByThreadId(id: string) {
    const lastMessage = await this.messageRepository.findOne(
      { hotel: this.hotel, thread: id },
      {
        orderBy: { dateCreated: QueryOrder.DESC },
      }
    );

    if (!lastMessage) {
      throw new NotFoundError(Message, { thread: id });
    }

    return lastMessage;
  }
}
