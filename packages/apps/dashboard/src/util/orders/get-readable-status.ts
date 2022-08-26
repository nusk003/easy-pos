import { Order, OrderStatus } from '@hm/sdk';

export const getReadableOrderStatus = (order: Order): string => {
  switch (order.status) {
    case OrderStatus.Rejected:
      return 'Order Rejected';

    case OrderStatus.Completed:
      return 'Order Completed';

    case OrderStatus.Ready:
      return 'Order Completed';

    case OrderStatus.Approved:
      return 'Order Approved';

    case OrderStatus.Waiting:
      return 'Order Created';

    default:
      return 'Order Created';
  }
};
