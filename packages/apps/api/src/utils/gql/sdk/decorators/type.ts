/* eslint-disable @typescript-eslint/ban-types */

import { ObjectId } from 'mongodb';

export type Prev = [never, 0, 1, 2, 3, ...0[]];

export type Join<K, P> = K extends string | number
  ? P extends string | number
    ? `${K}${'' extends P ? '' : '.'}${P}`
    : never
  : never;

export type Paths<T, D extends number = 10> = [D] extends [never]
  ? never
  : T extends Date | ObjectId
  ? never
  : T extends object
  ? {
      [K in keyof T]-?: K extends string | number
        ? `${K}` | Join<K, Paths<T[K], Prev[D]>>
        : never;
    }[keyof T]
  : '';

export type SDKFields<T> = Array<Paths<T>>;
