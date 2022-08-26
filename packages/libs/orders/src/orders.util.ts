import { Order, PricelistMultiplierType, PricelistSurcharge } from '@hm/sdk';
import { formatSpaceDate } from '@hm/spaces';

export const getOrderTime = (order: Order) => {
  const timeElapsed =
    (Number(new Date()) - Number(new Date(order.dateCreated))) / 1000;

  let orderTime = '';

  if (timeElapsed < 120) {
    orderTime = 'just now';
  } else if (timeElapsed < 3600) {
    orderTime = `${Math.floor(timeElapsed / 60)} mins`;
  } else if (timeElapsed < 86400) {
    orderTime = `${Math.floor(timeElapsed / 3600)} hours`;
  } else if (timeElapsed < 86400 * 7) {
    orderTime = `${Math.floor(timeElapsed / 86400)} days`;
  } else {
    orderTime = formatSpaceDate(new Date(order.dateCreated));
  }

  return orderTime;
};

export const calculateSurcharges = (order: Order) => {
  const subtotal = order.subtotal;
  const surcharges = order.surcharges;

  return surcharges?.map((surcharge) => {
    const surchargeValue =
      surcharge.type === PricelistMultiplierType.Absolute
        ? surcharge.value
        : surcharge.value * subtotal;

    return {
      id: surcharge.id,
      name: surcharge.name,
      value: surchargeValue,
      amount: surcharge.value,
      type: surcharge.type,
    };
  });
};

export const calculateDiscountValue = (order: Order) => {
  const discount = order.discount;

  if (!discount) {
    return 0;
  }

  const subtotal = order.subtotal;

  return discount.type === PricelistMultiplierType.Percentage
    ? discount.value * subtotal
    : discount.value > subtotal
    ? subtotal
    : discount.value;
};
