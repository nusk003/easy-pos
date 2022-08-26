/* eslint-disable @typescript-eslint/ban-types */

import { resolvers } from './storage';
import { SDKFields } from './type';

export interface SDKOptions<T> {
  name?: string;
  enum?: boolean;
  fields?: SDKFields<T>;
  extend?: SDKFields<T>;
  omit?: SDKFields<T>;
  methodName?: string;
}

export interface SDKResolver {
  type: 'query' | 'mutation';
  name: string;
  returnType: string;
  methodName: string;
  enum?: boolean;
  fields?: SDKFields<any>;
  extend?: SDKFields<any>;
  omit?: SDKFields<any>;
}

type SDKMethodType<T> =
  | (() => [Function])
  | (() => Function & { prototype: T })
  | (() => object)
  | (() => [object]);

class SDKError extends Error {
  constructor(message: string) {
    super();
    super.message = `SDK - ${message}`;
  }
}

const sdkMethod = <T>(
  type: SDKMethodType<T>,
  queryType: SDKResolver['type'],
  opts?: SDKOptions<T>
): MethodDecorator => {
  return function (_object, resolverMethodName) {
    const typeFunction = type() as (() => [Function]) | (() => Function);

    const returnObject = Array.isArray(typeFunction)
      ? typeFunction[0]
      : typeFunction;

    if (!('name' in returnObject) && !opts?.enum) {
      throw new SDKError(
        'Is this return type an enum? All enums must have a corresponding boolean flag enabled'
      );
    }

    const returnType = returnObject.name;

    const queryName = opts?.name || <string>resolverMethodName;

    const methodName = opts?.methodName || queryName;

    resolvers.set(methodName, {
      name: queryName,
      returnType,
      type: queryType,
      methodName,
      enum: opts?.enum,
      fields: opts?.fields,
      omit: opts?.omit,
      extend: opts?.extend,
    });
  };
};

export const SDKQuery = <T>(
  type: SDKMethodType<T>,
  opts?: SDKOptions<T>
): MethodDecorator => {
  return sdkMethod(type, 'query', opts);
};

export const SDKMutation = <T>(
  type: SDKMethodType<T>,
  opts?: SDKOptions<T>
): MethodDecorator => {
  return sdkMethod(type, 'mutation', opts);
};
