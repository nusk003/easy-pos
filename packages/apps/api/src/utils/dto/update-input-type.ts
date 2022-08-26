import { Type } from '@nestjs/common';
import { PartialType, PickType } from '@nestjs/graphql';
import { entityToInput } from './entity-to-input';

export const CreateInputType = <T, K extends keyof T>(
  entity: Type<T>,
  pick?: readonly K[]
) => {
  return PickType(entityToInput(entity), pick || []);
};

export const CreateUpdateInputType = <T, K extends keyof T>(
  entity: Type<T>,
  pick: readonly K[]
) => {
  return PartialType(PickType(entityToInput(entity), pick || []));
};
