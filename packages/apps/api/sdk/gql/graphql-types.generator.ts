import { generate } from '@graphql-codegen/cli';
import { IntegrationProvider } from '@src/modules/hotel/entities';
import execa from 'execa';
import {
  __generated_path__,
  __output_dir__,
  __output_path__,
  __schema_out_path__,
} from './constants';
import { generateGQLQueries, generateOperationsFromSchema } from './util';

export const generateGraphQLTypes = async () => {
  const operations = await generateOperationsFromSchema();
  generateGQLQueries({ operations, output: __generated_path__ });

  await generate(
    {
      schema: __schema_out_path__,
      documents: ['sdk/gql/mutation/*.gql', 'sdk/gql/query/*.gql'],
      overwrite: true,
      silent: true,
      config: {
        maybeValue: 'T | undefined',
        inputMaybeValue: 'T | null | undefined',
        enumValues: {
          IntegrationProvider: IntegrationProvider,
        },
      },
      generates: {
        [__output_path__]: {
          plugins: [
            'typescript',
            'typescript-operations',
            'typescript-graphql-request',
          ],
        },
      },
    },
    true
  );

  await execa('yarn', ['build'], {
    cwd: __output_dir__,
  });
};
