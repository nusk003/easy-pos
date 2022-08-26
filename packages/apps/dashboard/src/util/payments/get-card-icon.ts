import amex from '@src/assets/payments/amex.png';
import mastercard from '@src/assets/payments/mastercard.png';
import visa from '@src/assets/payments/visa.png';

export type Brands = string | undefined;

export const getCardIcon = (brand: Brands) => {
  switch (brand) {
    case 'visa':
      return visa;
    case 'mastercard':
      return mastercard;
    case 'amex':
      return amex;

    default:
      return undefined;
  }
};

export { amex, visa, mastercard };
