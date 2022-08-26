import WebSocket from 'ws';

const clients: Map<string, WebSocket> = new Map();

export class WSClients {
  public add(connectionId: string, ws: WebSocket) {
    clients.set(connectionId, ws);
  }

  public get(connectionId: string): WebSocket {
    const connection = clients.get(connectionId);

    if (!connection) {
      throw new Error(
        `Websocket connection \`${connectionId}\` does not exist in clients map.`
      );
    }

    return connection;
  }

  public remove(connectionId: string) {
    clients.delete(connectionId);
  }
}
