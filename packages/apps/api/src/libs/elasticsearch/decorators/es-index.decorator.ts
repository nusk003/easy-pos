import { metadataStorage, indices } from './storage';

export enum ShardingStrategy {
  Group = 'group',
}

export interface ESIndexOptions {
  abstract?: boolean;
  shardingStrategy?: ShardingStrategy;
}

export const ESIndex = (opts?: ESIndexOptions): ClassDecorator => {
  return function (object) {
    let extendedClass = Object.getPrototypeOf(object);

    while (extendedClass.name) {
      if (metadataStorage.get(extendedClass.name.toLowerCase())) {
        metadataStorage
          .get(extendedClass.name.toLowerCase())!
          .forEach((value, key) => {
            metadataStorage.get(object.name.toLowerCase())!.set(key, value);
          });
      }

      extendedClass = Object.getPrototypeOf(extendedClass);
    }

    indices.set(object.name.toLowerCase(), {
      abstract: opts?.abstract,
      shardingStrategy: opts?.shardingStrategy,
    });
  };
};
