import { InputType } from '@nestjs/graphql';
import { ClassConstructor } from 'class-transformer';

export const entityToInput = <T extends ClassConstructor<any>>(entity: T) => {
  @InputType(`Update${entity.name}Input`)
  class InputEntity extends entity {}

  return InputEntity;
};
