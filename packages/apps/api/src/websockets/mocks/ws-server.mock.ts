import { mockCallback, mockContext } from '@src/utils/aws';
import { handler as authHandler } from '@src/websockets/websockets-auth.handler';
import { handler as websocketsHandler } from '@src/websockets/websockets.handler';
import { IncomingHttpHeaders, IncomingMessage } from 'http';
import { URLSearchParams } from 'url';
import { v4 as uuid } from 'uuid';
import WebSocket from 'ws';
import { WSClients } from './ws-clients.mock';

export class WSServerMock {
  wss: WebSocket.Server;

  params: Record<string, string>;

  headers: IncomingHttpHeaders;

  wsClients: WSClients;

  constructor() {
    this.wsClients = new WSClients();

    this.wss = new WebSocket.Server({
      port: 5001,
    });

    this.wss.on('connection', this.onConnection.bind(this));
  }

  async onConnection(ws: WebSocket, req: IncomingMessage) {
    const connectionId = uuid();
    this.params = Object.fromEntries(new URLSearchParams(req.url?.slice(1)));
    this.headers = req.headers;

    this.wsClients.add(connectionId, ws);

    try {
      try {
        await authHandler({
          requestContext: {
            connectionId,
            routeKey: '$connect',
          },
          queryStringParameters: this.params,
        });
      } catch {
        ws.close(1014);
        return;
      }

      const { statusCode } = await websocketsHandler(
        {
          requestContext: {
            connectionId,
            routeKey: '$connect',
          },
          queryStringParameters: this.params,
        },
        mockContext,
        mockCallback
      );

      if (statusCode !== 200) {
        ws.close();
        return;
      }
    } catch {
      ws.close();
      return;
    }

    const onMessage = async (message: string) => {
      const data = JSON.parse(message);

      await websocketsHandler(
        {
          requestContext: {
            connectionId,
            routeKey: data.action,
          },
          body: message,
        },
        mockContext,
        mockCallback
      );
    };

    const onError = (err: Error) => {
      console.error(err);
    };

    const onClose = async () => {
      this.wsClients.remove(connectionId);

      await websocketsHandler(
        {
          requestContext: {
            connectionId: connectionId,
            routeKey: '$disconnect',
          },
        },
        mockContext,
        mockCallback
      );
    };

    ws.on('message', onMessage);

    ws.on('error', onError);

    ws.on('close', onClose);
  }
}
