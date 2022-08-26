import {
  OrderItem,
  Pricelist,
  PricelistDeliveryType,
  PricelistMultiplierType,
  PricelistItem,
  PricelistSurcharge,
  Space,
} from '@hm/sdk';
import dayjs from 'dayjs';
import {
  EditablePricelist,
  PricelistBasketItem,
  PricelistWithBasketItem,
} from './spaces.types';

export const getOrderItemsFromPricelistItems = (
  orderItems: PricelistBasketItem[],
  pricelist: Pricelist | PricelistWithBasketItem | undefined,
  deliveryType: PricelistDeliveryType
): OrderItem[] => {
  const items = orderItems
    ?.map((item) => {
      const pricelistItem = pricelist?.catalog?.categories
        .flatMap((category) => (category?.items || []) as PricelistItem[])
        .find((i) => i.id === item.id);

      if (!pricelistItem || pricelistItem.snoozed) {
        return undefined;
      }

      let modifierPrice = 0;
      const itemOptions = item.modifiers?.flatMap(
        (modifier) => modifier.options
      );
      const pricelistItemOptions = pricelistItem.modifiers?.flatMap(
        (modifier) => modifier.options
      );

      if (itemOptions?.length) {
        itemOptions.forEach((option) => {
          const pricelistOption = pricelistItemOptions.find(
            (o) => o.id === option.id
          );
          modifierPrice += pricelistOption?.price || 0;
        });
      }

      const quantity = item.quantity || 1;
      let itemPrice =
        deliveryType === PricelistDeliveryType.Room
          ? pricelistItem.roomServicePrice
          : pricelistItem.regularPrice;

      const discount = item.promotions?.discounts?.[0];

      if (discount) {
        if (discount.type === PricelistMultiplierType.Absolute) {
          itemPrice -= itemPrice <= discount.value ? 0 : discount.value;
        } else {
          itemPrice *= 1 - discount.value;
        }
      }

      const totalPrice = (itemPrice + modifierPrice) * quantity;

      const newItem = {
        ...item,
        name: pricelistItem.name,
        discount: discount
          ? {
              id: discount.id,
              name: discount.name,
              type: discount.type,
              value: discount.value,
              posId: discount.posId,
            }
          : null,
        quantity,
        totalPrice,
      };

      if (
        deliveryType === PricelistDeliveryType.Room &&
        pricelistItem.posSettings?.roomService
      ) {
        (newItem as OrderItem).omnivoreSettings = {
          roomService: pricelistItem.posSettings.roomService,
        };
      } else {
        (newItem as OrderItem).omnivoreSettings = {
          tableService: pricelistItem.posSettings?.tableService,
        };
      }

      delete newItem?.promotions;

      return newItem as OrderItem;
    })
    .filter(Boolean) as OrderItem[];

  return items;
};

export const calculateBasketSubtotal = (basket: OrderItem[] | undefined) => {
  if (!basket?.length) {
    return 0;
  }

  const subtotal =
    basket
      .map((i) => i.totalPrice)
      ?.reduce((price: number, total: number) => price + total) || 0;

  return subtotal;
};

export const calculateBasketTotal = (
  items: OrderItem[] | undefined,
  pricelist: PricelistWithBasketItem,
  deliveryType: PricelistDeliveryType
) => {
  const subtotal = calculateBasketSubtotal(items);

  const discountValue = calculateDiscountValue(items, pricelist, deliveryType);

  const surchargeValue = calculateSurchargeValue(items, pricelist.surcharges!);

  const total = subtotal + surchargeValue - discountValue;

  return total;
};

export const getDiscount = (
  pricelist: Pricelist | PricelistWithBasketItem | undefined,
  deliveryType: PricelistDeliveryType
) => {
  const discount = pricelist?.promotions?.discounts?.find(({ delivery }) => {
    if (
      (deliveryType === PricelistDeliveryType.Room &&
        delivery?.find(
          (d) => d.enabled && d.type === PricelistDeliveryType.Room
        )) ||
      (deliveryType === PricelistDeliveryType.Table &&
        delivery?.find(
          (d) => d.enabled && d.type === PricelistDeliveryType.Table
        ))
    ) {
      return true;
    }
  });

  return discount;
};

export const calculateDiscountValue = (
  items: OrderItem[] | undefined,
  pricelist: PricelistWithBasketItem,
  deliveryType: PricelistDeliveryType
) => {
  const discount = getDiscount(pricelist, deliveryType);

  const subtotal = calculateBasketSubtotal(items);

  if (discount?.minOrderAmount && discount.minOrderAmount > subtotal) {
    return 0;
  }

  if (discount?.type === PricelistMultiplierType.Absolute) {
    return subtotal > discount.value ? discount.value : subtotal;
  }

  return discount ? discount.value * subtotal : 0;
};

export const getSurcharges = (
  pricelist: PricelistWithBasketItem | Pricelist | undefined,
  deliveryType: PricelistDeliveryType
) => {
  return pricelist?.surcharges?.filter(({ delivery }) => {
    if (
      (deliveryType === PricelistDeliveryType.Room &&
        delivery?.find(
          (d) => d.enabled && d.type === PricelistDeliveryType.Room
        )) ||
      (deliveryType === PricelistDeliveryType.Table &&
        delivery?.find(
          (d) => d.enabled && d.type === PricelistDeliveryType.Table
        ))
    ) {
      return true;
    }
  });
};

export const calculateSurchargeValue = (
  items: OrderItem[] | undefined,
  surcharges: PricelistSurcharge[] | undefined
) => {
  if (!surcharges) {
    return 0;
  }

  const subtotal = calculateBasketSubtotal(items);

  const surchargePercentage =
    surcharges
      ?.filter(
        (surcharge) => surcharge.type === PricelistMultiplierType.Percentage
      )
      .reduce((current, total) => {
        return current + total.value;
      }, 1) || 0;

  const surchargeAbsoluteValue =
    surcharges
      ?.filter(
        (surcharge) => surcharge.type === PricelistMultiplierType.Absolute
      )
      .reduce((current, total) => {
        return current + total.value;
      }, 0) || 0;

  let surchargeValue =
    subtotal * (surchargePercentage - 1) + surchargeAbsoluteValue;

  return surchargeValue;
};

export const calculateSurcharges = (
  items: OrderItem[] | undefined,
  pricelist: PricelistWithBasketItem,
  deliveryType: PricelistDeliveryType
) => {
  const subtotal = calculateBasketSubtotal(items);
  const surcharges = getSurcharges(pricelist, deliveryType);

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

export const formatSpaceDate = (date: Date = new Date()): string => {
  const check = dayjs(date);
  const today = dayjs();
  const nextWeek = today.add(6, 'days');

  if (today.isSame(check, 'month') && check.isBefore(nextWeek)) {
    return check.format('ddd');
  }

  return check.format('D MMM');
};

export const isPricelistVisible = (
  pricelist: Pricelist | EditablePricelist
) => {
  const isItems = (pricelist as Pricelist).catalog?.categories.some(
    (category) => {
      return category.items.length;
    }
  );

  return !!isItems;
};

export const isPricelistEnabled = (
  pricelist: Pricelist | EditablePricelist | undefined,
  deliveryType?: PricelistDeliveryType | null
) => {
  if (deliveryType === null) {
    return false;
  }

  const isCommerceDisabled = !pricelist?.commerce;

  const isFulfilmentEnabled = pricelist?.delivery?.some((d) => {
    return d.enabled;
  });

  if (!deliveryType) {
    return isCommerceDisabled || isFulfilmentEnabled;
  }

  const isFulfilmentVisible = pricelist?.delivery?.some((d) => {
    return d.enabled && d.type === deliveryType;
  });

  return isCommerceDisabled || isFulfilmentVisible;
};

export const isSpaceVisible = (
  space: Space | undefined,
  deliveryType?: PricelistDeliveryType | null
) => {
  return space?.pricelists.some((pricelist) => {
    return (
      isPricelistVisible(pricelist) &&
      (deliveryType !== undefined
        ? isPricelistEnabled(pricelist, deliveryType)
        : true)
    );
  });
};

export const isSpacePricelistsEnabled = (space: Space) => {
  const isEnabled = space
    ? isSpaceVisible(space, PricelistDeliveryType.Room) ||
      isSpaceVisible(space, PricelistDeliveryType.Table)
    : false;

  return isEnabled;
};

export const isSpacesVisible = (spaces?: Space[]) => {
  const isVisible = spaces?.some((space) => {
    return isSpacePricelistsEnabled(space) && space.enabled;
  });

  return !!isVisible;
};
