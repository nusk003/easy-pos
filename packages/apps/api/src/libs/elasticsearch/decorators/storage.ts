import { ESFieldOptions } from './es-field.decorator';
import { ESIndexOptions } from './es-index.decorator';

export interface IndicesOptions {
  abstract?: boolean;
}

export const metadataStorage = new Map<
  string,
  Map<string, ESFieldOptions<any> | string>
>();

export const indices = new Map<string, ESIndexOptions>();
