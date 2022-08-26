import * as CountryCodes from 'country-code-info';
import currencySymbols from './currency-symbols.json';
import { cache } from 'swr';
import { queryMap } from '@src/xhr/query';
import { Hotel } from '@hm/sdk';

const decode = (symbol: string): string => {
  const txt = document.createElement('textarea');
  txt.innerHTML = symbol;
  return txt.value;
};

const getCurrencySymbol = (): string => {
  const hotel: Hotel = cache.get(queryMap.hotel.key);

  const currencyCode = hotel?.currencyCode;

  const currency = currencySymbols.find((c) => {
    return c.abbreviation === currencyCode;
  });

  const symbol = currency ? currency.symbol : undefined;

  return symbol ? decode(symbol) : '$';
};

const getNumber = (value: string): number => {
  return Number(value.replace(/[^0-9.-]+/g, ''));
};

const currency = (value: string | number): string => {
  const symbol = getCurrencySymbol();

  let newValue = String(value);

  newValue = Number(getNumber(newValue)).toFixed(2);
  newValue = symbol + newValue;

  return newValue;
};

const numberOnFocus = (value: string): string => {
  return value.replace(/[^0-9.-]+/g, '');
};

const percentage = (value: string | number): string => {
  const number = getNumber(String(value));

  const percentageValue = !Number.isNaN(number)
    ? String(Math.abs(Math.min(Number(number), 100)))
    : String(0);

  return `${percentageValue}%`;
};

const float = (value: string | number): string => {
  const number = Number(String(value).replace(/[^0-9.-]+/g, ''));
  return number ? String(value).replace(/[^0-9.-]+/g, '') : '';
};

const mobile = (p: Record<string, any> | undefined): string => {
  const m =
    p?.mobile && (p?.countryCode || p?.mobileCountryCode)
      ? `+${
          CountryCodes.findCountry({
            a2: p?.mobileCountryCode || p?.countryCode,
          })?.dial
        } ${p.mobile}`
      : '';
  return m;
};

const capitalize = (str: string) => {
  return str.charAt(0).toUpperCase() + str.slice(1);
};

export const format = {
  currency,
  float,
  percentage,
  numberOnFocus,
  getCurrencySymbol,
  getNumber,
  mobile,
  capitalize,
};
