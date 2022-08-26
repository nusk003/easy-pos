import { Booking } from '@src/modules/booking/booking.entity';
import { Type } from 'class-transformer';
import { IsNumber } from 'class-validator';

export class SendBookingRemindersArgs {
  @Type(() => Booking)
  booking: Booking;

  @IsNumber({ maxDecimalPlaces: 0 })
  waitDuration: number;
}
