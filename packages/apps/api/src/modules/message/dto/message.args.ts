import { ArgsType, Field, InputType } from '@nestjs/graphql';
import { OrdersSortInput } from '@src/modules/order/dto/order.args';
import { CreatePaginationArgsType, PaginationSort } from '@src/utils/dto';
import { IsEnum, IsMongoId } from 'class-validator';

@InputType()
export class MessageSortInput {
  @IsEnum(PaginationSort)
  @Field(() => PaginationSort)
  id: PaginationSort;

  @IsEnum(PaginationSort)
  @Field(() => PaginationSort)
  dateCreated: PaginationSort;
}

@ArgsType()
export class MessagePaginationArgs extends CreatePaginationArgsType(
  OrdersSortInput
) {
  @IsMongoId()
  @Field()
  threadId: string;
}
