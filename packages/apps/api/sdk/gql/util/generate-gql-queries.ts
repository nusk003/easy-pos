import {
  metadataStorage,
  MetadataStorageOptions,
  resolvers,
} from '@src/utils/gql/sdk/decorators/storage';
import path from 'path';
import fs from 'fs';

interface GenerateGQLQueriesOptions {
  operations: string;
  output: string;
}

class GQLGeneratorError extends Error {
  constructor(message: string) {
    super();
    super.message = `SDK - ${message}`;
  }
}

class GQLQuery {
  private query = '';
  public indentationLevel = 0;

  private get last() {
    return this.query.slice(-1);
  }

  public append(text: string) {
    if (!this.query.length) {
      this.query = text;
      return;
    }

    if (this.last === ' ') {
      this.query += text;
      return;
    }

    this.query += ' ' + text;
  }

  public openBracket() {
    this.query += ' {';
  }

  public closeBracket() {
    this.query += '}';
  }

  public newLine() {
    this.query += '\n';
    this.query += ' '.repeat(this.indentationLevel);
  }

  public indent() {
    this.indentationLevel += 2;
    this.query += '  ';
  }

  public outdent() {
    this.indentationLevel -= 2;
    this.query = this.query.slice(0, this.query.length - 2);
  }

  public print() {
    return this.query;
  }
}

const findEntity = (name: string) => {
  const entity = Array.from(metadataStorage).find(([entityName]) => {
    return entityName === name;
  })?.[1];

  if (!entity) {
    throw new GQLGeneratorError(`Unable to find entity: ${name}`);
  }

  return entity;
};

export const generateGQLQueries = (opts: GenerateGQLQueriesOptions) => {
  const queryPath = path.resolve(opts.output, 'query');
  const mutationPath = path.resolve(opts.output, 'mutation');

  const opsFile = opts.operations;

  if (!fs.existsSync(queryPath)) {
    fs.mkdirSync(queryPath);
  }

  if (!fs.existsSync(mutationPath)) {
    fs.mkdirSync(mutationPath);
  }

  Array.from(resolvers).forEach(([queryName, opts]) => {
    const parseField = (
      fieldName: string | null,
      fieldType: string | MetadataStorageOptions
    ) => {
      if (
        fieldType === 'String' ||
        fieldType === 'Number' ||
        fieldType === 'Boolean' ||
        fieldType === 'Date' ||
        fieldType === 'Basic'
      ) {
        query.append(fieldName!);
        query.newLine();
      } else if (typeof fieldType === 'string') {
        if (!fieldName) {
          throw new GQLGeneratorError('Field name must be provided.');
        }

        query.append(fieldName);
        query.openBracket();
        query.newLine();
        query.indent();

        const nestedEntity = findEntity(fieldType);

        Array.from(nestedEntity).forEach(([fieldName, fieldType]) => {
          parseField(fieldName, fieldType);
        });

        query.outdent();
        query.closeBracket();
        query.newLine();
      } else if (fieldType.extend || fieldType.omit) {
        if (!fieldName) {
          throw new GQLGeneratorError('Field name must be provided.');
        }

        query.append(fieldName);
        query.openBracket();
        query.newLine();
        query.indent();

        const nestedEntity = new Map(findEntity(fieldType.type));

        if (fieldType.omit) {
          fieldType.omit.forEach((extendName) => {
            if (extendName.includes('.')) {
              const extendPrefix = extendName.split('.')[0];
              const extendType = nestedEntity.get(extendPrefix);
              if (typeof extendType === 'object') {
                const fields = extendType?.fields?.filter(
                  (name) => name !== extendName.split('.')[1]
                );

                if (!fields?.length) {
                  nestedEntity.delete(extendPrefix);
                } else {
                  nestedEntity.set(extendPrefix, {
                    type: extendType!.type,
                    fields,
                    extend: undefined,
                  });
                }
              }
            } else {
              nestedEntity.delete(extendName);
            }
          });
        }

        if (fieldType.extend) {
          fieldType.extend.forEach((extendName) => {
            if (extendName.includes('.')) {
              const extendPrefix = extendName.split('.')[0];
              const extendType = nestedEntity.get(extendPrefix);
              if (typeof extendType === 'object') {
                const extendedFields = extendType?.fields || [];

                const fields = Array.from(
                  new Set([...extendedFields, extendName.split('.')[1]])
                );

                nestedEntity.set(extendPrefix, {
                  type: extendType!.type,
                  fields,
                  extend: undefined,
                });
              }
            } else {
              const extendType = nestedEntity.get(extendName);

              if (typeof extendType === 'object') {
                nestedEntity.set(extendName, extendType.type);
              } else {
                nestedEntity.set(extendName, 'String');
              }
            }
          });
        }

        Array.from(nestedEntity).forEach(([fieldName, fieldType]) => {
          parseField(fieldName, fieldType);
        });

        query.outdent();
        query.closeBracket();
        query.newLine();
      } else if (fieldType.fields) {
        if (fieldName) {
          query.append(fieldName);
          query.openBracket();
          query.newLine();
          query.indent();
        }

        const parseNestedFields = (nestedFields: string[]) => {
          while (nestedFields.length > 0) {
            const nestedField = nestedFields.pop();
            if (nestedField) {
              const nestedNestedFields = [];
              if (nestedField.includes('.')) {
                const nestedFieldPrefix = nestedField.split('.')[0];
                nestedNestedFields.push(nestedField.split('.')[1]);

                for (let idx = 0; idx < nestedFields.length; idx += 1) {
                  const nf = nestedFields[idx];
                  if (nf.includes(nestedFieldPrefix)) {
                    nestedNestedFields.push(nf.split('.')[1]);
                    nestedFields.splice(idx, 1);
                    idx -= 1;
                  }
                }

                query.append(nestedFieldPrefix);
                query.openBracket();
                query.newLine();
                query.indent();

                parseNestedFields([...nestedNestedFields]);

                query.outdent();
                query.closeBracket();
                query.newLine();
              } else {
                query.append(nestedField);
                query.newLine();
              }
            }
          }
        };

        parseNestedFields([...fieldType.fields]);

        query.outdent();
        query.closeBracket();
        query.newLine();
      }
    };

    const resolverPath = opts.type === 'query' ? queryPath : mutationPath;
    const resolverFile = path.resolve(
      resolverPath,
      `${opts.methodName}.${opts.type}.gql`
    );

    const query = new GQLQuery();

    const opsQuery = new RegExp(
      String.raw`(${opts.type} ${opts.name}[ \(].*?\n})\n\n`,
      'si'
    ).exec(opsFile)?.[0];

    if (!opsQuery) {
      throw new GQLGeneratorError(
        `Operations query does not exist for: ${opts.name}`
      );
    }

    let queryHeading = /[^{]*{[^{]*./.exec(opsQuery)![0];

    queryHeading = queryHeading.replace(/(?<= )(.*)(?=\()/, queryName);

    if (opts.methodName) {
      queryHeading = queryHeading.replace(queryName, opts.methodName);
    }

    query.append(queryHeading);
    query.indentationLevel = 4;

    query.newLine();

    if (opts.fields) {
      parseField(null, { fields: opts.fields, type: opts.returnType });
      query.outdent();
      query.closeBracket();
    } else if (
      opts.returnType !== 'Boolean' &&
      opts.returnType !== 'String' &&
      opts.returnType !== 'Number' &&
      opts.returnType !== 'Date' &&
      !opts.enum
    ) {
      const entity = new Map(findEntity(opts.returnType));

      if (opts.omit) {
        opts.omit.forEach((extendName) => {
          if (extendName.includes('.')) {
            const extendPrefix = extendName.split('.')[0];
            const extendType = entity.get(extendPrefix);
            if (typeof extendType === 'object') {
              const fields = extendType?.fields?.filter(
                (name) => name !== extendName.split('.')[1]
              );

              if (!fields?.length) {
                entity.delete(extendPrefix);
              } else {
                entity.set(extendPrefix, {
                  type: extendType!.type,
                  fields,
                  extend: undefined,
                });
              }
            }
          } else {
            entity.delete(extendName);
          }
        });
      }

      if (opts.extend) {
        opts.extend.forEach((extendName) => {
          if (extendName.includes('.')) {
            const extendPrefix = extendName.split('.')[0];
            const extendType = entity.get(extendPrefix);
            if (typeof extendType === 'object') {
              const extendedFields = extendType?.fields || [];

              const fields = Array.from(
                new Set([...extendedFields, extendName.split('.')[1]])
              );

              entity.set(extendPrefix, {
                type: extendType!.type,
                fields,
                extend: undefined,
              });
            }
          } else {
            const extendType = entity.get(extendName);

            if (typeof extendType === 'object') {
              entity.set(extendName, extendType.type);
            } else {
              entity.set(extendName, 'String');
            }
          }
        });
      }

      const entityArray = Array.from(entity);

      entityArray.forEach(([fieldName, fieldType]) => {
        parseField(fieldName, fieldType);
      });

      query.outdent();

      query.closeBracket();
      query.newLine();

      query.outdent();
      query.closeBracket();
    }

    fs.writeFileSync(resolverFile, query.print());
  });
};
