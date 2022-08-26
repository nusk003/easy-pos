import { PayoutInterval } from '@hm/sdk';

export type ReadablePayoutInterval = 'daily' | 'weekly' | 'monthly';

export const parsePayoutInterval = (
  payoutInterval: ReadablePayoutInterval
): PayoutInterval => {
  switch (payoutInterval) {
    case 'daily':
      return PayoutInterval.Daily;

    case 'weekly':
      return PayoutInterval.Weekly;

    default:
      return PayoutInterval.Monthly;
  }
};
