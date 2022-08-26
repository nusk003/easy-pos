import { UseGuards } from '@nestjs/common';
import {
  Args,
  Mutation,
  Parent,
  Query,
  ResolveField,
  Resolver,
} from '@nestjs/graphql';
import { Session } from '@src/modules/auth/auth.types';
import { GuestRole, HotelGuard, UserRole } from '@src/modules/auth/guards';
import { Message } from '@src/modules/message/message.entity';
import { GuestSession, Ses } from '@src/utils/context';
import { SDKMutation, SDKQuery } from '@src/utils/gql';
import {
  ThreadPaginationArgs,
  UpdateThreadArgs,
  WhereThreadArgs,
} from './dto/thread.args';
import { Thread } from './thread.entity';
import { ThreadService } from './thread.service';

@Resolver(() => Thread)
export class ThreadResolver {
  constructor(private readonly threadService: ThreadService) {}

  @UseGuards(HotelGuard(UserRole.HotelMember, GuestRole.Identified))
  @Query(() => [Thread], { name: 'threads' })
  @SDKQuery(() => [Thread], { name: 'threads' })
  async getThreads(
    @Args() threadPaginationArgs: ThreadPaginationArgs,
    @Ses() session: Session
  ): Promise<Thread[]> {
    const guestId =
      'guestId' in session ? session.guestId : threadPaginationArgs.guestId;

    if (guestId) {
      return this.threadService.findThreadsByGuest(
        guestId,
        threadPaginationArgs
      );
    }
    return this.threadService.find(threadPaginationArgs);
  }

  @UseGuards(HotelGuard(UserRole.HotelMember, GuestRole.Identified))
  @Query(() => Thread, { name: 'thread' })
  @SDKQuery(() => Thread, { name: 'thread' })
  async getThreadByID(
    @Args() whereThreadArgs: WhereThreadArgs,
    @Ses() session: Session
  ): Promise<Thread> {
    const thread = await this.threadService.findOne(
      whereThreadArgs.where.id,
      (<GuestSession>session).guestId
    );
    return thread;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Query(() => Number, { name: 'unreadThreadCount' })
  @SDKQuery(() => Number, { name: 'unreadThreadCount' })
  async getUnreadThreadCount(): Promise<number> {
    const unreadThreadCount = await this.threadService.getUnreadThreadCount();
    return unreadThreadCount;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Thread)
  @SDKMutation(() => Thread)
  async updateThread(
    @Args() updateThreadArgs: UpdateThreadArgs,
    @Ses() session: Session
  ): Promise<Thread> {
    const thread = await this.threadService.updateThread(
      updateThreadArgs,
      (<GuestSession>session).guestId
    );
    await this.threadService.flush();
    return thread;
  }

  @UseGuards(HotelGuard(UserRole.HotelMember))
  @Mutation(() => Thread)
  @SDKMutation(() => Thread)
  async resolveThread(
    @Args() whereThreadArgs: WhereThreadArgs
  ): Promise<Thread> {
    const thread = await this.threadService.findOne(whereThreadArgs.where.id);
    thread.resolved = true;
    await this.threadService.flush();
    return thread;
  }

  @ResolveField(() => Message)
  async lastMessage(@Parent() thread: Thread): Promise<Message> {
    const lastMessage = await this.threadService.getLastMessageByThreadId(
      thread.id
    );
    return lastMessage;
  }
}
