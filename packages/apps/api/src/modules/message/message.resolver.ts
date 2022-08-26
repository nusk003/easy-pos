import { UseGuards } from '@nestjs/common';
import { Args, Query, Resolver } from '@nestjs/graphql';
import { Session } from '@src/modules/auth/auth.types';
import { GuestRole, HotelGuard, UserRole } from '@src/modules/auth/guards';
import { Guest } from '@src/modules/guest/guest.entity';
import { ThreadService } from '@src/modules/thread/thread.service';
import { GuestSession, Ses } from '@src/utils/context';
import { UnauthorizedResourceError } from '@src/utils/errors';
import { SDKQuery } from '@src/utils/gql';
import { MessagePaginationArgs } from './dto/message.args';
import { Message } from './message.entity';
import { MessageService } from './message.service';

@Resolver()
export class MessageResolver {
  constructor(
    private readonly threadService: ThreadService,
    private readonly messageService: MessageService
  ) {}

  @UseGuards(HotelGuard(UserRole.HotelMember, GuestRole.Identified))
  @Query(() => [Message], { name: 'messages' })
  @SDKQuery(() => [Message], { name: 'messages' })
  async getMessages(
    @Args() getMessageArgs: MessagePaginationArgs,
    @Ses() session: Session
  ): Promise<Message[]> {
    const { guestId } = <GuestSession>session;

    const thread = await this.threadService.findOne(
      getMessageArgs.threadId,
      guestId
    );

    if (guestId && guestId !== thread.guest.id) {
      throw new UnauthorizedResourceError(Guest, guestId);
    }

    const messages = this.messageService.findMessagesByThreadID(getMessageArgs);
    return messages;
  }
}
