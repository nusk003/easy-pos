import { getSdk } from '@hm/sdk';
import { __graphql_endpoint__ } from '@src/constants';
import { useStore } from '@src/store';
import { ASTNode, print } from 'graphql';
import {
  GraphQLClient as GraphQLRequestClient,
  RequestOptions,
} from 'graphql-request';
import { v4 as uuid } from 'uuid';

export type RequestDocument = string | ASTNode;
export type Variables = { [key: string]: any };
export type Listener = (
  requestDocument: RequestDocument,
  variables: Variables | undefined
) => void;

class GraphQLClient extends GraphQLRequestClient {
  listeners: Array<Listener> = [];

  async request<T = any, V = Variables>(
    document: RequestDocument | RequestOptions<V>,
    variables?: V,
    requestHeaders?: HeadersInit
  ): Promise<T> {
    const { hotelId, setLydJWT } = useStore.getState();

    const result = await this.rawRequest(
      print(document as ASTNode),
      variables,
      {
        ...requestHeaders,
        'hotel-id': hotelId,
        'x-transaction-id': uuid(),
      }
    );

    this.listeners.forEach((listener) => {
      listener(print(document as ASTNode), variables);
    });

    const token = result.headers.get('authorization');

    if (token) {
      setLydJWT(token);
    }

    return result.data;
  }

  addEventListener(listener: Listener) {
    this.listeners.push(listener);
  }

  removeEventListener(listener: Listener) {
    this.listeners = this.listeners.filter((l) => listener !== l);
  }
}

export const gqlClient = new GraphQLClient(__graphql_endpoint__, {
  credentials: 'include',
});

export const sdk = getSdk(gqlClient);
