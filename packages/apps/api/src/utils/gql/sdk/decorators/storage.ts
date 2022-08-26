/* eslint-disable @typescript-eslint/ban-types */

import { SDKFieldOptions } from './sdk-field.decorator';
import { SDKObjectOptions } from './sdk-object.decorator';
import { SDKResolver } from './sdk.decorator';

export interface MetadataStorageOptions extends SDKFieldOptions<any> {
  type: string;
}

export const metadataStorage = new Map<
  string,
  Map<string, MetadataStorageOptions | string>
>();

export const entities = new Map<string, SDKObjectOptions>();

export const resolvers = new Map<string, SDKResolver>();
