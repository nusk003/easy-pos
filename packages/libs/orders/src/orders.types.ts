import { Message, Thread } from '@hm/sdk';

export interface GuestMessage
  extends Omit<Message, 'guest' | 'user' | 'thread'> {}

export interface GuestThread extends Omit<Thread, 'guest' | 'lastMessage'> {
  lastMessage: GuestMessage;
}
