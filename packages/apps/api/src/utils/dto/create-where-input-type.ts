import { Field, InputType } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@InputType({ isAbstract: true })
export class WhereInputType {
  @IsMongoId()
  @Field()
  id: string;
}

export const CreateWhereInputType = () => {
  return WhereInputType;
};
