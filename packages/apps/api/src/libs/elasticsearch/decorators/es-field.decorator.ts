import { metadataStorage } from './storage';

export interface ESFieldOptions<T> {
  mappedBy?: (field: T) => any;
  fields?: Array<keyof T>;
  isCollection?: boolean;
  getter?: (field: T) => any;
}

class UnspecifiedEntityError extends Error {
  constructor(propertyKey: symbol | string, indexName: string) {
    super();
    super.message = `ES - Please specify a type for the \`${String(
      propertyKey
    )}\` field in \`${indexName}\``;
  }
}

export const ESField = <T>(
  // eslint-disable-next-line @typescript-eslint/ban-types
  type?: (() => Function & { prototype: T }) | (() => object),
  opts?: ESFieldOptions<T>
): PropertyDecorator => {
  return function (target, propertyKey) {
    const propertyMetadata = Reflect.getMetadata(
      'design:type',
      target,
      propertyKey
    );

    const indexName = target.constructor.name.toLowerCase();

    if (!propertyMetadata) {
      if (!type) {
        throw new UnspecifiedEntityError(propertyKey, indexName);
      }
    }

    let propertyName;
    if (propertyMetadata?.name) {
      propertyName = propertyMetadata.name;
    }

    if (propertyName === 'Object' || type) {
      if (!type) {
        throw new UnspecifiedEntityError(propertyKey, indexName);
      }

      if (typeof type === 'function') {
        // eslint-disable-next-line @typescript-eslint/ban-types
        propertyName = (<Function>type)()?.name;
      }

      if (!propertyName && type.toString().indexOf('.')) {
        propertyName = type.toString().split('.')[1];
      }
    }

    if (opts) {
      propertyName = {
        type: propertyName,
        mappedBy: opts?.mappedBy,
        fields: opts?.fields,
        isCollection: opts?.isCollection,
        getter: opts?.getter,
      };
    }

    const index = metadataStorage.get(indexName);
    if (!index) {
      metadataStorage.set(indexName, new Map());
    }

    metadataStorage.get(indexName)!.set(String(propertyKey), propertyName);
  };
};
