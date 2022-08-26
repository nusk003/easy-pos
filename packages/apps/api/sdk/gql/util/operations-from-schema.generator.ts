import { buildOperationNodeForField } from '@graphql-tools/utils';
import got from 'got';
import {
  buildClientSchema,
  getIntrospectionQuery,
  OperationTypeNode,
  print,
} from 'graphql';
import { __gql_endpoint__ } from '../constants';

const getSchemaFromUrl = async (url: string) => {
  const searchParams = {
    query: getIntrospectionQuery().toString(),
  };

  const response = await got.get(url, {
    searchParams,
    responseType: 'json',
    https: {
      rejectUnauthorized: false,
    },
  });

  const { data } = response.body as any;
  return buildClientSchema(data);
};

export const generateOperationsFromSchema = async () => {
  const schema = await getSchemaFromUrl(__gql_endpoint__);

  const operationsDictionary = {
    query: { ...(schema.getQueryType()?.getFields() ?? {}) },
    mutation: { ...(schema.getMutationType()?.getFields() ?? {}) },
    subscription: { ...(schema.getSubscriptionType()?.getFields() ?? {}) },
  };

  let documentString = '';

  for (const [operationKind, operationValue] of Object.entries(
    operationsDictionary
  )) {
    for (const operationName of Object.keys(operationValue)) {
      const operationAST: any = buildOperationNodeForField({
        schema,
        kind: <OperationTypeNode>operationKind,
        field: operationName,
      });

      operationAST.name.value = operationAST.name?.value
        .replace('_query', '')
        .replace('_mutation', '');

      documentString += print(operationAST) + '\n\n';
    }
  }

  return documentString;
};
