import { __dev__ } from '@src/constants';
import { log } from '@src/utils/log';
import { Callback, Context } from 'aws-lambda';
import { ConnectionsResolver } from './modules/connection/connection.resolver';
import { MessagesResolver } from './modules/message/message.resolver';
import { AuthService } from './services/auth.service';
import { MikroORMService } from './services/mikro-orm.service';
import { RouteKey, WSEvent } from '@hm/sdk';

class Handler {
  authService: AuthService;

  constructor() {
    this.authService = new AuthService();
  }

  public async websockets(
    event: WSEvent,
    context: Context,
    _callback: Callback
  ) {
    try {
      context.callbackWaitsForEmptyEventLoop = false;

      const routeKey = <RouteKey>event.requestContext.routeKey;

      if (event.body) {
        const body = JSON.parse(event.body);
        if (body.data) {
          body.data = JSON.parse(body.data);
        }
        event = { ...event, body };
      }

      if (!__dev__ || routeKey !== RouteKey.Ping) {
        console.log();
        log.info('ws', routeKey);
      }

      const session = await this.authService.getSession(event);

      if (!__dev__) {
        console.info(session);
      }

      await new MikroORMService().init();

      const connectionsResolver = new ConnectionsResolver(session, event);
      const messagesResolver = new MessagesResolver(session, event);

      if (routeKey === RouteKey.Connect) {
        await connectionsResolver.connect();
      } else if (routeKey === RouteKey.Disconnect) {
        await connectionsResolver.disconnect();
      } else if (routeKey === RouteKey.Ping) {
        await connectionsResolver.pingPong();
      } else if (routeKey === RouteKey.SendMessage) {
        await messagesResolver.sendMessage();
      } else {
        await connectionsResolver.default();
      }

      return { statusCode: 200 };
    } catch (err) {
      console.error(err);
      return { statusCode: 500 };
    }
  }
}

const h = new Handler();
export const handler = new Handler().websockets.bind(h);
