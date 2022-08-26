import { Message, Thread } from '@hm/sdk';

export interface GuestMessage
  extends Omit<Message, 'guest' | 'user' | 'thread'> {
  error?: boolean;
}

export interface GuestThread extends Omit<Thread, 'guest' | 'lastMessage'> {
  lastMessage: GuestMessage;
}
