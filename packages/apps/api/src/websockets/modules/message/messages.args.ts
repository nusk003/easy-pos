import { IsMongoId, IsOptional, IsString, IsUUID } from 'class-validator';

export class SendMessageArgs {
  @IsUUID()
  token: string;

  @IsString()
  text: string;

  @IsMongoId()
  @IsOptional()
  threadId?: string;

  @IsMongoId()
  @IsOptional()
  guestId?: string;

  @IsMongoId()
  @IsOptional()
  orderId?: string;
}
