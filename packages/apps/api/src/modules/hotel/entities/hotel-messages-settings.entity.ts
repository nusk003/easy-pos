import { Field, InputType, ObjectType } from '@nestjs/graphql';
import { Availability } from '@src/utils/entity';
import { SDKField } from '@src/utils/gql';
import { Type } from 'class-transformer';
import {
  IsBoolean,
  IsNotEmpty,
  IsOptional,
  IsString,
  ValidateNested,
} from 'class-validator';

@ObjectType({ isAbstract: true })
@InputType('MessagesAwayMessageInput')
export class MessagesAwayMessage {
  @IsString()
  @IsNotEmpty()
  @Field({ nullable: true })
  @SDKField()
  message: string;

  @IsBoolean()
  @Field()
  @SDKField()
  showTime: boolean;
}

@ObjectType({ isAbstract: true })
@InputType('MessagesSettingsInput')
export class MessagesSettings {
  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  enabled?: boolean;

  @Type(() => Availability)
  @ValidateNested()
  @IsOptional()
  @Field(() => Availability, { nullable: true })
  @SDKField()
  availability?: Availability;

  @IsBoolean()
  @IsOptional()
  @Field({ nullable: true })
  @SDKField()
  checkedInOnly?: boolean;

  @IsBoolean()
  @Field({ nullable: true })
  @SDKField()
  hideResolvedChats?: boolean;

  @Type(() => MessagesAwayMessage)
  @ValidateNested()
  @Field(() => MessagesAwayMessage, { nullable: true })
  @SDKField()
  awayMessage?: MessagesAwayMessage;
}
