import { Message, MessageAuthor } from '@hm/sdk';
import dayjs from 'dayjs';
import relativeTime from 'dayjs/plugin/relativeTime';

dayjs.extend(relativeTime);

export const getMessageDayFromNow = (date: Date): string => {
  const now = dayjs();

  const today = dayjs(now);
  const yesterday = dayjs(now).subtract(1, 'day');

  if (dayjs(date).isSame(dayjs(today), 'day')) {
    return 'Today';
  }

  if (dayjs(date).isSame(dayjs(yesterday), 'day')) {
    return 'Yesterday';
  }

  return dayjs(date).format('D MMM YY');
};

export const getMessageTimeFromNow = (date: Date, now: Date): string => {
  if (dayjs(now).diff(date, 'minutes') < 1) {
    return 'now';
  }

  if (dayjs(now).diff(date, 'hours') < 1) {
    return `${dayjs(now).diff(date, 'minutes')}m`;
  }

  return dayjs(date).format('HH:mm');
};

export const getThreadTimeFromNow = (date: Date | undefined): string => {
  if (!date) {
    return '';
  }

  const now = dayjs();

  if (dayjs(now).diff(date, 'minutes') < 1) {
    return 'just now';
  }

  if (dayjs(now).diff(date, 'hours') < 1) {
    if (dayjs(now).diff(date, 'minutes') === 1) {
      return 'a min ago';
    }
    return `${dayjs(now).diff(date, 'minutes')} mins ago`;
  }

  if (dayjs(now).diff(date, 'days') < 1) {
    return dayjs(date).fromNow();
  }

  if (dayjs(now).diff(date, 'days') < 8) {
    return dayjs(date).format('ddd');
  }

  if (dayjs(now).diff(date, 'years') < 1) {
    return dayjs(date).format('D MMM');
  }

  return dayjs(date).format('D MMM YY');
};

export interface ParsedMessage extends Message {
  unreadMessages?: Set<string>;
  error?: boolean;
}

export interface MessageStackItem {
  dateCreated: Date;
  messages: Array<ParsedMessage>;
}

export interface ParsedMessagesSection {
  author: MessageAuthor;
  messageStack: MessageStackItem[];
  newDay: boolean;
  dateCreated: Date;
}

export type ParsedMessages = Array<ParsedMessagesSection>;

export const parseMessages = (
  messages: Array<Message> | undefined,
  unreadMessages?: Set<string>
): ParsedMessages => {
  if (!messages || !messages.length) {
    return [];
  }

  const r: ParsedMessages = [];
  let lastAuthor: MessageAuthor | undefined;
  let lastDate: Date | undefined;

  for (let idx = 0; idx <= messages.length - 1; idx += 1) {
    const message: ParsedMessage = { ...messages[idx] };
    const nextMessage: Message | undefined = { ...messages[idx + 1] };
    const author = message.author;

    if (unreadMessages?.size) {
      message.unreadMessages =
        !!unreadMessages?.has(message.id) &&
        !unreadMessages?.has(nextMessage?.id)
          ? unreadMessages
          : undefined;
    }

    const newDay = !nextMessage?.id
      ? false
      : !dayjs(message.dateCreated).isSame(
          dayjs(nextMessage?.dateCreated),
          'day'
        );

    if (author === lastAuthor && !newDay) {
      const lastR = r[r.length - 1];
      const lastMessageStack = lastR.messageStack[0];
      if (dayjs(lastDate).diff(dayjs(message.dateCreated), 'minutes') > 2) {
        lastDate = message.dateCreated;
        lastR.messageStack.unshift({
          dateCreated: new Date(message.dateCreated),
          messages: [message],
        });
      } else {
        lastDate = new Date(message.dateCreated);
        lastMessageStack.messages.unshift(message);
      }
    } else {
      r.push({
        author,
        messageStack: [
          {
            dateCreated: new Date(message.dateCreated),
            messages: [message],
          },
        ],
        dateCreated: new Date(message.dateCreated),
        newDay,
      });

      lastAuthor = author;
      lastDate = new Date(message.dateCreated);
    }
  }

  return r;
};

export const splitIntoLimit = (messageStack: Message[], limit: number) => {
  const messages = [];
  let iterator = 0;
  while (iterator !== -1) {
    const newMsgStack = [...messageStack];
    const piece = newMsgStack.slice(limit * iterator, limit * iterator + limit);
    iterator = piece.length < limit || piece.length === 0 ? -1 : iterator + 1;
    if (piece.length > 0) {
      messages.push(piece);
    }
  }

  return messages;
};
