import { ArgsType, Field } from '@nestjs/graphql';
import { IsMongoId } from 'class-validator';

@ArgsType()
export class HotelsWhereInput {
  @IsMongoId()
  @Field()
  groupId: string;
}
