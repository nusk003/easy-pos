import { __https__ } from '@src/constants';
import path from 'path';

export const __gql_endpoint__ = __https__
  ? 'https://localhost:5000/graphql'
  : 'http://localhost:5000/graphql';

export const __generated_path__ = path.resolve('sdk', 'gql');

export const __output_dir__ = path.resolve('../../libs', 'sdk');

export const __output_path__ = path.resolve(
  __output_dir__,
  'src/gql/graphql.types.ts'
);

export const __schema_out_path__ = path.resolve(
  __generated_path__,
  'schema.gql'
);
