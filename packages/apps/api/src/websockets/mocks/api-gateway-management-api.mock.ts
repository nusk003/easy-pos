import { ApiGatewayManagementApi } from 'aws-sdk';
import { WSClients } from './ws-clients.mock';

const wsClients = new WSClients();

class ApiGatewayManagementApiMockClass {
  public postToConnection(
    params: ApiGatewayManagementApi.Types.PostToConnectionRequest
  ) {
    const { ConnectionId, Data } = params;
    const ws = wsClients.get(ConnectionId);

    return {
      async promise() {
        return new Promise<void>((resolve, reject) => {
          ws.send(Data, (err) => {
            if (err) {
              reject(err);
            }
            resolve();
          });
        });
      },
    };
  }

  public deleteConnection(
    params: ApiGatewayManagementApi.Types.DeleteConnectionRequest
  ) {
    return {
      async promise() {
        wsClients.remove(params.ConnectionId);
      },
    };
  }
}

export const ApiGatewayManagementApiMock = <any>(
  ApiGatewayManagementApiMockClass
);
