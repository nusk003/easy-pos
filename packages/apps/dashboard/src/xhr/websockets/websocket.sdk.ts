import {
  Action,
  Attraction,
  AttractionCategory,
  Message,
  Order,
  RouteKey,
  SendMessageArgs,
  Thread,
} from '@hm/sdk';

export interface NewOrderResponse {
  data: Order;
}

export interface GenerateAttractionCategoryResponse {
  data: AttractionCategory;
}

export interface GenerateAttractionPlacesResponse {
  data: Attraction;
}

export interface UpdateOrderResponse extends NewOrderResponse {}

export interface NewMessageResponse {
  data: { thread: Thread; message: Message; newThread: boolean };
  token: string;
}

export interface ResolveThreadResponse {
  data: Thread;
}

export interface PongResponse {
  token: string;
}

export interface HotelStreamResponse {
  data: {
    type: 'create' | 'update' | 'delete';
    entity: string;
  };
}

export class WebSocketSDK extends WebSocket {
  newMessageListeners: Function[] = [];

  pongListeners: Function[] = [];

  hotelStreamListeners: Function[] = [];

  constructor(url: string, protocols?: string | string[]) {
    super(url, protocols);
    this.onmessage = this.onMessage.bind(this);
  }

  onMessage(event: any) {
    const data = JSON.parse(event.data);

    if (data.action === Action.NewMessage) {
      this.newMessageListeners.forEach((listener) => listener(data));
      if (this.onNewMessage) {
        return this.onNewMessage(data);
      }
    }

    if (data.action === Action.NewOrder) {
      if (this.onNewOrder) {
        return this.onNewOrder(data);
      }
    }

    if (data.action === Action.HotelStream) {
      this.hotelStreamListeners.forEach((listener) => listener(data));
      if (this.onHotelStream) {
        return this.onHotelStream(data);
      }
    }

    if (data.action === Action.Pong) {
      this.pongListeners.forEach((listener) => listener(data));
      if (this.onPong) {
        return this.onPong(data);
      }
    }

    if (data.action === Action.GenerateAttractionPlaces) {
      return this.onGenerateAttractionPlaces(data);
    }

    if (data.action === Action.GenerateAttractionCategory) {
      return this.onGenerateAttractionCategory(data);
    }
  }

  onHotelStream: (response: HotelStreamResponse) => void;

  addHotelStreamListener(callback: (response: HotelStreamResponse) => void) {
    this.hotelStreamListeners.push(callback);
  }

  removeHotelStreamListener(callback: (response: HotelStreamResponse) => void) {
    this.hotelStreamListeners = this.hotelStreamListeners.filter(
      (listener) => listener.toString() !== callback.toString()
    );
  }

  removeAllHotelStreamListeners() {
    this.hotelStreamListeners = [];
  }

  onNewMessage: (response: NewMessageResponse) => void;

  addOnNewMessageListener(callback: (response: NewMessageResponse) => void) {
    this.newMessageListeners.push(callback);
  }

  removeOnNewMessageListener(callback: (response: NewMessageResponse) => void) {
    this.newMessageListeners = this.newMessageListeners.filter(
      (listener) => listener.toString() !== callback.toString()
    );
  }

  onGenerateAttractionCategory: (
    response: GenerateAttractionCategoryResponse
  ) => void;

  onGenerateAttractionPlaces: (
    response: GenerateAttractionPlacesResponse
  ) => void;

  removeAllNewMessageListeners() {
    this.newMessageListeners = [];
  }

  onPong: (response: PongResponse) => void;

  addPongListener(callback: (response: PongResponse) => void) {
    this.pongListeners.push(callback);
  }

  removePongListener(callback: (response: PongResponse) => void) {
    this.pongListeners = this.pongListeners.filter(
      (listener) => listener.toString() !== callback.toString()
    );
  }

  removeAllPongListeners() {
    this.pongListeners = [];
  }

  onNewOrder: (response: NewOrderResponse) => void;

  sendMessage(body: SendMessageArgs) {
    const request = {
      action: RouteKey.SendMessage,
      data: JSON.stringify(body),
    };
    this.send(JSON.stringify(request));
  }

  ping(token: string) {
    const request = { action: RouteKey.Ping, token };
    this.send(JSON.stringify(request));
  }
}
