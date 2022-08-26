/* eslint-disable @typescript-eslint/ban-types */

import { metadataStorage } from './storage';
import { SDKFields } from './type';

export interface SDKFieldOptions<T> {
  fields?: SDKFields<T>;
  extend?: SDKFields<T>;
  omit?: SDKFields<T>;
}

export class UnspecifiedEntityError extends Error {
  constructor(propertyKey: symbol | string, entityName: string) {
    super();
    super.message = `SDK - Please specify a type for the \`${String(
      propertyKey
    )}\` field in \`${entityName}\``;
  }
}

export const SDKField = <T>(
  type?: () => Function & { prototype: T },
  opts?: SDKFieldOptions<T>
): PropertyDecorator => {
  return function (target, propertyKey) {
    const propertyMetadata = Reflect.getMetadata(
      'design:type',
      target,
      propertyKey
    );

    const entityName = target.constructor.name;

    if (!propertyMetadata) {
      if (!type) {
        throw new UnspecifiedEntityError(propertyKey, entityName);
      }
    }

    let propertyName;
    if (propertyMetadata?.name) {
      propertyName = propertyMetadata.name;
    }

    if (propertyName === 'Object' || type) {
      if (!type) {
        throw new UnspecifiedEntityError(propertyKey, entityName);
      }

      if (typeof type === 'function') {
        const returnValue = (<Function>type)();

        propertyName = returnValue?.name;
      }

      if (!propertyName && type.toString().indexOf('.')) {
        propertyName = type.toString().split('.')[1];
      }
    }

    if (opts) {
      propertyName = {
        type: propertyName,
        fields: opts?.fields,
        extend: opts?.extend,
        omit: opts?.omit,
      };
    }

    const index = metadataStorage.get(entityName);
    if (!index) {
      metadataStorage.set(entityName, new Map());
    }

    metadataStorage.get(entityName)!.set(String(propertyKey), propertyName);
  };
};
