import { metadataStorage, entities } from './storage';

export interface SDKObjectOptions {
  abstract?: boolean;
}

export const SDKObject = (opts?: SDKObjectOptions): ClassDecorator => {
  return function (object) {
    let extendedClass = Object.getPrototypeOf(object);

    while (extendedClass.name) {
      if (metadataStorage.get(extendedClass.name)) {
        metadataStorage.get(extendedClass.name)!.forEach((value, key) => {
          let metadataEntity = metadataStorage.get(object.name);

          if (!metadataEntity) {
            metadataStorage.set(object.name, new Map());
            metadataEntity = metadataStorage.get(object.name);
          }

          metadataEntity!.set(key, value);
        });
      }

      extendedClass = Object.getPrototypeOf(extendedClass);
    }

    entities.set(object.name, {
      abstract: opts?.abstract,
    });
  };
};
