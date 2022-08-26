import { ArgsType } from '@nestjs/graphql';

export const entityToArgs = <T extends { new (...args: any[]): {} }>(
  entity: T
) => {
  @ArgsType()
  class ArgsEntity extends entity {}

  return ArgsEntity;
};
