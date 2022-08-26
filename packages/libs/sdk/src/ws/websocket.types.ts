import { Attraction, Message, Order, Thread } from '../gql';

export type WSEvent = any;

export enum RouteKey {
  Connect = '$connect',
  Disconnect = '$disconnect',
  Ping = 'ping',
  SendMessage = 'send-message',
}

export type WSRequestData = {
  action: RouteKey.SendMessage;
  data: SendMessageArgs;
};

export enum Action {
  Default = 'default',
  Pong = 'pong',
  HotelStream = 'hotel-stream',
  NewSpace = 'new-space',
  UpdateSpace = 'update-space',
  DeleteSpace = 'delete-space',
  NewPricelist = 'new-pricelist',
  UpdatePricelist = 'update-pricelist',
  DeletePricelist = 'delete-pricelist',
  NewOrder = 'new-order',
  UpdateOrder = 'update-order',
  NewMessage = 'new-message',
  ResolveThread = 'resolve-thread',
  NewBooking = 'new-booking',
  UpdateBooking = 'update-booking',
  SubmitBooking = 'submit-booking',
  ReviewBooking = 'review-booking',
  GenerateAttractionPlaces = 'generate-attraction-places',
  GenerateAttractionCategory = 'generate-attraction-category',
}

export type NotificationResponseData =
  | {
      action: Action.NewOrder | Action.UpdateOrder;
      data: Order;
    }
  | {
      action: Action.NewBooking | Action.SubmitBooking;
      data: Order;
    }
  | {
      action: Action.NewMessage;
      data: {
        thread: Thread;
        message: Message;
        newThread?: boolean;
      };
      token: string;
    }
  | {
      action: Action.ResolveThread;
      data: Thread;
    }
  | {
      action: Action.GenerateAttractionPlaces;
      data: Attraction;
    };

export interface SendMessageArgs {
  token: string;
  text: string;
  threadId?: string;
  guestId?: string;
  orderId?: string;
}
