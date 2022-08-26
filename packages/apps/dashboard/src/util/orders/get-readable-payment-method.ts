import { PaymentType } from '@hm/sdk';

export const getReadablePaymentMethod = (paymentMethod: PaymentType) => {
  switch (paymentMethod) {
    case PaymentType.Cash:
      return 'Paid in person';

    case PaymentType.RoomBill:
      return 'Room Bill';

    case PaymentType.Card:
      return 'Card';

    case PaymentType.None:
      return 'None';

    default:
      return '';
  }
};
