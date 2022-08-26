import { Order, OrderStatus } from '@src/modules/order/order.entity';
import { Type } from 'class-transformer';
import { IsEnum, IsNumber } from 'class-validator';

export class AutoProgressOrderArgs {
  @Type(() => Order)
  order: Order;

  @IsEnum(OrderStatus)
  status: OrderStatus;

  @IsNumber({ maxDecimalPlaces: 0 })
  waitDuration: number;
}
